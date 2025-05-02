import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/utils/classname';
import { Skeleton } from './skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, ButtonProps } from '@heroui/button';

type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean;
    nextBtnDisabled: boolean;
    onPrevButtonClick: () => void;
    onNextButtonClick: () => void;
};

type UseDotButtonType = {
    selectedIndex: number;
    scrollSnaps: number[];
    onDotButtonClick: (index: number) => void;
};

const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect).on('select', onSelect);
    }, [emblaApi, onSelect]);

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    };
};

const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonType => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onDotButtonClick = useCallback(
        (index: number) => {
            if (!emblaApi) return;
            emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onInit = useCallback((emblaApi: EmblaCarouselType) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick,
    };
};

type ControlButtonProps = ButtonProps & {
    children?: ReactNode;
};

export const PrevButton: React.FC<ControlButtonProps> = (props) => {
    const { children, className, ...restProps } = props;

    return (
        <Button
            className={cn('embla__button embla__button--prev', className)}
            variant='solid'
            radius='full'
            isIconOnly
            {...restProps}
        >
            <ChevronLeft size={24} />
            {children}
        </Button>
    );
};

export const NextButton: React.FC<ControlButtonProps> = (props) => {
    const { children, className, ...restProps } = props;

    return (
        <Button
            className={cn('embla__button embla__button--prev', className)}
            variant='solid'
            radius='full'
            isIconOnly
            {...restProps}
        >
            <ChevronRight size={24} />
            {children}
        </Button>
    );
};

interface CarouselProps {
    options: EmblaOptionsType;
    loading: boolean;
    className?: string;
    children?: ReactNode;
}

const Carousel: React.FC<CarouselProps> = (props) => {
    const { options, loading, className, children } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
        usePrevNextButtons(emblaApi);

    return (
        <div className={cn('relative', className)}>
            <div
                className='overflow-hidden py-5'
                ref={emblaRef}
            >
                <div className='carousel-container flex -ml-4 touch-pan-y touch-pinch-zoom'>
                    {[...(loading ? [1, 2, 3, 4] : React.Children.toArray(children))].map(
                        (item, index) => (
                            <div
                                key={index}
                                className='pl-4 translate-3d flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_25%]'
                            >
                                {loading ? <Skeleton key={index} /> : item}
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className='carousel__controls'>
                <div className='carousel__buttons'>
                    <PrevButton
                        onPress={onPrevButtonClick}
                        className='absolute top-1/2 left-0 -translate-y-1/2 m-4'
                        isDisabled={prevBtnDisabled}
                    />
                    <NextButton
                        onPress={onNextButtonClick}
                        className='absolute top-1/2 right-0 -translate-y-1/2 m-4'
                        isDisabled={nextBtnDisabled}
                    />
                </div>
            </div>
        </div>
    );
};

export { Carousel, usePrevNextButtons, useDotButton };
