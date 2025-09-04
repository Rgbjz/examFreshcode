import FooterColumn from '../FooterColumn/FooterColumn';
import styles from './AtomFooter.module.sass';
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
    FaXTwitter,
} from 'react-icons/fa6';

const AtomFooter = () => {
    const footerGroups = [
        [
            {
                title: 'Services',
                links: [
                    { label: 'Premium Domains For Sale', href: '#' },
                    { label: 'Ultra Premium Marketplace', href: '#' },
                    { label: 'Naming Contest', href: '#' },
                    { label: 'Brandable Domains', href: '#' },
                    { label: '.ai Domains', href: '#' },
                    { label: 'Short Domains', href: '#' },
                    { label: '3 Letter Domains', href: '#' },
                    { label: '4 Letter Domains', href: '#' },
                    { label: '5 Letter Domains', href: '#' },
                    { label: '6 Letter Domains', href: '#' },
                    { label: '7 Letter Domains', href: '#' },
                    { label: 'One Word Domains', href: '#' },
                    { label: 'Aged Domains', href: '#' },
                    { label: 'Aftermarket Domains', href: '#' },
                    { label: 'Expired Domains', href: '#' },
                    { label: '.in Domains', href: '#' },
                    { label: '.ca Domains', href: '#' },
                    { label: '.co.uk Domains', href: '#' },
                    { label: '.de Domains', href: '#' },
                    { label: 'Domains for Rent', href: '#' },
                    { label: 'Domain Broker', href: '#' },
                    { label: 'Domain Marketplace', href: '#' },
                    { label: 'Brand Identity Design', href: '#' },
                    { label: 'Brand Naming Agency', href: '#' },
                    { label: 'Logo Contests', href: '#' },
                    { label: 'Tagline Contests', href: '#' },
                    { label: 'Audience Research', href: '#' },
                ],
            },
        ],
        [
            {
                title: 'Tools',
                links: [
                    { label: 'Business Name Generator', href: '#' },
                    { label: 'Domain Name Generator', href: '#' },
                    { label: 'Domain Appraisal', href: '#' },
                    { label: 'How to Name Your Business', href: '#' },
                    { label: 'Startup Toolkit', href: '#' },
                    { label: 'Startup Name Generator', href: '#' },
                    { label: 'Band Name Generator', href: '#' },
                    { label: 'Blog Name Generator', href: '#' },
                    { label: 'Product Name Generator', href: '#' },
                    { label: 'YouTube Name Generator', href: '#' },
                    { label: 'Domain Extensions', href: '#' },
                    { label: 'WHOIS Lookup', href: '#' },
                    { label: 'Build a Brand', href: '#' },
                    { label: 'AI Logo Generator', href: '#' },
                ],
            },
            {
                title: 'Trademarks',
                links: [
                    { label: 'Trademark', href: '#' },
                    { label: 'Trademark Filing', href: '#' },
                    { label: 'Premium Trademark Reports', href: '#' },
                    { label: 'Brand Monitoring', href: '#' },
                    { label: 'Free Trademark Checker', href: '#' },
                ],
            },
        ],
        [
            {
                title: 'Sellers',
                links: [
                    { label: 'Become a Seller', href: '#' },
                    { label: 'Domain Selling Info', href: '#' },
                    { label: 'Ultra Premium Seller Info', href: '#' },
                    { label: 'Sapphire Marketplace', href: '#' },
                    { label: 'ccTLD Marketplace', href: '#' },
                    { label: 'Domain Auctions', href: '#' },
                    { label: 'Discussion Forum', href: '#' },
                ],
            },
            {
                title: 'Creatives',
                links: [
                    { label: 'Become a Creative', href: '#' },
                    { label: 'Creative FAQs', href: '#' },
                    { label: 'Active Contests', href: '#' },
                    { label: 'Recent Winners', href: '#' },
                    { label: 'Discussion Forum', href: '#' },
                ],
            },
        ],
        [
            {
                title: 'Atom',
                links: [
                    { label: 'About', href: '#' },
                    { label: 'Contact', href: '#' },
                    { label: 'How It Works', href: '#' },
                    { label: 'Testimonials', href: '#' },
                    { label: 'Our Work', href: '#' },
                    { label: 'Help & FAQs', href: '#' },
                    { label: 'Partner with Us', href: '#' },
                    { label: 'Affiliate Program', href: '#' },
                    { label: 'AtomRadar', href: '#' },
                    { label: 'Blog', href: '#' },
                    { label: 'Careers', href: '#' },
                ],
            },
            {
                title: 'Legal',
                links: [
                    { label: 'Terms of Service', href: '#' },
                    { label: 'Privacy Policy', href: '#' },
                    { label: 'Cookie Policy', href: '#' },
                ],
            },
        ],
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.columns}>
                {footerGroups.map((group, idx) => (
                    <div key={idx} className={styles.mainColumn}>
                        {group.map((col, j) => (
                            <FooterColumn
                                key={j}
                                title={col.title}
                                links={col.links}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className={styles.bottom}>
                <div className={styles.copy}>
                    <p>
                        Copyright © 2025 Atom.com ·{' '}
                        <a href='#'>Consent Preferences</a>
                    </p>
                </div>
                <div className={styles.rating}>
                    <div className={styles.trustBox}>
                        <span className={styles.title}>Excellent</span>
                        <div className={styles.stars}>
                            <div className={styles.star}></div>
                            <div className={styles.star}></div>
                            <div className={styles.star}></div>
                            <div className={styles.star}></div>
                            <div
                                className={`${styles.star} ${styles.half}`}
                            ></div>
                        </div>
                        <span className={styles.trustText}>Trustpilot</span>
                    </div>

                    <div className={styles.scoreBox}>
                        <span className={styles.score}>4.5 / 5</span>
                        <small className={styles.based}>
                            based on 726 ratings
                        </small>
                    </div>
                </div>
                <div className={styles.socials}>
                    <a href='#'>
                        <FaFacebook />
                    </a>
                    <a href='#'>
                        <FaXTwitter />
                    </a>
                    <a href='#'>
                        <FaInstagram />
                    </a>
                    <a href='#'>
                        <FaLinkedin />
                    </a>
                    <a href='#'>
                        <FaYoutube />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default AtomFooter;
