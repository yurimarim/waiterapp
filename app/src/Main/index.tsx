import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import { Cart } from '../components/Cart';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Empty } from '../components/Icons/Empty';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModal';
import { Text } from '../components/Text';
import type { ICartItem } from '../types/ICartItem';
import type { ICaterogy } from '../types/ICategory';
import type { IProduct } from '../types/IProduct';
import {
	CategoriesContainer,
	CenteredContainer,
	Container,
	Footer,
	FooterContainer,
	MenuContainer
} from './styles';

export function Main() {
	const [isTableModalVisible, setIsTableModalVisible] = useState(false);
	const [selectedTable, setSelectedTable] = useState('');
	const [cartItems, setCartItems] = useState<ICartItem[]>([]);
	const [isLoading] = useState(false);
	const [categories, setCategories] = useState<ICaterogy[]>([]);
	const [products, setProducts] = useState<IProduct[]>([]);

	useEffect(() => {
		axios.get('http://192.168.237.70:3001/categories').then((response) => {
			setCategories(response.data);
		});

		axios.get('http://192.168.237.70:3001/products').then((response) => {
			setProducts(response.data);
		});
	}, []);

	function handleSaveTable(table: string) {
		setSelectedTable(table);
	}

	function handleResetOrder() {
		setSelectedTable('');
		setCartItems([]);
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
				<Header selectedTable={selectedTable} onCancelOrder={handleResetOrder} />

				{isLoading ? (
					<CenteredContainer>
						<ActivityIndicator color='#D73035' size='large' />
					</CenteredContainer>
				) : (
					<>
						<CategoriesContainer>
							<Categories categories={categories} />
						</CategoriesContainer>

						{products.length > 0 ? (
							<MenuContainer>
								<Menu products={products} onAddToCart={handleAddToCart} />
							</MenuContainer>
						) : (
							<CenteredContainer>
								<Empty />
								<Text color='#666' style={{ marginTop: 24 }}>
									Nenhum produto foi encontrado
								</Text>
							</CenteredContainer>
						)}
					</>
				)}
			</Container>

			<Footer>
				<FooterContainer>
					{!selectedTable && (
						<Button onPress={() => setIsTableModalVisible(true)} disabled={isLoading}>
							Novo Pedido
						</Button>
					)}

					{selectedTable && (
						<Cart
							cartItems={cartItems}
							onAdd={handleAddToCart}
							onDecrement={handleDecrementCartItem}
							onConfirmOrder={handleResetOrder}
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
