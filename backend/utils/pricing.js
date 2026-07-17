export const calculateOrderTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);
