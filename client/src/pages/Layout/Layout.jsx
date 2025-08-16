import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RegistrationFooter from '../../components/Layout/RegistrationFooter';
import AuthHeader from '../../components/Layout/AuthHeader';
import AtomHeader from '../../components/AtomHeader/AtomHeader';
import AtomFooter from '../../components/AtomFooter/AtomFooter';
import styles from './Layout.module.sass';

const Layout = props => {
    const { pathname } = useLocation();

    const isRegisterPathname = pathname === '/registration';
    const isAuthPathname = pathname === '/login' || isRegisterPathname;
    const isHowItWorksPathname = pathname === '/howItWorks';

    return (
        <div className={styles.container}>
            {isAuthPathname && <AuthHeader />}
            {isHowItWorksPathname && <AtomHeader />}
            {!isAuthPathname && !isHowItWorksPathname && <Header />}

            <div className={styles.content}>
                <Outlet />
            </div>

            {isAuthPathname && <RegistrationFooter />}
            {isHowItWorksPathname && <AtomFooter />}
            {!isAuthPathname && !isHowItWorksPathname && <Footer />}
        </div>
    );
};

export default Layout;
