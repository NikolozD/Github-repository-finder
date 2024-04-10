import axios from 'axios';

export const instance = axios.create({
    headers: { Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}` },
});
