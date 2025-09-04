import { useState } from 'react';
import styles from './FaqSection.module.sass';

const FaqSection = ({ title, items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = index => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.sectionContainer}>
            <h3 className={styles.title}>{title}</h3>
            <ul className={styles.faqList}>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`${styles.faqItem} ${
                            openIndex === index ? styles.active : ''
                        }`}
                    >
                        <button
                            className={`${styles.question} ${
                                openIndex === index ? styles.openQuestion : ''
                            }`}
                            onClick={() => toggle(index)}
                        >
                            {item.question}
                            <span>{openIndex === index ? '✕' : '+'}</span>
                        </button>
                        <div
                            className={`${styles.answer} ${
                                openIndex === index ? styles.open : ''
                            }`}
                        >
                            {item.answer}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default FaqSection;
