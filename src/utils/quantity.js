export const adjustQuantity = (quantity, mode) => {
  if (mode === "more") return quantity + 1;
  if (mode === "less") return Math.max(1, quantity - 1);

  return quantity;
};
