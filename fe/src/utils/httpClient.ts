import axios from 'axios';

export const httpClient = axios.create({
	baseURL: 'http://192.168.237.70:3001',
	headers: {
		'Content-Type': 'application/json'
	}
});
