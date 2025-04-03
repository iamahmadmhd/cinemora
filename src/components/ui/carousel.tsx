import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';
import { ChevronsLeftRightEllipsis } from 'lucide-react';
import { cn } from '@/utils/classname';

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
                className='overflow-hidden mr-break-out section-mask-x md:section-mask-r grid gap-y-8'
                ref={emblaRef}
            >
                <div className='flex -ml-4 touch-pan-y touch-pinch-zoom snap-x'>
                    {[
                        ...(loading
                            ? [1, 2, 3, 4, 5]
                            : React.Children.toArray(children)),
                    ].map((item, index) => (
                        <div
                            key={index}
                            className='flex-[0_0_50%] md:flex-[0_0_33.3333%] lg:flex-[0_0_20%] pl-4 snap-start'
                        >
                            <Card
                                className='w-full aspect-[2/3]'
                                radius='lg'
                            >
                                {loading ? (
                                    <Skeleton className='rounded-lg h-full bg-default-300' />
                                ) : (
                                    item
                                )}
                            </Card>
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
