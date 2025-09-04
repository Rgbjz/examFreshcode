import React from 'react';
import { Link } from 'react-router-dom';
import DropDownLink from '../../DropDownLink/DropDownLink';
import CONSTANTS from '../../../constants';
import styles from './ResearchDropdown.module.sass';

const ResearchDropdown = () => {
    return (
        <section className={styles.dropdown}>
            <article className={styles.leftContainer}>
                <DropDownLink
                    to='/domains/premium'
                    img={`${CONSTANTS.STATIC_IMAGES_PATH}audience_research.svg`}
                    title='Audience Research'
                    description='Business decisions are easier with data. Run targeted surveys on just about anything, and get real data fast!'
                />
            </article>
            <article className={styles.rightContainer}>
                <ul className={styles.linksList}>
                    <li>
                        <Link>
                            <span>Name Testing</span>
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <span>Logo Testing</span>
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <span>Copy Testing</span>
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <span>Design Testing</span>
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <span>Product Testing</span>
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <span>Customer Development</span>
                        </Link>
                    </li>
                </ul>
            </article>
        </section>
    );
};

export default ResearchDropdown;
