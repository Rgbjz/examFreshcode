import { Link } from 'react-router-dom';
import DropDownLink from '../../DropDownLink/DropDownLink';
import styles from './TrademarksDropdown.module.sass';
import CONSTANTS from '../../../constants';

const TrademarksDropdown = () => {
    return (
        <section className={styles.dropdown}>
            <article className={styles.leftContainer}>
                <DropDownLink
                    to='/domains/premium'
                    img={`${CONSTANTS.STATIC_IMAGES_PATH}trademark_filling.svg`}
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
