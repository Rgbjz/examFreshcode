import React from 'react';
import { connect } from 'react-redux';
import Catalog from '../Catalog/Catalog';
import styles from '../CatalogListContainer/CatalogListContainer.module.sass';
import {
    changeShowModeCatalog,
    deleteCatalog,
} from '../../../../store/slices/chatSlice';

const CatalogList = ({ catalogList, changeShowModeCatalog, deleteCatalog }) => {
    if (!catalogList || !catalogList.length) {
        return <span className={styles.notFound}>No catalogs found</span>;
    }

    const goToCatalog = (event, catalog) => {
        event.stopPropagation();
        const normalizedCatalog = {
            ...catalog,
            chats: catalog.chats || [],
        };
        changeShowModeCatalog(normalizedCatalog);
    };

    const handleDeleteCatalog = (event, catalogId) => {
        event.stopPropagation();
        deleteCatalog(catalogId);
    };

    return (
        <div className={styles.listContainer}>
            {catalogList.map(catalog => (
                <Catalog
                    key={catalog.id}
                    catalog={catalog}
                    goToCatalog={e => goToCatalog(e, catalog)}
                    deleteCatalog={e => handleDeleteCatalog(e, catalog.id)}
                />
            ))}
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    changeShowModeCatalog: data => dispatch(changeShowModeCatalog(data)),
    deleteCatalog: id => dispatch(deleteCatalog(id)),
});

export default connect(null, mapDispatchToProps)(CatalogList);
