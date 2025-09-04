import React from 'react';
import FaqMenu from '../FaqMenu/FaqMenu';
import FaqSection from '../FaqSection/FaqSection';
import faqData from './faqData';
import styles from './FrequentlyQuestions.module.sass';

const FrequentlyQuestions = () => {
    return (
        <section className={styles.questionsContainer}>
            <h3 className={styles.sectionTitle}>Frequently Asked Questions</h3>
            <FaqMenu />
            <article id='launching'>
                <FaqSection
                    title='Launching A Contest'
                    items={faqData.launching}
                />
            </article>

            <article id='marketplace'>
                <FaqSection
                    title='Buying From Marketplace'
                    items={faqData.marketplace}
                />
            </article>

            <article id='managed'>
                <FaqSection title='Managed Contests' items={faqData.managed} />
            </article>

            <article id='creatives'>
                <FaqSection title='For Creatives' items={faqData.creatives} />
            </article>
        </section>
    );
};

export default FrequentlyQuestions;
