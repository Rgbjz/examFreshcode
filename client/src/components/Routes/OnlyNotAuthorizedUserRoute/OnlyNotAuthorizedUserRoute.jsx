import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { getUser } from '../../../store/slices/userSlice';
import Spinner from '../../Spinner/Spinner';

const OnlyNotAuthorizedUserRoute = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data, isFetching } = useSelector(state => state.userStore);

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            navigate('/', { replace: true });
        }
    }, [data, navigate]);

    if (isFetching) {
        return <Spinner />;
    }

    return data ? null : <Outlet />;
};

export default OnlyNotAuthorizedUserRoute;
