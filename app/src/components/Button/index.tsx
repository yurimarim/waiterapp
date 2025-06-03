import type { ReactNode } from 'react';
import { Text } from '../Text';
import { Container } from './styles';

interface IButtonProps {
	children: ReactNode;
	disabled?: boolean;
	onPress(): void;
}

export function Button({ children, disabled, onPress }: IButtonProps) {
	return (
		<Container onPress={onPress} disabled={disabled}>
			<Text weight='600' color='#FFF'>
				{children}
			</Text>
		</Container>
	);
}
