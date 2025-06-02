import { useState } from 'react';
import type { IOrder } from '../../types/Order';
import { OrderModal } from '../OrderModal';
import { Board, OrdersContainer } from './styles';

interface IOrdersBoardProps {
	icon: string;
	title: string;
	orders: IOrder[];
}

export function OrdersBoard({ icon, title, orders }: IOrdersBoardProps) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

	function handleOpenModal(order: IOrder) {
		setSelectedOrder(order);
		setIsModalVisible(true);
	}

	function handleCloseModal() {
		setSelectedOrder(null);
		setIsModalVisible(false);
	}

	return (
		<Board>
			<OrderModal visible={isModalVisible} order={selectedOrder} onClose={handleCloseModal} />

			<header>
				<span>{icon}</span>
				<strong>{title}</strong>
				<span>{`(${orders.length})`}</span>
			</header>

			{orders.length > 0 && (
				<OrdersContainer>
					{orders.map((order) => (
						<button type='button' key={order._id} onClick={() => handleOpenModal(order)}>
							<strong>Mesa {order.table}</strong>
							<span>{order.products.length} itens</span>
						</button>
					))}
				</OrdersContainer>
			)}
		</Board>
	);
}
