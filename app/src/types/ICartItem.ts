import type { IProduct } from './IProduct';

export interface ICartItem {
	product: IProduct;
	quantity: number;
}
