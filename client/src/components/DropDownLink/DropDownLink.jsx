import { Link } from 'react-router-dom';
import styles from './DropDownLink.module.sass';
import CONSTANTS from '../../constants';

const DropDownLink = ({ to, img, title, description }) => (
    <div className={styles.linkContainer}>
        {img && <img src={img} alt={title} className={styles.laptomImg} />}
        <div>
            <Link to={to}>
                <span className={styles.bold}>{title}</span>
                <span>
                    <img
                        src={`${CONSTANTS.STATIC_IMAGES_PATH}arrow_forward_ios_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg`}
                        alt='arrow'
                        className={styles.arrowImg}
                    />
                </span>
            </Link>
            {description && <p className={styles.text}>{description}</p>}
        </div>
    </div>
);

export default DropDownLink;
