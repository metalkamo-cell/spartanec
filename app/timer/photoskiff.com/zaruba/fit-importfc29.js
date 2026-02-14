(function (root, factory) {
  'use strict';
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.FitHrParser = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // Minimal FIT parser focused on extracting (t, hr) from Record messages.
  // Supports:
  // - Normal definition/data messages
  // - Compressed timestamp headers
  // - Little/big endian architectures
  // Notes:
  // - FIT timestamps are seconds since 1989-12-31 00:00:00 UTC (FIT epoch).
  // - Output `t` is normalized to start at 0 (relative seconds).

  const FIT_SIGNATURE = '.FIT';
  const FIT_EPOCH_UNIX_MS = Date.UTC(1989, 11, 31, 0, 0, 0, 0);

  function asArrayBuffer(buf) {
    if (buf instanceof ArrayBuffer) return buf;
    // Node Buffer
    if (buf && typeof buf === 'object' && typeof buf.byteLength === 'number' && buf.buffer) {
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    throw new Error('Expected ArrayBuffer');
  }

  function u8(dv, off) { return dv.getUint8(off); }
  function i8(dv, off) { return dv.getInt8(off); }
  function u16(dv, off, le) { return dv.getUint16(off, le); }
  function i16(dv, off, le) { return dv.getInt16(off, le); }
  function u32(dv, off, le) { return dv.getUint32(off, le); }
  function i32(dv, off, le) { return dv.getInt32(off, le); }

  function readString(dv, off, len) {
    let s = '';
    for (let i = 0; i < len; i++) {
      const c = dv.getUint8(off + i);
      if (c === 0) break;
      s += String.fromCharCode(c);
    }
    return s;
  }

  function baseTypeCategory(baseType) {
    // FIT base types are encoded in low 5 bits.
    return baseType & 0x1f;
  }

  function baseTypeSize(baseType) {
    // Based on FIT base type categories.
    switch (baseTypeCategory(baseType)) {
      case 0x00: return 1; // enum
      case 0x01: return 1; // sint8
      case 0x02: return 1; // uint8
      case 0x03: return 2; // sint16
      case 0x04: return 2; // uint16
      case 0x05: return 4; // sint32
      case 0x06: return 4; // uint32
      case 0x07: return 1; // string (bytes)
      case 0x08: return 4; // float32
      case 0x09: return 8; // float64
      case 0x0a: return 1; // uint8z
      case 0x0b: return 2; // uint16z
      case 0x0c: return 4; // uint32z
      case 0x0d: return 1; // byte
      case 0x0e: return 2; // sint64 (not used here)
      case 0x0f: return 2; // uint64 (not used here)
      case 0x10: return 2; // uint64z (not used here)
      default: return 1;
    }
  }

  function decodeScalar(dv, off, size, baseType, littleEndian) {
    const cat = baseTypeCategory(baseType);

    // Handle common invalid markers for integer types.
    const invalidAllOnes = (bytes) => {
      for (let i = 0; i < bytes; i++) {
        if (dv.getUint8(off + i) !== 0xff) return false;
      }
      return true;
    };

    if (cat === 0x07) {
      return readString(dv, off, size);
    }

    // If field is larger than base size, treat as array (we don't need it here).
    const bs = baseTypeSize(baseType);
    if (size !== bs) {
      // For arrays of uint8, sometimes it's still meaningful; return first element.
      if (bs === 1 && size > 0) {
        return dv.getUint8(off);
      }
      return null;
    }

    if (bs === 1 && invalidAllOnes(1)) return null;
    if (bs === 2 && invalidAllOnes(2)) return null;
    if (bs === 4 && invalidAllOnes(4)) return null;

    switch (cat) {
      case 0x00: return u8(dv, off);
      case 0x01: return i8(dv, off);
      case 0x02: return u8(dv, off);
      case 0x03: return i16(dv, off, littleEndian);
      case 0x04: return u16(dv, off, littleEndian);
      case 0x05: return i32(dv, off, littleEndian);
      case 0x06: return u32(dv, off, littleEndian);
      case 0x0a: return u8(dv, off);
      case 0x0b: return u16(dv, off, littleEndian);
      case 0x0c: return u32(dv, off, littleEndian);
      case 0x0d: return u8(dv, off);
      default:
        // floats and 64-bit types are ignored for our needs
        return null;
    }
  }

  function parseFitHr(arrayBuffer) {
    const ab = asArrayBuffer(arrayBuffer);
    const dv = new DataView(ab);

    if (dv.byteLength < 14) throw new Error('FIT file too small');

    const headerSize = dv.getUint8(0);
    if (headerSize < 12 || dv.byteLength < headerSize) throw new Error('Invalid FIT header size');

    const dataSize = u32(dv, 4, true);
    const dataType = readString(dv, 8, 4);
    if (dataType !== FIT_SIGNATURE) throw new Error('Not a FIT file');

    const dataStart = headerSize;
    const dataEnd = Math.min(dv.byteLength, dataStart + dataSize);

    // Local message definitions (0..15)
    const defs = new Array(16).fill(null);

    const outT = [];
    const outHR = [];

    let off = dataStart;
    let lastTimestamp = null; // FIT epoch seconds
    let t0 = null;

    function pushPoint(ts, hr) {
      if (!Number.isFinite(ts) || !Number.isFinite(hr)) return;
      if (hr <= 0 || hr > 255) return;
      if (t0 == null) t0 = ts;
      const rel = ts - t0;
      if (!Number.isFinite(rel) || rel < 0) return;
      outT.push(rel);
      outHR.push(hr);
    }

    while (off < dataEnd) {
      const hdr = u8(dv, off++);

      // FIT record header decoding:
      // - Normal header (bit7=0): bit6=1 => definition; bit6=0 => data; bits0-3 local message type (0..15)
      // - Compressed timestamp header (bit7=1): bits5-6 local message type (0..3), bits0-4 time offset; always data
      const isCompressedTimestamp = (hdr & 0x80) !== 0;
      const isDefinition = (!isCompressedTimestamp) && ((hdr & 0x40) !== 0);
      const hasDevFields = isDefinition && ((hdr & 0x20) !== 0);

      if (isDefinition) {
        if (off + 5 > dataEnd) break;

        // Definition message
        const reserved = u8(dv, off); off += 1;
        const architecture = u8(dv, off); off += 1;
        const littleEndian = (architecture === 0);
        const globalMsgNum = u16(dv, off, littleEndian); off += 2;
        const fieldCount = u8(dv, off); off += 1;

        const fields = [];
        for (let i = 0; i < fieldCount; i++) {
          if (off + 3 > dataEnd) break;
          const fieldNum = u8(dv, off); off += 1;
          const size = u8(dv, off); off += 1;
          const baseType = u8(dv, off); off += 1;
          fields.push({ fieldNum, size, baseType });
        }

        let devFieldCount = 0;
        let devBytes = 0;
        if (hasDevFields) {
          if (off + 1 <= dataEnd) {
            devFieldCount = u8(dv, off); off += 1;
            devBytes = devFieldCount * 3;
            off = Math.min(dataEnd, off + devBytes);
          }
        }

        const localMsgType = hdr & 0x0f;
        defs[localMsgType] = { globalMsgNum, littleEndian, fields, hasDevFields, devFieldCount };
        continue;
      }

      // Data message (normal or compressed timestamp)
      let localMsgType = hdr & 0x0f;
      let computedTimestamp = null;

      if (isCompressedTimestamp) {
        // local message type is bits 5..4 (2 bits)
        localMsgType = (hdr >> 5) & 0x03;
        const timeOffset = hdr & 0x1f;
        if (lastTimestamp != null) {
          let ts = (lastTimestamp & ~0x1f) + timeOffset;
          if (ts <= lastTimestamp) ts += 32;
          computedTimestamp = ts;
          lastTimestamp = ts;
        }
      }

      const def = defs[localMsgType];
      if (!def || !def.fields) {
        // No definition; cannot parse. Bail out to avoid desync.
        break;
      }

      // Read the fields
      let timestamp = computedTimestamp;
      let heartRate = null;

      for (const f of def.fields) {
        const size = f.size;
        if (off + size > dataEnd) { off = dataEnd; break; }

        // Record message is global 20; we only need timestamp (253) and heart_rate (3)
        if (def.globalMsgNum === 20) {
          if (f.fieldNum === 253 && timestamp == null) {
            const v = decodeScalar(dv, off, size, f.baseType, def.littleEndian);
            if (v != null) {
              timestamp = v;
              lastTimestamp = v;
            }
          } else if (f.fieldNum === 3 && heartRate == null) {
            const v = decodeScalar(dv, off, size, f.baseType, def.littleEndian);
            if (v != null) heartRate = v;
          }
        }

        off += size;
      }

      // Skip developer fields payload if present (we don't know sizes reliably; most HR files don't use them)
      if (def.hasDevFields && def.devFieldCount) {
        // Developer fields sizes are not stored in the definition in this minimal parser.
        // We cannot safely skip them without dev field definitions, so we intentionally do nothing here.
        // If you hit a file that uses developer fields, extend this parser to read dev field definitions.
      }

      if (def.globalMsgNum === 20 && timestamp != null && heartRate != null) {
        pushPoint(timestamp, heartRate);
      }
    }

    // Normalize timestamps to seconds (they are already in seconds); `t` is relative seconds.
    // Provide an absolute start time hint too.
    const startUnixMs = (t0 == null) ? null : (FIT_EPOCH_UNIX_MS + t0 * 1000);

    return {
      t: outT,
      hr: outHR,
      startUnixMs
    };
  }

  return { parseFitHr };
});
