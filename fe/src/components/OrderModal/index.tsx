import { useEffect } from 'react';
import closeIcon from '../../assets/images/close-icon.svg';
import type { IOrder } from '../../types/Order';
import { formatCurrency } from '../../utils/formatCurrency';
import { Actions, ModalBody, OrderDetails, Overlay } from './styles';

interface IOrderModalProps {
	visible: boolean;
	order: IOrder | null;
	isLoading: boolean;
	onClose(): void;
	onCancelOrder(): Promise<void>;
	onChangeOrderStatus(): void;
}

export function OrderModal({
	visible,
	order,
	isLoading,
	onClose,
	onCancelOrder,
	onChangeOrderStatus
}: IOrderModalProps) {
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				onClose();
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [onClose]);

	if (!visible || !order) return null;

	const total = order.products.reduce((total, { product, quantity }) => {
		return total + product.price * quantity;
	}, 0);

	return (
		<Overlay>
			<ModalBody>
				<header>
					<strong>Mesa {order.table}</strong>

					<button type='button' onClick={onClose}>
						<img src={closeIcon} alt='Ícone de fechar' />
					</button>
				</header>

				<div className='status-container'>
					<small>Status do Pedido</small>

					<div>
						<span>{order.status === 'WAITING' && '🕥'}</span>
						<span>{order.status === 'IN_PRODUCTION' && '🧑🏻‍🍳'}</span>
						<span>{order.status === 'DONE' && '✅'}</span>

						<strong>
							<span>{order.status === 'WAITING' && 'Fila de espera'}</span>
							<span>{order.status === 'IN_PRODUCTION' && 'Em preparação'}</span>
							<span>{order.status === 'DONE' && 'Pronto!'}</span>
						</strong>
					</div>
				</div>

				<OrderDetails>
					<strong>Itens</strong>

					<div className='order-items'>
						{order.products.map(({ _id, product, quantity }) => (
							<div className='item' key={_id}>
								<img
									src={`http://localhost:3001/uploads/${product.imagePath}`}
									alt={product.name}
									width='56'
									height='28.51'
								/>

								<span className='quantity'>{quantity}x</span>

								<div className='product-details'>
									<strong>{product.name}</strong>
									<span>{formatCurrency(product.price)}</span>
								</div>
							</div>
						))}
					</div>

					<div className='total'>
						<span>Total</span>
						<strong>{formatCurrency(total)}</strong>
					</div>
				</OrderDetails>

				<Actions>
					{order.status !== 'DONE' && (
						<button
							type='button'
							className='primary'
							onClick={onChangeOrderStatus}
							disabled={isLoading}
						>
							<span>
								{order.status === 'WAITING' && '🧑🏻‍🍳'}
								{order.status === 'IN_PRODUCTION' && '✅'}
							</span>
							<span>{order.status === 'IN_PRODUCTION' && ''}</span>
							<strong>
								{order.status === 'WAITING' && 'Iniciar Produção'}
								{order.status === 'IN_PRODUCTION' && 'Concluir Pedido'}
							</strong>
						</button>
					)}

					<button
						type='button'
						className='secondary'
						onClick={onCancelOrder}
						disabled={isLoading}
					>
						Cancelar Pedido
					</button>
				</Actions>
			</ModalBody>
		</Overlay>
	);
}
