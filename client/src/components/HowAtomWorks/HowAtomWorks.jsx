import React from 'react';
import styles from './HowAtomWorks.module.sass';

const HowAtomWorks = () => {
    return (
        <section className={styles.howAtomWorksSection}>
            <article className={styles.infoArticle}>
                <h4 className={styles.worldTitle}>
                    World's #1 Naming Platform
                </h4>
                <h1 className={styles.themeTitle}>How Does Atom Work?</h1>
                <p className={styles.text}>
                    Atom helps you come up with a great name for your business
                    by combining the power of crowdsourcing with sophisticated
                    technology and Agency-level validation services.
                </p>
            </article>
            <div className={styles.videoArticle}>
                <iframe
                    src='https://iframe.mediadelivery.net/embed/239474/327efcdd-b1a2-4891-b274-974787ae8362?autoplay=false&amp;loop=false&amp;muted=false&amp;preload=true&amp;responsive=true'
                    allow='accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;'
                    allowFullScreen
                    className={styles.video}
                ></iframe>
            </div>
        </section>
    );
};

export default HowAtomWorks;
