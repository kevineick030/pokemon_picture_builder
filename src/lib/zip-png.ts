// ── CRC-32 ────────────────────────────────────────────────────────────────

export function crc32(data: Uint8Array): number {
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (const byte of data) crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

// ── PNG pHYs DPI injection ─────────────────────────────────────────────────

export function addDpiMetadataToPng(base64: string, dpi: number): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const ppm = Math.round((dpi * 10000) / 254);

  const physData = new Uint8Array(9);
  const dv = new DataView(physData.buffer);
  dv.setUint32(0, ppm, false);
  dv.setUint32(4, ppm, false);
  physData[8] = 1;

  const typeBytes = new TextEncoder().encode("pHYs");
  const crcInput = new Uint8Array(13);
  crcInput.set(typeBytes, 0);
  crcInput.set(physData, 4);
  const crc = crc32(crcInput);

  const chunk = new Uint8Array(21);
  const cdv = new DataView(chunk.buffer);
  cdv.setUint32(0, 9, false);
  chunk.set(typeBytes, 4);
  chunk.set(physData, 8);
  cdv.setUint32(17, crc, false);

  // Insert after 8-byte signature + 25-byte IHDR chunk = offset 33
  const result = new Uint8Array(bytes.length + 21);
  result.set(bytes.slice(0, 33), 0);
  result.set(chunk, 33);
  result.set(bytes.slice(33), 54);

  let out = "";
  for (let i = 0; i < result.length; i++) out += String.fromCharCode(result[i]);
  return btoa(out);
}

// ── ZIP builder (STORED, no compression) ──────────────────────────────────

function concat(arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const result = new Uint8Array(total);
  let off = 0;
  for (const a of arrays) { result.set(a, off); off += a.length; }
  return result;
}

function u32le(n: number): Uint8Array {
  return new Uint8Array([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]);
}

function u16le(n: number): Uint8Array {
  return new Uint8Array([n & 0xff, (n >> 8) & 0xff]);
}

export function buildZip(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const SIG_LFH  = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
  const SIG_CDE  = new Uint8Array([0x50, 0x4b, 0x01, 0x02]);
  const SIG_EOCD = new Uint8Array([0x50, 0x4b, 0x05, 0x06]);

  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let localOffset = 0;

  for (const file of files) {
    const name = new TextEncoder().encode(file.name);
    const checksum = crc32(file.data);
    const size = file.data.length;

    const lfh = concat([
      SIG_LFH,
      u16le(20), u16le(0), u16le(0),       // version needed, flags, compression=STORED
      u16le(0),  u16le(0),                  // mod time, mod date
      u32le(checksum), u32le(size), u32le(size),
      u16le(name.length), u16le(0),         // name len, extra len
      name,
    ]);

    const cde = concat([
      SIG_CDE,
      u16le(20), u16le(20), u16le(0), u16le(0), // versions, flags, compression
      u16le(0),  u16le(0),                       // mod time, date
      u32le(checksum), u32le(size), u32le(size),
      u16le(name.length), u16le(0), u16le(0),    // name, extra, comment len
      u16le(0),  u16le(0),                       // disk start, int attrs
      u32le(0),  u32le(localOffset),             // ext attrs, LFH offset
      name,
    ]);

    localParts.push(lfh, file.data);
    centralParts.push(cde);
    localOffset += lfh.length + size;
  }

  const centralSize = centralParts.reduce((s, p) => s + p.length, 0);
  const eocd = concat([
    SIG_EOCD,
    u16le(0), u16le(0),
    u16le(files.length), u16le(files.length),
    u32le(centralSize), u32le(localOffset),
    u16le(0),
  ]);

  return concat([...localParts, ...centralParts, eocd]);
}
