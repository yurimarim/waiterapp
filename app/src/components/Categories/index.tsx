import { useState } from 'react';
import { FlatList } from 'react-native';
import type { ICaterogy } from '../../types/ICategory';
import { Text } from '../Text';
import { Category, Icon } from './styles';

interface ICategoriesProps {
	categories: ICaterogy[];
}

export function Categories({ categories }: ICategoriesProps) {
	const [selectedCategory, setSelectedCategory] = useState('');

	function handleSelectCategory(categoryId: string) {
		const category = selectedCategory === categoryId ? '' : categoryId;
		setSelectedCategory(category);
	}

	return (
		<FlatList
			data={categories}
			keyExtractor={(category) => category._id}
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ paddingRight: 24 }}
			renderItem={({ item: category }) => {
				const isSelected = selectedCategory === category._id;

				return (
					<Category onPress={() => handleSelectCategory(category._id)}>
						<Icon>
							<Text opacity={isSelected ? 1 : 0.5}>{category.icon}</Text>
						</Icon>

						<Text size={14} weight='600'>
							{category.name}
						</Text>
					</Category>
				);
			}}
		/>
	);
}
