export type OrderItem = {
  title: string;
  price: number;
  productId: string;
  amount: number;
  maxAmount: number;
};

export type Order = {
  items: {
    productId: string;
    amount: number;
  }[];
  discountPercent?: number;
  paymentReceived?: number;
};
