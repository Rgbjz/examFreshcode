import React from 'react';
import HowAtomWorks from '../../components/HowAtomWorks/HowAtomWorks';
import OurServices from '../../components/OurServices/OurServices';
import styles from './HowItWorks.module.sass';
import HowDoNamingContests from '../../components/HowDoNamingContests/HowDoNamingContests';
import FrequentlyQuestions from '../../components/FrequentlyQuestions/FrequentlyQuestions';
import SearchSection from '../../components/SearchSection/SearchSection';

const HowItWorks = () => {
    return (
        <div className={styles.howItWorks}>
            <HowAtomWorks />
            <OurServices />
            <HowDoNamingContests />
            <FrequentlyQuestions />
            <SearchSection />
        </div>
    );
};

export default HowItWorks;
