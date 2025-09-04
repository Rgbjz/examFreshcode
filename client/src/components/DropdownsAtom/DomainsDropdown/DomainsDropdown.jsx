import DropDownLink from '../../DropDownLink/DropDownLink';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CONSTANTS from '../../../constants';
import styles from './DomainsDropdown.module.sass';

const DomainsDropdown = () => {
    return (
        <div className={styles.dropdown}>
            <div className={styles.leftContainer}>
                <DropDownLink
                    to='/domains/premium'
                    img={`${CONSTANTS.STATIC_IMAGES_PATH}cdm_icon.svg`}
                    title='Premium Domain Marketplace'
                    description='Explore the best premium domain names available for sale.'
                />
                <DropDownLink
                    to='/domains/ultra'
                    img={`${CONSTANTS.STATIC_IMAGES_PATH}upm_icon.svg`}
                    title='Ultra Premium Marketplace'
                    description='Explore the best available domain names in existence today.'
                />
                <DropDownLink
                    to='/domains/sapphire'
                    img={`${CONSTANTS.STATIC_IMAGES_PATH}sapphire_icon.svg`}
                    title='Sapphire Marketplace'
                    description='Explore the best single-English-word domains with alternative extensions.'
                />
            </div>

            <div className={styles.centerContainer}>
                <h4>
                    <span className={styles.bold}>Top Domain Collections</span>
                </h4>
                <Link to='/domains/ai'>
                    <span className={`${styles.text} ${styles.secondItems}`}>
                        .ai Domains
                    </span>
                    <span className={styles.popular}>Popular</span>
                </Link>
                <Link to='/domains/auction'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Domain Auction
                    </span>
                </Link>
                <Link to='/domains/short'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Short Domains
                    </span>
                </Link>
                <Link to='/domains/one-word'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        One Word Domains
                    </span>
                </Link>
                <Link to='/domains/3-letter'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        3 Letter Domains
                    </span>
                </Link>
                <Link to='/domains/4-letter'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        4 Letter Domains
                    </span>
                </Link>
                <Link to='/domains/5-letter'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        5 Letter Domains
                    </span>
                </Link>
                <Link to='/domains/country'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Country-Specific Domains
                    </span>
                </Link>
            </div>

            <div className={styles.rightContainer}>
                <div className={styles.getStartedImgWrapper}>
                    <img
                        src={`${CONSTANTS.STATIC_IMAGES_PATH}get_started.webp`}
                        alt='Get Started'
                        className={styles.getStartedImg}
                    />
                </div>

                <Link to='/get-started' className={styles.getStarted}>
                    <button className={styles.icon}>
                        <FaSearch className={styles.searchIcon} />
                        <span>Get Started</span>
                        <span>
                            <img
                                src={`${CONSTANTS.STATIC_IMAGES_PATH}arrow_forward_ios_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg`}
                                alt='arrow'
                                className={styles.arrowImg}
                            />
                        </span>
                    </button>
                </Link>
                <p className={`${styles.text} ${styles.textRight}`}>
                    Find your perfect domain today and buy instantly in the
                    Atom.com marketplace.
                </p>
            </div>
        </div>
    );
};

export default DomainsDropdown;
