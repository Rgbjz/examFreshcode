import { Link } from 'react-router-dom';
import CONSTANTS from '../../../constants';
import DropDownLink from '../../DropDownLink/DropDownLink';
import styles from './NamingDropdown.module.sass';

const NamingDropdown = () => {
    return (
        <section className={styles.dropdown}>
            <article className={styles.leftContainer}>
                <DropDownLink
                    to='/domains/premium'
                    title=' Start a Naming Contest'
                    description='Launch a name and domain contest today for 1000s of unique name ideas!'
                />
                <div className={styles.brandingContests}>
                    <h2 className={styles.bold}>Branding Contests</h2>
                    <Link to='/domains/country'>
                        <span
                            className={`${styles.secondItems} ${styles.text}`}
                        >
                            Logo Contests
                        </span>
                    </Link>

                    <Link to='/domains/country'>
                        <span
                            className={`${styles.secondItems} ${styles.text}`}
                        >
                            Tagline Contests
                        </span>
                    </Link>

                    <Link to='/domains/country'>
                        <span
                            className={`${styles.secondItems} ${styles.text}`}
                        >
                            Brand Identity Contests
                        </span>
                    </Link>

                    <Link to='/domains/country'>
                        <span
                            className={`${styles.secondItems} ${styles.text}`}
                        >
                            Brand Naming Agency
                        </span>
                    </Link>
                </div>
            </article>
            <article className={styles.centerContainer}>
                <h4>
                    <span className={styles.bold}>Contest Details</span>
                </h4>
                <Link to='/domains/auction'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        How It Works
                    </span>
                </Link>
                <Link to='/domains/short'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Contest Pricing
                    </span>
                </Link>
                <Link to='/domains/one-word'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Our Work
                    </span>
                </Link>
                <Link to='/domains/3-letter'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Recent Winners
                    </span>
                </Link>
                <Link to='/domains/4-letter'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Active Contests
                    </span>
                </Link>
                <Link to='/domains/5-letter'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Become a Creative
                    </span>
                </Link>
            </article>
            <article className={styles.rightContainer}>
                <div className={styles.getStartedImgWrapper}>
                    <img
                        src={`${CONSTANTS.STATIC_IMAGES_PATH}agency_style.webp`}
                        alt='Get Started'
                        className={styles.getStartedImg}
                    />
                </div>

                <Link to='/get-started' className={styles.getStarted}>
                    <button className={styles.icon}>
                        <span className={styles.agencyStyles}>
                            Agency Style Experience
                        </span>
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
                    Agency Style Experiencearrow Work with a naming and branding
                    expert in our better-than-an-agency managed contests.
                </p>
            </article>
        </section>
    );
};

export default NamingDropdown;
