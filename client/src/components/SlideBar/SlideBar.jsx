import React, { useMemo, useState, useEffect } from 'react';
import Flickity from 'react-flickity-component';
import style from './SlideBar.module.sass';
import carouselConstants from '../../carouselConstants';
import './flickity.css';

const SliderBar = ({ images, carouselType }) => {
    const [ready, setReady] = useState(false);

    const options = {
        draggable: true,
        wrapAround: true,
        pageDots: false,
        prevNextButtons: true,
        autoPlay: true,
        groupCells: true,
        lazyLoad: true,
    };

    const styleName = useMemo(() => {
        switch (carouselType) {
            case carouselConstants.MAIN_SLIDER:
                return style.mainCarousel;
            case carouselConstants.EXAMPLE_SLIDER:
                return style.exampleCarousel;
            case carouselConstants.FEEDBACK_SLIDER:
                return style.feedbackCarousel;
            default:
                return '';
        }
    }, [carouselType]);

    const slides = useMemo(() => {
        if (!images || Object.keys(images).length === 0) return null;

        switch (carouselType) {
            case carouselConstants.MAIN_SLIDER:
                return Object.keys(images).map((key, index) => (
                    <img
                        src={images[key]}
                        alt='slide'
                        key={index}
                        className={style['carousel-cell']}
                    />
                ));
            case carouselConstants.EXAMPLE_SLIDER:
                return Object.keys(images).map((key, index) => (
                    <div className={style['example-cell']} key={index}>
                        <img src={images[key]} alt='slide' />
                        <p>{carouselConstants.EXAMPLE_SLIDER_TEXT[index]}</p>
                    </div>
                ));
            case carouselConstants.FEEDBACK_SLIDER:
                return Object.keys(images).map((key, index) => (
                    <div className={style['feedback-cell']} key={index}>
                        <img src={images[key]} alt='slide' />
                        <p>
                            {
                                carouselConstants.FEEDBACK_SLIDER_TEXT[index]
                                    .feedback
                            }
                        </p>
                        <span>
                            {carouselConstants.FEEDBACK_SLIDER_TEXT[index].name}
                        </span>
                    </div>
                ));
            default:
                return null;
        }
    }, [images, carouselType]);

    useEffect(() => {
        if (slides) {
            const timeout = setTimeout(() => setReady(true), 0);
            return () => clearTimeout(timeout);
        } else {
            setReady(false);
        }
    }, [slides]);

    if (!slides) {
        return <div className={style.placeholder}>Loading slides...</div>;
    }

    if (!ready) {
        return <div className={style.placeholder}></div>;
    }

    return (
        <Flickity
            className={styleName}
            elementType='div'
            options={options}
            static
        >
            {slides}
        </Flickity>
    );
};

export default SliderBar;
