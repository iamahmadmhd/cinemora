import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronsLeftRightEllipsis } from 'lucide-react';
import { cn } from '@/utils/classname';
import { Skeleton } from './skeleton';

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

const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
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

const useDotButton = (
    emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
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
        emblaApi
            .on('reInit', onInit)
            .on('reInit', onSelect)
            .on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick,
    };
};

interface CarouselProps {
    options: EmblaOptionsType;
    loading: boolean;
    className?: string;
    children?: ReactNode;
}

const Carousel: React.FC<CarouselProps> = (props) => {
    const { options, loading, className, children } = props;
    const [emblaRef] = useEmblaCarousel(options);

    return (
        <div className={cn(className)}>
            <div
                className='overflow-hidden grid gap-y-8'
                ref={emblaRef}
            >
                <div className='flex -ml-4 touch-pan-y touch-pinch-zoom'>
                    {[
                        ...(loading
                            ? [1, 2, 3, 4, 5]
                            : React.Children.toArray(children)),
                    ].map((item, index) => (
                        <div
                            key={index}
                            className='pl-4 flex-[0_0_25%]'
                        >
                            {loading ? <Skeleton key={index} /> : item}
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex lg:hidden container max-w-xs mx-auto px-4 items-center justify-center mt-6'>
                <ChevronsLeftRightEllipsis size={40} />
            </div>
        </div>
    );
};

export { Carousel, usePrevNextButtons, useDotButton };
