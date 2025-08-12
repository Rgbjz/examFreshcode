import http from '../interceptor';

export const getUser = () => http.get('users/getUser');
export const changeMark = (data) => http.patch('users/changeMark', data);
export const cashOut = (data) => http.post('users/cashout', data);
export const updateUser = (data) => http.patch('users/updateUser', data);
