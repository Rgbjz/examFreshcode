import cn from 'classnames';
import styles from './NamingContestsStep.module.sass';

const NamingContestsStep = ({ text, numberOfStep, last }) => {
    return (
        <li
            className={cn(styles.step, {
                [styles.withArrow]: !last,
            })}
        >
            <span className={styles.numberOfSteps}>Step {numberOfStep}</span>
            <p className={styles.text}>{text}</p>
        </li>
    );
};

export default NamingContestsStep;
