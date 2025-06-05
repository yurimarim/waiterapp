import type { ReactNode } from 'react';
import { ActivityIndicator } from 'react-native';
import { Text } from '../Text';
import { Container } from './styles';

interface IButtonProps {
	children: ReactNode;
	disabled?: boolean;
	loading?: boolean;
	onPress(): void;
}

export function Button({ children, disabled, loading, onPress }: IButtonProps) {
	return (
		<Container onPress={onPress} disabled={disabled || loading}>
			{!loading && (
				<Text weight='600' color='#FFF'>
					{children}
				</Text>
			)}

			{loading && <ActivityIndicator color='#FFF' />}
		</Container>
	);
}
