const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

export const formatPrice = (amount) => priceFormatter.format(amount);
