import React from 'react';
import { toast } from 'react-toastify';
import WebSocket from './WebSocket';
import Notification from '../../../components/Notification/Notification';

class NotificationSocket extends WebSocket {
    constructor (dispatch, getState, room) {
        super(dispatch, getState, room);
    }

    anotherSubscribes = socket => {
        this.onEntryCreated(socket);
        this.onChangeMark(socket);
        this.onChangeOfferStatus(socket);
    };

    onChangeMark = socket => {
        socket.on('changeMark', () => {
            toast('Someone liked your offer');
        });
    };

    onChangeOfferStatus = socket => {
        socket.on('changeOfferStatus', message => {
            toast(
                <Notification
                    message={message.message}
                    contestId={message.contestId}
                />
            );
        });
    };

    onEntryCreated = socket => {
        socket.on('onEntryCreated', () => {
            toast('New Entry');
        });
    };

    subscribe = id => {
        this.socket.emit('subscribe', id);
    };

    unsubscribe = id => {
        this.socket.emit('unsubscribe', id);
    };
}

export default NotificationSocket;
