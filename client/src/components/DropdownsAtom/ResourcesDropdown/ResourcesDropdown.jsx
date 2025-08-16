import { Link } from 'react-router-dom';
import arrowSVG from '../../../../public/staticImages/arrow_forward_ios_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
import bsgImg from '../../../../public/staticImages/bsg.svg';
import aiImg from '../../../../public/staticImages/bsg.svg';
import aligmentImg from '../../../../public/staticImages/alignment_tool.svg';
import radarImg from '../../../../public/staticImages/atom_radar.svg';
import bookImg from '../../../../public/staticImages/brand_book.svg';
import startImg from '../../../../public/staticImages/start_up.svg';
import domainImg from '../../../../public/staticImages/domain_score.svg';
import DropDownLink from '../../DropDownLink/DropDownLink';
import styles from './ResourcesDropdown.module.sass';

const ResourcesDropdown = () => {
    return (
        <section className={styles.dropdown}>
            <article className={styles.firstContainer}>
                <DropDownLink
                    to='/domains/premium'
                    img={bsgImg}
                    title='Business Name Generator'
                    description='Be inspired by our AI-powered generators! Get 1000s of name ideas in seconds.'
                />
                <div className={styles.brandingContests}>
                    <Link to='/domains/country'>
                        <span
                            className={`${styles.secondItems} ${styles.text}`}
                        >
                            Domain Name Generator
                        </span>
                    </Link>

                    <Link to='/domains/country'>
                        <span
                            className={`${styles.secondItems} ${styles.text}`}
                        >
                            Startup Name Generator
                        </span>
                    </Link>

                    <Link to='/domains/country'>
                        <span
                            className={`${styles.secondItems} ${styles.text}`}
                        >
                            Product Name Generator
                        </span>
                    </Link>
                </div>
                <DropDownLink
                    to='/domains/premium'
                    img={aiImg}
                    title='AI Logo Maker'
                    description='Create eye-catching logos in minutes and make your brand memorable.'
                />
            </article>
            <article className={styles.secondContainer}>
                <DropDownLink
                    to='/domains/premium'
                    img={aligmentImg}
                    title='Brand Alignment Tool'
                    description='Make the right naming choice with our AI-powered brand alignment tool.'
                />
                <DropDownLink
                    to='/domains/premium'
                    img={radarImg}
                    title='Atom Radar'
                    description='Exclusive naming and branding research from Atom.com.'
                />
                <DropDownLink
                    to='/domains/premium'
                    img={bookImg}
                    title='Build a Brandbook'
                    description='Create a free brand bible in minutes using our AI-assisted builder.'
                />
                <DropDownLink
                    to='/domains/premium'
                    img={startImg}
                    title='Startup Toolkit'
                    description='Explore apps and services to help your startup thrive.'
                />
            </article>
            <article className={styles.thirdContainer}>
                <h4 className={styles.bold}>Atom.com</h4>
                <Link to='/domains/country'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        About Us
                    </span>
                </Link>

                <Link to='/domains/country'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Atom Blog
                    </span>
                </Link>

                <Link to='/domains/country'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Testimonials
                    </span>
                </Link>
                <Link to='/domains/country'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Partner with us
                    </span>
                    <span className={styles.popular}>AtomConnect</span>
                </Link>

                <Link to='/domains/country'>
                    <span className={`${styles.secondItems} ${styles.text}`}>
                        Affiliate
                    </span>
                </Link>
            </article>
            <article className={styles.fourthContainer}>
                <div className={styles.getStartedImgWrapper}>
                    <img
                        src={domainImg}
                        alt='Get Started'
                        className={styles.getStartedImg}
                    />
                </div>

                <Link to='/get-started' className={styles.getStarted}>
                    <button className={styles.icon}>
                        <span className={styles.agencyStyles}>
                            AI Domain Appraisal Tool
                        </span>
                        <span>
                            <img
                                src={arrowSVG}
                                alt='arrow'
                                className={styles.arrowImg}
                            />
                        </span>
                    </button>
                </Link>
                <p className={`${styles.text} ${styles.textRight}`}>
                    Discover the value of your domains, based on 50+ data points
                    and powered by effective AI.
                </p>
            </article>
        </section>
    );
};

export default ResourcesDropdown;
