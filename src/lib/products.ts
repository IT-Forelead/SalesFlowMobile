import {ProductAdd, ProductBarcode} from '../models/products';
import axiosClient from '../services/axios';
import {storage} from './storage';

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

export async function addProduct(data: ProductAdd) {
  return await axiosClient.post('/product/add', data);
}
