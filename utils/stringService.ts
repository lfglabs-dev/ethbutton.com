export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export function minifyAddress(
  address: string | undefined,
  longVersion: boolean = false
): string {
  if (!address) return "";

  const firstPart = address.substring(0, longVersion ? 7 : 4);
  const secondPart = address.substring(
    address.length - (longVersion ? 7 : 4),
    address.length
  );

  return (firstPart + "..." + secondPart).toLowerCase();
}

export function shortenDomain(
  domain?: string,
  characterToBreak?: number
): string {
  if (!domain) return "";

  if (domain.length > (characterToBreak ?? 20)) {
    const firstPart = domain.substring(0, 5);
    const secondPart = domain.substring(domain.length - 6, domain.length);

    return (firstPart + "..." + secondPart).toLowerCase();
  } else {
    return domain.toLowerCase();
  }
}

export function numberToWords(num: number): string {
  const numWords = [
    "ZERO",
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
    "SIX",
    "SEVEN",
    "EIGHT",
    "NINE",
  ];
  return numWords[num] || num.toString();
}

export function isHexString(str: string): boolean {
  if (str === "") return true;
  return /^0x[0123456789abcdefABCDEF]+$/.test(str);
}
