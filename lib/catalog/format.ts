export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceCents / 100);
}

export function formatBookFormat(format: string) {
  return format.charAt(0).toUpperCase() + format.slice(1);
}
