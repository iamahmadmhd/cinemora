import { Image } from '@heroui/image';
import { Card, CardFooter, CardProps } from '@heroui/card';
import NextImage from 'next/image';
import { cn } from '@/utils/classname';

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
            <CardFooter className='justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-4 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10'>
                <h1 className='font-semibold text-3xl'>{title}</h1>
            </CardFooter>
        </Card>
    );
};

export { HeroDetail };
