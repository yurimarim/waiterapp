import { useEffect, useState } from 'react';
import socketIo from 'socket.io-client';
import type { IOrder } from '../../types/Order';
import { httpClient } from '../../utils/httpClient';
import { OrdersBoard } from '../OrdersBoard';
import { Container } from './styles';

export function Orders() {
	const [orders, setOrders] = useState<IOrder[]>([]);

	const waiting = orders.filter((order) => order.status === 'WAITING');
	const inProduction = orders.filter(
		(order) => order.status === 'IN_PRODUCTION'
	);
	const done = orders.filter((order) => order.status === 'DONE');

	function handleCancelOrder(orderId: string) {
		setOrders((prevState) =>
			prevState.filter((order) => order._id !== orderId)
		);
	}

	function handleOrderStatusChange(orderId: string, status: IOrder['status']) {
		setOrders((prevState) =>
			prevState.map((order) =>
				order._id === orderId ? { ...order, status } : order
			)
		);
	}

	useEffect(() => {
		const socket = socketIo('http://localhost:3001', {
			transports: ['websocket']
		});

		socket.on('orders@new', (order) => {
			setOrders((prevState) => prevState.concat(order));
		});
	}, []);

	useEffect(() => {
		httpClient.get('/orders').then(({ data }) => {
			setOrders(data);
		});
	}, []);

	return (
		<Container>
			<OrdersBoard
				icon='🕥'
				title='Fila de espera'
				orders={waiting}
				onCancelOrder={handleCancelOrder}
				onChangeOrderStatus={handleOrderStatusChange}
			/>
			<OrdersBoard
				icon='🧑🏻‍🍳'
				title='Em preparação'
				orders={inProduction}
				onCancelOrder={handleCancelOrder}
				onChangeOrderStatus={handleOrderStatusChange}
			/>
			<OrdersBoard
				icon='✅'
				title='Pronto'
				orders={done}
				onCancelOrder={handleCancelOrder}
				onChangeOrderStatus={handleOrderStatusChange}
			/>
		</Container>
	);
}
