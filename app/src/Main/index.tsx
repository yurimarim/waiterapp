import { useState } from 'react';
import { Button } from '../components/Button';
import { Cart } from '../components/Cart';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModal';
import type { ICartItem } from '../types/ICartItem';
import type { IProduct } from '../types/IProduct';
import {
	CategoriesContainer,
	Container,
	Footer,
	FooterContainer,
	MenuContainer
} from './styles';

export function Main() {
	const [isTableModalVisible, setIsTableModalVisible] = useState(false);
	const [selectedTable, setSelectedTable] = useState('');
	const [cartItems, setCartItems] = useState<ICartItem[]>([]);

	function handleSaveTable(table: string) {
		setSelectedTable(table);
	}

	function handleCancelOrder() {
		setSelectedTable('');
	}

	function handleAddToCart(product: IProduct) {
		if (!selectedTable) {
			setIsTableModalVisible(true);
		}

		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(
				(cartItems) => cartItems.product._id === product._id
			);

			if (itemIndex < 0) {
				return prevState.concat({ quantity: 1, product });
			}

			const newCartItem = [...prevState];
			const item = newCartItem[itemIndex];

			newCartItem[itemIndex] = {
				...item,
				quantity: item.quantity + 1
			};

			return newCartItem;
		});
	}

	function handleDecrementCartItem(product: IProduct) {
		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(
				(cartItems) => cartItems.product._id === product._id
			);

			const item = prevState[itemIndex];
			const newCartItems = [...prevState];

			if (item.quantity === 1) {
				newCartItems.splice(itemIndex, 1);

				return newCartItems;
			}

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity - 1
			};

			return newCartItems;
		});
	}

	return (
		<>
			<Container>
				<Header selectedTable={selectedTable} onCancelOrder={handleCancelOrder} />

				<CategoriesContainer>
					<Categories />
				</CategoriesContainer>

				<MenuContainer>
					<Menu onAddToCart={handleAddToCart} />
				</MenuContainer>
			</Container>

			<Footer>
				<FooterContainer>
					{!selectedTable && (
						<Button onPress={() => setIsTableModalVisible(true)}>Novo Pedido</Button>
					)}

					{selectedTable && (
						<Cart
							cartItems={cartItems}
							onAdd={handleAddToCart}
							onDecrement={handleDecrementCartItem}
						/>
					)}
				</FooterContainer>
			</Footer>

			<TableModal
				visible={isTableModalVisible}
				onClose={() => setIsTableModalVisible(false)}
				onSave={handleSaveTable}
			/>
		</>
	);
}
