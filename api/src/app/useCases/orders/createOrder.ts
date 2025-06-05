import type { Request, Response } from 'express';
import { io } from '../../..';
import { Order } from '../../models/Order';

export async function createOrder(req: Request, res: Response) {
	try {
		const { table, products } = req.body;

		if (!table) {
			res.status(400).json({ error: 'Table is required' });
		}

		const order = await Order.create({ table, products });
		const orderDetails = await order.populate('products.product');

		io.emit('orders@new', orderDetails);
		res.status(201).json(order);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}
