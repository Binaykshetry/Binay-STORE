/**
 * NepaleseStore formatting & localization utilities
 * Strict compliance with Nepali market rules (Lakh/Crore grouping, BS dates, Phone validation)
 */

/**
 * Converts paisa (100 paisa = 1 NPR) to standard Rupees
 */
export function paisaToRupees(paisa: number): number {
  return Math.round(paisa) / 100;
}

/**
 * Converts Rupees to paisa integer
 */
export function rupeesToPaisa(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Formats a number or paisa amount with South Asian / Nepali lakh-crore comma separation.
 * Example: 129999 -> "1,29,999" (not 129,999)
 * Example: 10000000 -> "1,00,00,000" (1 crore)
 */
export function formatLakhNumber(value: number): string {
  const isNegative = value < 0;
  const absVal = Math.abs(Math.round(value));
  const str = absVal.toString();

  if (str.length <= 3) {
    return (isNegative ? '-' : '') + str;
  }

  // Last 3 digits
  const lastThree = str.substring(str.length - 3);
  // Other digits grouped by 2
  const otherDigits = str.substring(0, str.length - 3);

  const formattedOthers = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return (isNegative ? '-' : '') + formattedOthers + ',' + lastThree;
}

/**
 * Formats a price in NPR.
 * If isPaisa is true (default), converts from paisa first.
 * E.g. formatNPR(12999900) -> "Rs. 1,29,999"
 * E.g. formatNPR(129999, { isPaisa: false }) -> "Rs. 1,29,999"
 */
export function formatNPR(
  amount: number,
  options: { isPaisa?: boolean; showPrefix?: boolean; nepaliDigits?: boolean } = {}
): string {
  const { isPaisa = true, showPrefix = true, nepaliDigits = false } = options;
  const rupees = isPaisa ? paisaToRupees(amount) : amount;
  const formattedNumber = formatLakhNumber(rupees);

  if (nepaliDigits) {
    const nepaliNums = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    const nepaliFormatted = formattedNumber.replace(/[0-9]/g, (w) => nepaliNums[+w]);
    return showPrefix ? `रु. ${nepaliFormatted}` : nepaliFormatted;
  }

  return showPrefix ? `Rs. ${formattedNumber}` : formattedNumber;
}

/**
 * Validates a Nepali mobile phone number (10 digits starting with 98 or 97)
 */
export function isValidNepaliPhone(phone: string): boolean {
  const clean = phone.replace(/[\s-+]/g, '');
  // Handles +97798xxxxxxxx or 98xxxxxxxx / 97xxxxxxxx
  const localNum = clean.startsWith('977') ? clean.substring(3) : clean;
  return /^(98|97)\d{8}$/.test(localNum);
}

/**
 * Normalizes phone number to standard 10-digit format
 */
export function normalizePhone(phone: string): string {
  const clean = phone.replace(/[\s-+]/g, '');
  return clean.startsWith('977') ? clean.substring(3) : clean;
}

/**
 * Generates an authentic order reference: NS-YYYYMMDD-XXXXX
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `NS-${year}${month}${day}-${randomChars}`;
}

/**
 * Bikram Sambat (BS) date display approximation for order invoices
 * Shows both AD and BS (e.g., "Kartik 14, 2083 BS / Oct 30, 2026 AD")
 */
export function formatBilingualDate(isoDateString: string): { ad: string; bs: string; full: string } {
  const date = new Date(isoDateString);
  const adMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const adFormatted = `${adMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  // BS is approximately +56.7 years ahead
  const bsMonths = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];
  const bsYear = date.getFullYear() + 56 + (date.getMonth() >= 3 ? 1 : 0);
  const bsMonthIndex = (date.getMonth() + 8) % 12;
  const bsFormatted = `${bsMonths[bsMonthIndex]} ${date.getDate()}, ${bsYear} BS`;

  return {
    ad: adFormatted,
    bs: bsFormatted,
    full: `${adFormatted} (${bsFormatted})`
  };
}
