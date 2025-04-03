'use client';

import { Card, CardBody } from '@heroui/card';
import Image from 'next/image';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import NextLink from 'next/link';
import { EmblaOptionsType } from 'embla-carousel';
import { Carousel } from '@/ui/carousel';
import { IMedia } from '@/app/actions';
import useSWR from 'swr';
import { cn } from '@/utils/classname';

enum MediaType {
    movie = 'Movie',
    tv = 'TV',
}

interface MediaSliderProps {
    headline?: string;
    link?: string;
    sliderOptions: EmblaOptionsType;
    fetchKey: string; // fetchKey for reusability
    fetchFunction: () => Promise<IMedia[]>; // fetchFunction for reusability
    className?: string;
}

const MediaSlider: React.FC<MediaSliderProps> = ({
    headline,
    link = '/',
    sliderOptions,
    fetchKey,
    fetchFunction,
    className,
}) => {
    const { data, error, isLoading } = useSWR(fetchKey, fetchFunction);

    if (error) {
        return <p className='text-red-500'>Error: {error.message}</p>;
    }

    if (!isLoading && !data) {
        return <p className='text-red-500'>No data found</p>;
    }

    return (
        <div className={cn('flex flex-col gap-8', className)}>
            {headline && (
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl font-bold'>{headline}</h2>
                    <Button
                        as={NextLink}
                        href={link}
                        variant='flat'
                        color='primary'
                    >
                        Show All
                    </Button>
                </div>
            )}
            <Carousel
                loading={isLoading}
                options={sliderOptions}
            >
                {data?.map((media) => (
                    <MediaCard
                        key={media.id}
                        content={media}
                    />
                ))}
            </Carousel>
        </div>
    );
};

const MediaCard = ({ content }: { content: IMedia }) => {
    const { title, imageUrl, genres, overview, href } = content;
    const joinedGenres = genres?.join(', ');

    return (
        <Card className='w-full overflow-hidden aspect-[2/3] group'>
            <Image
                fill
                alt={title}
                className='z-0 object-cover'
                src={imageUrl}
                loading='lazy'
            />
            <CardBody className='absolute flex-col items-start gap-3 backdrop-blur-2xl bg-black/80 supports-backdrop-filter:bg-black/40 transition-normal duration-400 ease-in top-0 bottom-0 z-10 p-6 opacity-0 group-hover:opacity-100'>
                <div className='flex flex-wrap items-start gap-1'>
                    <Chip
                        size='sm'
                        color='primary'
                    >
                        {MediaType[content.mediaType]}
                    </Chip>
                </div>
                <div className='flex flex-col gap-1'>
                    <NextLink
                        href={href}
                        className='text-lg font-medium text-white'
                    >
                        <span className='absolute inset-0' />
                        {title}
                    </NextLink>
                    <p className='text-tiny text-white/60'>{joinedGenres}</p>
                    <p className='text-tiny text-white'>{overview}</p>
                </div>
                <div className='mt-auto inline-flex items-center justify-center box-border select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden outline-none text-tiny px-2 min-w-20 h-8 gap-2 rounded-medium transition-transform-colors-opacity motion-reduce:transition-none shadow-lg shadow-primary/40 bg-primary text-primary-foreground hover:opacity-hover'>
                    View details
                </div>
            </CardBody>
        </Card>
    );
};

export { MediaSlider };
