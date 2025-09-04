import { useState } from 'react';
import styles from './SearchSection.module.sass';
import { FaSearch } from 'react-icons/fa';

const SearchSection = () => {
    const [query, setQuery] = useState('');

    const categories = [
        'Tech',
        'Clothing',
        'Finance',
        'Real Estate',
        'Crypto',
        'Short',
        'One Word',
    ];

    const handleSubmit = e => {
        e.preventDefault();
        console.log('Searching for:', query);
    };

    return (
        <section className={styles.searchSection}>
            <form className={styles.searchBox} onSubmit={handleSubmit}>
                <FaSearch className={styles.icon} />
                <input
                    type='text'
                    placeholder='Search Over 300,000+ Premium Names'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <button type='submit' className={styles.searchButton}>
                    <FaSearch />
                </button>
            </form>

            <div className={styles.categories}>
                {categories.map((cat, idx) => (
                    <span key={idx} className={styles.category}>
                        {cat}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default SearchSection;
