import React, { useState } from 'react';
import styles from './ButtonGroup.module.sass';
import { Check } from 'lucide-react';

const ButtonGroup = () => {
    const [selected, setSelected] = useState('yes_variations');
    const [selectedSub, setSelectedSub] = useState('no');

    const handleSelect = option => {
        setSelected(option);
    };

    const handleSubSelect = option => {
        setSelectedSub(option);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainWrapper}>
                <button
                    type='button'
                    className={`${styles.option} ${
                        selected === 'yes_variations' ? styles.active : ''
                    }`}
                    onClick={() => handleSelect('yes_variations')}
                >
                    <div className={styles.header}>
                        <span className={styles.headerTitle}>Yes</span>
                        <span className={styles.recommended}>Recommended</span>
                        {selected === 'yes_variations' && (
                            <Check size={18} className={styles.checkIcon} />
                        )}
                    </div>
                    <p>But minor variations are allowed</p>
                </button>

                <button
                    type='button'
                    className={`${styles.option} ${
                        selected === 'yes_exact' ? styles.active : ''
                    }`}
                    onClick={() => handleSelect('yes_exact')}
                >
                    <div className={styles.header}>
                        <span className={styles.headerTitle}>Yes</span>
                        {selected === 'yes_exact' && (
                            <Check size={18} className={styles.checkIcon} />
                        )}
                    </div>
                    <p>The Domain should exactly match the name</p>
                </button>

                <button
                    type='button'
                    className={`${styles.option} ${
                        selected === 'no' ? styles.active : ''
                    }`}
                    onClick={() => handleSelect('no')}
                >
                    <div className={styles.header}>
                        <span className={styles.headerTitle}>No</span>
                        {selected === 'no' && (
                            <Check size={18} className={styles.checkIcon} />
                        )}
                    </div>
                    <p>I am only looking for a name, not a Domain</p>
                </button>
            </div>

            {selected !== 'no' && (
                <div className={styles.subWrapper}>
                    <span className={styles.subHeader}>
                        Are you open to any other URL extensions besides (.com)?
                    </span>
                    <div className={styles.subButtons}>
                        <button
                            type='button'
                            className={`${styles.option} ${
                                selectedSub === 'yes' ? styles.active : ''
                            }`}
                            onClick={() => handleSubSelect('yes')}
                        >
                            <div className={styles.header}>
                                <span className={styles.headerTitle}>Yes</span>
                                {selectedSub === 'yes' && (
                                    <Check
                                        size={18}
                                        className={styles.checkIcon}
                                    />
                                )}
                            </div>
                            <p>I'm open to other URL extensions.</p>
                        </button>

                        <button
                            type='button'
                            className={`${styles.option} ${
                                selectedSub === 'no' ? styles.active : ''
                            }`}
                            onClick={() => handleSubSelect('no')}
                        >
                            <div className={styles.header}>
                                <span className={styles.headerTitle}>No</span>
                                {selectedSub === 'no' && (
                                    <Check
                                        size={18}
                                        className={styles.checkIcon}
                                    />
                                )}
                            </div>
                            <p>I am only looking for a (.com) Domain</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonGroup;
