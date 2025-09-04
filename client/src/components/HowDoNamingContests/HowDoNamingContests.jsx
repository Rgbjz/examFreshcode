import React from 'react';
import NamingContestsStep from '../NamingContestsStep/NamingContestsStep';
import CONSTANTS from '../../constants';
import styles from './HowDoNamingContests.module.sass';

const HowDoNamingContests = () => {
    return (
        <section className={styles.namingSection}>
            <div className={styles.titleContainer}>
                <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}icon-27.svg`}
                    alt='icon'
                    className={styles.trophyImg}
                />
                <h3 className={styles.title}>How Do Naming Contests Work?</h3>
            </div>
            <ul className={styles.stepsList}>
                <NamingContestsStep
                    text='Fill out your Naming Brief and begin receiving name ideas in minutes'
                    numberOfStep='1'
                />
                <NamingContestsStep
                    text='Rate the submissions and provide feedback to creatives. Creatives submit even more names based on your feedback.'
                    numberOfStep='2'
                />
                <NamingContestsStep
                    text='Our team helps you test your favorite names with your target audience. We also assist with Trademark screening.'
                    numberOfStep='3'
                />
                <NamingContestsStep
                    text='Pick a Winner. The winner gets paid for their submission.'
                    numberOfStep='4'
                    last='true'
                />
            </ul>
        </section>
    );
};

export default HowDoNamingContests;
