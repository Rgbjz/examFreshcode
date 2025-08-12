import http from '../interceptor';

export const getPreviewChat = () => http.get('chat/getPreview');
export const getDialog = data =>
    http.get(`chat/getChat/${data.interlocutorId}`);
export const newMessage = data => http.post('chat/newMessage', data);
export const changeChatFavorite = data => http.patch('chat/favorite', data);
export const changeChatBlock = data => http.patch('chat/blackList', data);
export const getCatalogList = () => http.get('chat/getCatalogs');
export const addChatToCatalog = data =>
    http.post('chat/addNewChatToCatalog', data);
export const createCatalog = data => http.post('chat/createCatalog', data);
export const deleteCatalog = ({ catalogId }) =>
    http.delete(`chat/deleteCatalog/${catalogId}`);
export const removeChatFromCatalog = ({ catalogId, chatId }) =>
    http.delete(`chat/removeChatFromCatalog/${catalogId}/${chatId}`);
export const changeCatalogName = data =>
    http.patch('chat/updateNameCatalog', data);
