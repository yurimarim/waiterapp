import { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { OrderConfirmedModal } from '../../OrderConfirmedModal';
import type { ICartItem } from '../../types/ICartItem';
import type { IProduct } from '../../types/IProduct';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { MinusCircle } from '../Icons/MinusCircle';
import { PlusCircle } from '../Icons/PlusCircle';
import { Text } from '../Text';
import {
	Actions,
	Image,
	Item,
	ProductContainer,
	ProductDetails,
	QuantityContainer,
	Summary,
	TotalContainer
} from './styles';

interface ICartProps {
	cartItems: ICartItem[];
	onAdd(product: IProduct): void;
	onDecrement(product: IProduct): void;
	onConfirmOrder(): void;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder }: ICartProps) {
	const [isLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const total = cartItems.reduce((acc, cartItem) => {
		return acc + cartItem.quantity * cartItem.product.price;
	}, 0);

	function handleConfirmOrder() {
		setIsModalVisible(true);
	}

	function handleOk() {
		onConfirmOrder();
		setIsModalVisible(false);
	}

	return (
		<>
			<OrderConfirmedModal visible={isModalVisible} onOk={handleOk} />

			{cartItems.length > 0 && (
				<FlatList
					data={cartItems}
					keyExtractor={(cartItem) => cartItem.product._id}
					showsVerticalScrollIndicator={false}
					style={{ marginBottom: 20, maxHeight: 150 }}
					renderItem={({ item: cartItem }) => (
						<Item>
							<ProductContainer>
								<Image
									source={{
										uri: `http://192.168.237.70:3001/uploads/${cartItem.product.imagePath}`
									}}
								/>

								<QuantityContainer>
									<Text size={14} color='#666'>
										{cartItem.quantity}x
									</Text>
								</QuantityContainer>

								<ProductDetails>
									<Text size={14} weight='600'>
										{cartItem.product.name}
									</Text>
									<Text size={14} color='#666' style={{ marginTop: 4 }}>
										{formatCurrency(cartItem.product.price)}
									</Text>
								</ProductDetails>
							</ProductContainer>

							<Actions>
								<TouchableOpacity onPress={() => onAdd(cartItem.product)}>
									<PlusCircle />
								</TouchableOpacity>

								<TouchableOpacity onPress={() => onDecrement(cartItem.product)}>
									<MinusCircle />
								</TouchableOpacity>
							</Actions>
						</Item>
					)}
				/>
			)}

			<Summary>
				<TotalContainer>
					{cartItems.length > 0 ? (
						<>
							<Text color='#666'>Total</Text>
							<Text size={20} weight='600'>
								{formatCurrency(total)}
							</Text>
						</>
					) : (
						<Text color='#999'>Seu carrinho está vazio</Text>
					)}
				</TotalContainer>

				<Button
					onPress={handleConfirmOrder}
					disabled={cartItems.length === 0}
					loading={isLoading}
				>
					Confirmar pedido
				</Button>
			</Summary>
		</>
	);
}
