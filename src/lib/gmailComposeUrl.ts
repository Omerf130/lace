/** Opens Gmail compose in the browser for the given recipient address. */
export function gmailComposeUrl(to: string): string {
  const trimmed = to.trim();
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(trimmed)}`;
}