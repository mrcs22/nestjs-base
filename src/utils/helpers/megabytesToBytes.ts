function megabytesToBytes(megabytes: number): number {
  const bytesInMegabyte = 1024 * 1024;
  const bytes = megabytes * bytesInMegabyte;
  return bytes;
}

export { megabytesToBytes };
