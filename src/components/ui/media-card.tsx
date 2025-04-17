import { Card, CardBody, CardFooter } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Image } from '@heroui/image';
import NextLink from 'next/link';
import { Star } from 'lucide-react';
import { MediaBaseInterface } from 'src/types';
import { Link } from '@heroui/link';

const MediaCard = ({ content }: { content: MediaBaseInterface }) => {
    const { title, posterUrl, href, voteAverage } = content;

    return (
        <Card
            isBlurred
            className='py-4 h-full shadow-sm'
        >
            <CardBody className='overflow-visible relative flex-none py-2'>
                <Chip
                    startContent={<Star size={18} />}
                    className='absolute z-20 m-4'
                    color='warning'
                >
                    {voteAverage.toFixed(1)}
                </Chip>
                <Image
                    alt={`${title} poster`}
                    className='object-cover w-full aspect-[2/3] z-0'
                    src={posterUrl}
                    removeWrapper
                />
            </CardBody>
            <CardFooter className='pb-0 pt-2 px-4 block items-start'>
                <Link
                    as={NextLink}
                    href={href ?? '#'}
                    size='lg'
                    color='foreground'
                    className='h-full'
                >
                    {title}
                </Link>
            </CardFooter>
        </Card>
    );
};

export { MediaCard };
