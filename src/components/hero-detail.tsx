'use client';

import { Image } from '@heroui/image';
import { Card, CardFooter } from '@heroui/card';
import { cn } from '@/utils/classname';
import { WatchlistButton } from './ui/watchlist-button';
import { WatchlistTableItem } from './watchlist-table';

type HeroDetailProps = Omit<WatchlistTableItem, 'id'> & {
    id: number;
    className?: string;
};

const HeroDetail = (props: HeroDetailProps) => {
    const {
        id,
        title,
        overview,
        posterUrl,
        backdropUrl,
        mediaType,
        releaseDate,
        genres,
        voteAverage,
        className,
    } = props;
    return (
        <Card
            isFooterBlurred
            className={cn('border-none', className)}
            radius='lg'
        >
            <Image
                src={backdropUrl}
                alt={title}
                width={1200}
                height={480}
                className='object-cover'
            />
            <CardFooter className='justify-between flex-wrap gap-y-4 border-white/20 border-1 overflow-hidden py-4 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10'>
                <h1 className='w-full md:w-1/2 font-semibold text-3xl text-center md:text-left text-white'>
                    {title}
                </h1>
                <div className='w-full md:w-1/2 flex gap-4 justify-center md:justify-end items-center'>
                    <WatchlistButton
                        id={id}
                        title={title}
                        overview={overview}
                        mediaType={mediaType}
                        backdropUrl={backdropUrl}
                        posterUrl={posterUrl}
                        releaseDate={releaseDate}
                        genres={genres}
                        voteAverage={voteAverage}
                    />
                </div>
            </CardFooter>
        </Card>
    );
};

export { HeroDetail };
export type { HeroDetailProps };
