import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import styles from './AtomServicesCard.module.sass';

const AtomServicesCard = ({ img, title, text, path, buttonTitle }) => {
    return (
        <article className={styles.cardArticle}>
            <div className={styles.cardUp}>
                <img src={img} alt='card image' className={styles.cardImg} />
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardText}>{text}</p>
            </div>
            <Link to={path} className={styles.cardDown}>
                <span>{buttonTitle}</span>
                <span className={styles.arrowWrapper}>
                    <FaArrowRight className={styles.arrow} />
                </span>
            </Link>
        </article>
    );
};

export default AtomServicesCard;
