import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import CONSTANTS from '../../../constants';

const CustomerRoute = () => {
    const { data, isFetching } = useSelector(state => state.userStore);

    if (isFetching) {
        return <Spinner />;
    }

    if (!data || data.role !== CONSTANTS.CUSTOMER) {
        return <Navigate to='/' />;
    }

    return <Outlet />;
};

export default CustomerRoute;
