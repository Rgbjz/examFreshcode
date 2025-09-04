import styles from './AtomHeader.module.sass';
import { useState } from 'react';
import {
    FaSearch,
    FaUser,
    FaPhone,
    FaHeart,
    FaBars,
    FaTimes,
} from 'react-icons/fa';
import AtomNav from '../AtomNav/AtomNav';
import CONSTANTS from '../../constants';
import { Link } from 'react-router-dom';

const AtomHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className={styles.header}>
            <Link to={'/home'} className={styles.left}>
                <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}atom-logo.webp`}
                    alt='Atom'
                    className={styles.logo}
                />
            </Link>

            <div
                className={`${styles.navWrapper} ${
                    isMenuOpen ? styles.open : ''
                }`}
            >
                <AtomNav />
            </div>

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
            <button
                className={styles.burger}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
        </header>
    );
};

export default AtomHeader;
