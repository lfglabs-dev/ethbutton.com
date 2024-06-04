export const UINT_128_MAX = (BigInt(1) << BigInt(128)) - BigInt(1);

export function toUint256(n: string): { low: string; high: string } {
  const b = BigInt(n);
  return {
    low: (b & UINT_128_MAX).toString(),
    high: (b >> BigInt(128)).toString(),
  };
}
