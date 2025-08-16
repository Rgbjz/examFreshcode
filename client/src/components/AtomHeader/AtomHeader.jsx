import React from 'react';
import styles from './AtomHeader.module.sass';
import Logo from '../../../public/staticImages/atom-logo.webp';
import { FaSearch, FaUser, FaPhone, FaHeart } from 'react-icons/fa';
import AtomNav from '../AtomNav/AtomNav';

const AtomHeader = () => {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <img src={Logo} alt='Atom' className={styles.logo} />
            </div>

            <AtomNav />

            <div className={styles.right}>
                <button className={styles.icon}>
                    <FaSearch />
                </button>
                <button className={styles.icon}>
                    <FaUser />
                </button>
                <button className={styles.icon}>
                    <FaPhone />
                </button>
                <button className={styles.icon}>
                    <FaHeart />
                </button>
            </div>
        </header>
    );
};

export default AtomHeader;
