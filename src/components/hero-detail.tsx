import { Image } from '@heroui/image';
import { Card, CardFooter, CardProps } from '@heroui/card';
import NextImage from 'next/image';
import { cn } from '@/utils/classname';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { Heart, ListPlus } from 'lucide-react';

interface HeroDetailProps extends CardProps {
    title: string;
    backdropUrl: string;
}
const HeroDetail = (props: HeroDetailProps) => {
    const { title, backdropUrl, className, ...restProps } = props;
    return (
        <Card
            isFooterBlurred
            className={cn('border-none', className)}
            radius='lg'
            {...restProps}
        >
            <Image
                as={NextImage}
                src={backdropUrl}
                alt={title}
                width={1200}
                height={480}
                className='object-cover'
            />
            <CardFooter className='justify-between flex-wrap gap-y-4 border-white/20 border-1 overflow-hidden py-4 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10'>
                <h1 className='w-full md:w-1/2 font-semibold text-3xl text-center md:text-left'>{title}</h1>
                <div className="w-full md:w-1/2 flex gap-4 justify-center md:justify-end items-center">
                    <Tooltip
                        content='Like'
                        placement='bottom'
                    >
                        <Button
                            isIconOnly
                            variant='flat'
                            color='danger'
                        >
                            <Heart size={18} />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content='Add to watchlist'
                        placement='bottom'
                    >
                        <Button
                            isIconOnly
                            variant='flat'
                            color='primary'
                        >
                            <ListPlus size={18} />
                        </Button>
                    </Tooltip>
                </div>
            </CardFooter>
        </Card>
    );
};

export { HeroDetail };
