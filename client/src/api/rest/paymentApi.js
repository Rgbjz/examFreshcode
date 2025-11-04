import http from '../interceptor';

export const cashOut = data => http.post('payment/cashout', data);
export const payMent = data => http.post('payment', data.formData);
