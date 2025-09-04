import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import styles from './FooterColumn.module.sass';

const FooterColumn = ({ title, links }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.column}>
            <div className={styles.titleWrapper}>
                <h4>{title}</h4>
                <button
                    type='button'
                    className={styles.header}
                    onClick={() => setOpen(v => !v)}
                    aria-expanded={open}
                >
                    <FaChevronDown
                        className={`${styles.icon} ${
                            open ? styles.rotate : ''
                        }`}
                    />
                </button>
            </div>

            <ul className={`${styles.list} ${open ? styles.open : ''}`}>
                {links.map((link, idx) => (
                    <li key={idx}>
                        <a href={link.href}>{link.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FooterColumn;
