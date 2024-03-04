import {
  PaginatedResponse,
  Product,
  ProductAdd,
  ProductBarcode,
  ProductBarcodeAdd,
  ProductFilter,
  Stats,
} from '@/models/products';
import axiosClient from '@/services/axios';
import {storage} from '@/lib/storage';

export function validateBarcode(barcode: string): boolean {
  return /^[1-9]\d{7,13}$/.test(barcode);
}

export async function getByBarcode(
  barcode: string,
): Promise<ProductBarcode | undefined> {
  try {
    const res = await axiosClient.get<ProductBarcode>(
      `/product/barcode/${barcode}`,
    );
    console.log('response.data', res.data);
    if (res.status === 200) {
      return res.data;
    } else if (res.status === 404) {
      storage.delete('access_token');
      storage.delete('refresh_token');
      storage.delete('authed_on');
    }
  } catch (error) {
    console.log('error occurred', error);
  }
}

export async function getProductBarcodes(limit: number = 1, page: number = 1) {
  return await axiosClient.get<PaginatedResponse<ProductBarcode>>(
    `/product/barcodes?limit=${limit}&page=${page}`,
  );
}

export async function getProducts(filter: ProductFilter) {
  return await axiosClient.post<PaginatedResponse<Product>>('/product', filter);
}

export async function addProduct(data: ProductAdd) {
  return await axiosClient.post('/product/add', data);
}

export async function addProductBarcode(data: ProductBarcodeAdd) {
  return await axiosClient.post('/product/add-barcode', data);
}

export async function getStats(): Promise<Stats> {
  type StatsType = {
    sum: number;
    typeCount: number;
    quantity: number;
  };

  const stats = await axiosClient.get<StatsType>('/product/stats');
  const barcodes = await getProductBarcodes();

  return {
    products: stats.data.typeCount,
    barcodes: barcodes.data.total,
  };
}
