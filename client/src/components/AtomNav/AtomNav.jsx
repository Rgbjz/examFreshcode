import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AtomNav.module.sass';
import DomainsDropdown from '../DropdownsAtom/DomainsDropdown/DomainsDropdown';
import NamingDropdown from '../DropdownsAtom/NamingDropdown/NamingDropdown';
import ResearchDropdown from '../DropdownsAtom/ResearchDropdown/ResearchDropdown';
import TrademarksDropdown from '../DropdownsAtom/TrademarksDropdown/TrademarksDropdown';
import ResourcesDropdown from '../DropdownsAtom/ResourcesDropdown/ResourcesDropdown';
import { ChevronDown } from 'lucide-react';

const AtomNav = () => {
    const [openSection, setOpenSection] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1180);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1180);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSection = name => {
        setOpenSection(prev => (prev === name ? null : name));
    };

    const sections = [
        {
            name: 'domains',
            label: 'Domains for Sale',
            dropdown: <DomainsDropdown />,
        },
        {
            name: 'naming',
            label: 'Naming & Branding',
            dropdown: <NamingDropdown />,
        },
        {
            name: 'research',
            label: 'Research & Testing',
            dropdown: <ResearchDropdown />,
        },
        {
            name: 'trademarks',
            label: 'Trademarks',
            dropdown: <TrademarksDropdown />,
        },
        {
            name: 'resources',
            label: 'Resources',
            dropdown: <ResourcesDropdown />,
        },
    ];

    return (
        <div
            className={styles.navWrapper}
            onMouseLeave={() => !isMobile && setOpenSection(null)} // <-- ВАЖНО: вешаем на wrapper
        >
            <nav className={styles.center}>
                {isMobile && (
                    <div className={styles.mobileSearch}>
                        <input type='text' placeholder='Search...' />
                    </div>
                )}

                {sections.map(sec => (
                    <div
                        key={sec.name}
                        className={`${styles.dropdownWrapper} ${
                            openSection === sec.name ? styles.open : ''
                        }`}
                        onMouseEnter={() =>
                            !isMobile && setOpenSection(sec.name)
                        }
                    >
                        <button
                            type='button'
                            className={`${styles.sectionButton} ${
                                openSection === sec.name ? styles.open : ''
                            }`}
                            onClick={() => isMobile && toggleSection(sec.name)}
                        >
                            <Link to={`/${sec.name}`}>{sec.label}</Link>
                            <ChevronDown className={styles.arrow} />
                        </button>

                        {/* Мобильная версия (аккордеон) */}
                        {isMobile && (
                            <div
                                className={`${styles.dropdownContent} ${
                                    openSection === sec.name ? styles.show : ''
                                }`}
                            >
                                {sec.dropdown}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Десктопная версия dropdown */}
            {!isMobile && openSection && (
                <div
                    className={styles.desktopDropdown}
                    onMouseEnter={() => setOpenSection(openSection)} // держим открытым
                >
                    {sections.find(sec => sec.name === openSection)?.dropdown}
                </div>
            )}
        </div>
    );
};

export default AtomNav;
