import WebSocket from './WebSocket';
import CONTANTS from '../../../constants';
import {
    addMessage,
    changeBlockStatusInStore,
} from '../../../store/slices/chatSlice';

class ChatSocket extends WebSocket {
    constructor (dispatch, getState, room) {
        super(dispatch, getState, room);
    }

    anotherSubscribes = socket => {
        this.onNewMessage(socket);
        this.onChangeBlockStatus(socket);
    };

    onChangeBlockStatus = socket => {
        socket.on(CONTANTS.CHANGE_BLOCK_STATUS, data => {
            this.dispatch(changeBlockStatusInStore(data.message));
        });
    };

    onNewMessage = socket => {
        socket.on('newMessage', data => {
            this.dispatch(addMessage(data.message));
        });
    };

    subscribeChat = id => {
        this.socket.emit('subscribeChat', id);
    };

    unsubscribeChat = id => {
        this.socket.emit('unsubscribeChat', id);
    };
}

export default ChatSocket;
