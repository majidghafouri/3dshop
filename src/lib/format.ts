export function formatThousands(value: string | number | null | undefined): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}