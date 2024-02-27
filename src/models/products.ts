// export type SaleType = 'amount' | 'g' | 'kg' | 'litre' | 'ml';
export type SaleType = string;

export type ProductBarcode = {
  id: string;
  type: string;
  sub_type: string;
  name: string;
  trademark: string;
  packaging: string;
  type_code: string;
  barcode: number;
  reg_number: number;
  year: number;
  createdAt: string;
};

export type ProductFilter = {
  barcode?: number;
  name?: string;
  productIds?: string[];
  minCount?: number;
  limit?: number;
  page?: number;
};

export type Product = {
  id: string;
  createdAt: string;
  marketId: string;
  barcode: number;
  name: string;
  saleType: SaleType;
  packaging: string;
  price: number;
  quantity: number;
};

export type ProductAdd = {
  barcode: number;
  name: string;
  saleType: SaleType;
  packaging: string;
  price: number;
  quantity: number;
};

export type ProductAddForm = {
  barcode: string;
  name: string;
  saleType: SaleType;
  packaging: string;
  price: string;
  quantity: string;
};

export type ProductAddData = {
  barcode?: number;
  name?: string;
  packaging?: string;
};

export type ProductBarcodeAdd = {
  barcode: number;
  trademark: string;
  packaging: string;
  saleType?: SaleType;
};

export type ProductBarcodeAddForm = {
  barcode: string;
  trademark: string;
  packaging: string;
  saleType?: SaleType;
};

export type Stats = {
  products: number;
  barcodes: number;
};

export type PaginatedResponse<A> = {
  data: A[];
  total: number;
};
