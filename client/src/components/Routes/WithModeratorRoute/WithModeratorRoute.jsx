import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';

const WithModeratorRoute = () => {
    const { data, isFetching } = useSelector(state => state.userStore);

    if (isFetching) {
        return <Spinner />;
    }

    if (!data) {
        return <Navigate to='/login' />;
    }

    if (data.role !== 'moderator') {
        return <Navigate to='/' />;
    }

    return <Outlet />;
};

export default WithModeratorRoute;
