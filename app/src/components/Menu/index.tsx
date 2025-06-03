import { useState } from 'react';
import { FlatList } from 'react-native';
import { products } from '../../mocks/products';
import type { IProduct } from '../../types/IProduct';
import { formatCurrency } from '../../utils/formatCurrency';
import { PlusCircle } from '../Icons/PlusCircle';
import { ProductModal } from '../ProductModal';
import { Text } from '../Text';
import {
	AddToCartButton,
	Product,
	ProductDetails,
	ProductImage,
	Separator
} from './styles';

interface IMenuProps {
	onAddToCart(product: IProduct): void;
}

export function Menu({ onAddToCart }: IMenuProps) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<null | IProduct>(null);

	function handleOpenModal(product: IProduct) {
		setIsModalVisible(true);
		setSelectedProduct(product);
	}

	return (
		<>
			<ProductModal
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				product={selectedProduct}
				onAddToCart={onAddToCart}
			/>

			<FlatList
				data={products}
				keyExtractor={(product) => product._id}
				style={{ marginTop: 32 }}
				contentContainerStyle={{ paddingHorizontal: 24 }}
				ItemSeparatorComponent={Separator}
				renderItem={({ item: product }) => (
					<Product onPress={() => handleOpenModal(product)}>
						<ProductImage
							source={{
								uri: `http://192.168.237.70:3001/uploads/${product.imagePath}`
							}}
						/>

						<ProductDetails>
							<Text weight='600'>{product.name}</Text>
							<Text color='#666' size={14} style={{ marginVertical: 8 }}>
								{product.description}
							</Text>
							<Text size={14} weight='600'>
								{formatCurrency(product.price)}
							</Text>
						</ProductDetails>

						<AddToCartButton onPress={() => onAddToCart(product)}>
							<PlusCircle />
						</AddToCartButton>
					</Product>
				)}
			/>
		</>
	);
}
