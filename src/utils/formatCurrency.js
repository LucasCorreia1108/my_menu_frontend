export const formatCurrency = (value) => {
  const number = Number(value);
  const amount = Number.isFinite(number) ? number : 0;

  return `R$ ${amount.toFixed(2)}`;
};
