import http from '../interceptor';
import queryString from 'query-string';

export const setNewOffer = data => http.post('offers/setNewOffer', data);
export const setOfferStatus = data => http.patch('offers/setOfferStatus', data);
export const downloadContestFile = data =>
    http.get(`contests/downloadFile/${data.fileName}`);
export const getCustomersContests = data =>
    http.get(`contests/byCustomer?${queryString.stringify(data)}`);
export const updateContest = (contestId, formData) =>
    http.patch(`contests/${contestId}`, formData);
export const getActiveContests = params => http.get('contests', { params });
export const dataForContest = data =>
    http.post('contests/dataForContest', data);
export const getContestById = ({ contestId }) =>
    http.get(`contests/${contestId}`);
