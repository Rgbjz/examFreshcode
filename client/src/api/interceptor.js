import axios from 'axios';
import CONTANTS from '../constants';
import history from '../browserHistory';

const instance = axios.create({
    baseURL: CONTANTS.BASE_URL,
    withCredentials: true,
});

instance.interceptors.request.use(config => {
    const token = window.localStorage.getItem(CONTANTS.ACCESS_TOKEN);
    if (token) config.headers.Authorization = token;
    return config;
});

instance.interceptors.response.use(
    response => {
        if (response.data.token) {
            localStorage.setItem(CONTANTS.ACCESS_TOKEN, response.data.token);
        }
        return response;
    },
    async err => {
        const original = err.config;

        // 1️⃣ Токен протух — обычный refresh
        if (
            err.response &&
            err.response.status === 401 &&
            err.response.data?.refresh === true &&
            !original._retry
        ) {
            original._retry = true;

            try {
                const res = await axios.post(
                    `${CONTANTS.BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.token;
                localStorage.setItem(CONTANTS.ACCESS_TOKEN, newToken);
                original.headers.Authorization = newToken;

                return instance(original);
            } catch (e) {
                localStorage.removeItem(CONTANTS.ACCESS_TOKEN);
                history.replace('/login');
                return Promise.reject(e);
            }
        }

        // 2️⃣ Токена нет (удалён вручную) — пробуем refresh
        if (!localStorage.getItem(CONTANTS.ACCESS_TOKEN) && !original._retry) {
            original._retry = true;
            try {
                const res = await axios.post(
                    `${CONTANTS.BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.token;
                localStorage.setItem(CONTANTS.ACCESS_TOKEN, newToken);
                original.headers.Authorization = newToken;

                return instance(original);
            } catch (e) {
                history.replace('/login');
                return Promise.reject(e);
            }
        }

        return Promise.reject(err);
    }
);

export default instance;
