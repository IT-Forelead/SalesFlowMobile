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

export type ProductAdd = {
  barcode: number;
  name: string;
  saleType: SaleType;
  packaging: string;
  price: number;
  quantity: number;
};

export type ProductAddForm = {
  barcode?: number;
  name?: string;
  saleType?: SaleType;
  packaging?: string;
  price?: number;
  quantity?: number;
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
  barcode: number;
  trademark?: string;
  packaging?: string;
  saleType?: SaleType;
};

export type Stats = {
  products: number;
  barcodes: number;
};
