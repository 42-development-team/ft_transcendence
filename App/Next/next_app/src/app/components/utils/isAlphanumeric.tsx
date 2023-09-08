
export function isAlphanumeric(str: string): boolean {
  const regex = /^[a-z0-9]+$/i;
  return regex.test(str);
}