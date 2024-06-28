import axios from 'axios';

// BaseURL
export const instance = axios.create({
    baseURL: 'http://localhost:3000/api1',
});
