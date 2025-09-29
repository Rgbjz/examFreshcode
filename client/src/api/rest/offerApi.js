import http from '../interceptor';
import queryString from 'query-string';

export const setNewOffer = data => http.post('offers/setNewOffer', data);
export const setOfferStatus = data => http.patch('offers/setOfferStatus', data);
export const getAllOffers = params =>
    http.get(`offers?${queryString.stringify(params)}`);
export const getMyOffers = params =>
    http.get(`offers/my?${queryString.stringify(params)}`);
