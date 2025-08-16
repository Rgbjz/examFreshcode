import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AtomNav.module.sass';
import DomainsDropdown from '../DropdownsAtom/DomainsDropdown/DomainsDropdown';
import NamingDropdown from '../DropdownsAtom/NamingDropdown/NamingDropdown';
import ResearchDropdown from '../DropdownsAtom/ResearchDropdown/ResearchDropdown';
import TrademarksDropdown from '../DropdownsAtom/TrademarksDropdown/TrademarksDropdown';
import ResourcesDropdown from '../DropdownsAtom/ResourcesDropdown/ResourcesDropdown';

const AtomNav = () => {
    const [dropdownVisibleDomainsForSale, setDropdownVisibleDomainsForSale] =
        useState(false);
    const [
        dropdownVisibleNamingAndBranding,
        setDropdownVisibleNamingAndBranding,
    ] = useState(false);
    const [dropdownVisibleResearch, setDropdownVisibleResearch] =
        useState(false);
    const [dropdownVisibleTrademarks, setDropdownVisibleTrademarks] =
        useState(false);
    const [dropdownVisibleResources, setDropdownVisibleResources] =
        useState(false);

    return (
        <nav className={styles.center}>
            <div
                className={styles.dropdownWrapper}
                onMouseEnter={() => setDropdownVisibleDomainsForSale(true)}
                onMouseLeave={() => setDropdownVisibleDomainsForSale(false)}
            >
                <Link to='/domains'>Domains for Sale</Link>
                {dropdownVisibleDomainsForSale && <DomainsDropdown />}
            </div>
            <div
                className={styles.dropdownWrapper}
                onMouseEnter={() => setDropdownVisibleNamingAndBranding(true)}
                onMouseLeave={() => setDropdownVisibleNamingAndBranding(false)}
            >
                <Link to='/naming'>Naming & Branding</Link>
                {dropdownVisibleNamingAndBranding && <NamingDropdown />}
            </div>
            <div
                className={styles.dropdownWrapper}
                onMouseEnter={() => setDropdownVisibleResearch(true)}
                onMouseLeave={() => setDropdownVisibleResearch(false)}
            >
                <Link to='/research'>Research & Testing</Link>
                {dropdownVisibleResearch && <ResearchDropdown />}
            </div>
            <div
                className={styles.dropdownWrapper}
                onMouseEnter={() => setDropdownVisibleTrademarks(true)}
                onMouseLeave={() => setDropdownVisibleTrademarks(false)}
            >
                <Link to='/trademarks'>Trademarks</Link>
                {dropdownVisibleTrademarks && <TrademarksDropdown />}
            </div>
            <div
                className={styles.dropdownWrapper}
                onMouseEnter={() => setDropdownVisibleResources(true)}
                onMouseLeave={() => setDropdownVisibleResources(false)}
            >
                <Link to='/resources'>Resources</Link>
                {dropdownVisibleResources && <ResourcesDropdown />}
            </div>
        </nav>
    );
};

export default AtomNav;
