import React, { useState } from 'react';
import styles from './FaqMenu.module.sass';
import classNames from 'classnames';

const FaqMenu = () => {
    const [active, setActive] = useState('launching');

    const scrollToSection = id => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setActive(id);
        }
    };

    return (
        <div className={styles.faqMenu}>
            <button
                className={classNames({
                    [styles.active]: active === 'launching',
                })}
                onClick={() => scrollToSection('launching')}
            >
                Launching A Contest
            </button>

            <button
                className={classNames({
                    [styles.active]: active === 'marketplace',
                })}
                onClick={() => scrollToSection('marketplace')}
            >
                Buying From Marketplace
            </button>

            <button
                className={classNames({
                    [styles.active]: active === 'managed',
                })}
                onClick={() => scrollToSection('managed')}
            >
                Managed Contests
            </button>

            <button
                className={classNames({
                    [styles.active]: active === 'creatives',
                })}
                onClick={() => scrollToSection('creatives')}
            >
                For Creatives
            </button>
        </div>
    );
};

export default FaqMenu;
