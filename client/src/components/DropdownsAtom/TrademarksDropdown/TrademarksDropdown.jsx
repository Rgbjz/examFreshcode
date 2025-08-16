import React from 'react';
import { Link } from 'react-router-dom';
import DropDownLink from '../../DropDownLink/DropDownLink';
import styles from './TrademarksDropdown.module.sass';
import tradeMarkImg from '../../../../public/staticImages/trademark_filling.svg';

const TrademarksDropdown = () => {
    return (
        <section className={styles.dropdown}>
            <article className={styles.leftContainer}>
                <DropDownLink
                    to='/domains/premium'
                    img={tradeMarkImg}
                    title='Trademark Filing'
                    description='Protect your brand with trademark services spanning search to filing.'
                />
            </article>
            <article className={styles.rightContainer}>
                <ul className={styles.linksList}>
                    <li>
                        <Link>
                            <span>Trademark Research</span>
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <span>Trademark Consultation</span>
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <span>Free Trademark Checker</span>
                        </Link>
                    </li>
                </ul>
            </article>
        </section>
    );
};

export default TrademarksDropdown;
