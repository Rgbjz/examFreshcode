import React from 'react';
import { connect } from 'react-redux';
import {
    getCatalogList,
    removeChatFromCatalog,
} from '../../../../store/slices/chatSlice';
import CatalogList from '../CatalogList/CatalogList';
import DialogList from '../../DialogComponents/DialogList/DialogList';

class CatalogListContainer extends React.Component {
    componentDidMount () {
        this.props.getCatalogList();
    }

    removeChatFromCatalog = (event, chatId) => {
        const { id: catalogId } = this.props.chatStore.currentCatalog || {};
        if (!catalogId) return;

        this.props.removeChatFromCatalog({ chatId, catalogId });
        event.stopPropagation();
    };

    getDialogsPreview = () => {
        const { messagesPreview, currentCatalog } = this.props.chatStore;
        if (!currentCatalog || !currentCatalog.chats) return [];
        const chatIds = currentCatalog.chats.map(chat =>
            chat.id ? chat.id : chat
        );
        return messagesPreview.filter(msg => chatIds.includes(msg.id));
    };

    render () {
        const { catalogList, isShowChatsInCatalog } = this.props.chatStore;
        const { id: userId } = this.props.userStore.data || {};

        return (
            <>
                {isShowChatsInCatalog ? (
                    <DialogList
                        userId={userId}
                        preview={this.getDialogsPreview()}
                        removeChat={this.removeChatFromCatalog}
                    />
                ) : (
                    <CatalogList catalogList={catalogList} />
                )}
            </>
        );
    }
}

const mapStateToProps = state => {
    const { chatStore, userStore } = state;
    return { chatStore, userStore };
};

const mapDispatchToProps = dispatch => ({
    getCatalogList: () => dispatch(getCatalogList()),
    removeChatFromCatalog: data => dispatch(removeChatFromCatalog(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CatalogListContainer);
