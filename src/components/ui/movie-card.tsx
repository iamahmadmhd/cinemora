import { Card, CardBody } from '@heroui/card';
import Image from 'next/image';
import { Chip } from '@heroui/chip';
import NextLink from 'next/link';
import { Star } from 'lucide-react';
import { MediaBaseInterface } from 'src/types';

const MediaCard = ({ content }: { content: MediaBaseInterface }) => {
    const { title, posterUrl, href, voteAverage } = content;

    return (
        <Card className='w-full overflow-hidden shadow-medium group'>
            <CardBody className='relative backdrop-blur-2xl bg-background/80 dark:bg-background/60 z-10'>
                <Chip
                    className='absolute z-20 mt-2 ml-2'
                    startContent={<Star size={18} />}
                    radius='sm'
                    color='warning'
                >
                    {voteAverage?.toFixed(1)}
                </Chip>
                <Image
                    alt={title}
                    className='object-cover w-full aspect-[2/3] rounded-lg'
                    src={posterUrl}
                    loading='lazy'
                    width={300}
                    height={450}
                />
                <div className='pt-3'>
                    <NextLink
                        href={href ?? '#'}
                        className='text-medium'
                    >
                        {title}
                    </NextLink>
                </div>
            </CardBody>
            <Image
                alt={title}
                className='z-0 absolute object-cover rounded-lg h-[calc(100%-(var(--spacing)*3)*2)] w-[calc(100%-(var(--spacing)*3)*2)] inset-[calc(0px+calc(var(--spacing)*3))]'
                src={posterUrl}
                loading='lazy'
                width={300}
                height={450}
            />
        </Card>
    );
};

export { MediaCard };
