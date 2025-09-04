import AtomServicesCard from '../AtomServicesCard/AtomServicesCard';
import CONSTANTS from '../../constants';
import styles from './OurServices.module.sass';

const OurServices = () => {
    return (
        <section className={styles.ourServicesSection}>
            <article className={styles.ourServicesArticle}>
                <span className={styles.ourServices}>Our Services</span>
                <h2 className={styles.threeWays}>3 Ways To Use Atom</h2>
                <p className={styles.atomOffer}>
                    Atom offers 3 ways to get you a perfect name for your
                    business.
                </p>
            </article>
            <div className={styles.cardWrapper}>
                <AtomServicesCard
                    img={`${CONSTANTS.STATIC_IMAGES_PATH}g1.svg`}
                    title='Launch a Contest'
                    text='Work with hundreds of creative experts to get custom name suggestions for your business or brand. All names are auto-checked for URL availability.'
                    path='*'
                    buttonTitle='Launch a Contest'
                />
                <AtomServicesCard
                    img={`${CONSTANTS.STATIC_IMAGES_PATH}g2.svg`}
                    title='Explore Names For Sale'
                    text='Our branding team has curated thousands of pre-made names that you can purchase instantly. All names include a matching URL and a complimentary Logo Design'
                    path='*'
                    buttonTitle='Explore Names For Sale'
                />
                <AtomServicesCard
                    img={`${CONSTANTS.STATIC_IMAGES_PATH}g3.svg`}
                    title='Agency-level Managed Contests'
                    text='Our Managed contests combine the power of crowdsourcing with the rich experience of our branding consultants. Get a complete agency-level experience at a fraction of Agency costs'
                    path='*'
                    buttonTitle='Learn More'
                />
            </div>
        </section>
    );
};

export default OurServices;
