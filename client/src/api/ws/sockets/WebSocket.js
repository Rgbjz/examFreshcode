import io from 'socket.io-client';
import CONSTANTS from '../../../constants';

class WebSocket {
    constructor (dispatch, getState, room) {
        this.dispatch = dispatch;
        this.getState = getState;

        const base = CONSTANTS.SOCKET_URL.endsWith('/')
            ? CONSTANTS.SOCKET_URL.slice(0, -1)
            : CONSTANTS.SOCKET_URL;

        this.socket = io(`${base}/${room}`, {
            transports: ['websocket', 'polling'],
        });
    }

    init = () => {
        this.listen();
    };

    listen = () => {
        this.socket.on('connect', () => {
            this.anotherSubscribes();
        });
    };

    anotherSubscribes = () => {};
}

export default WebSocket;
