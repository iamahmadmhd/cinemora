import { Image } from '@heroui/image';
import NextImage from 'next/image';

interface HeroDetailProps {
    title: string;
    backdropUrl: string;
}
const HeroDetail = (props: HeroDetailProps) => {
    const { title, backdropUrl } = props;
    return (
        <div className='hero relative flex flex-col'>
            <div className='relative w-full rounded-large overflow-hidden'>
                <Image
                    as={NextImage}
                    src={backdropUrl}
                    alt={title}
                    width={1200}
                    height={480}
                    className='object-cover rounded-5xl'
                />
            </div>
            <div className='-translate-y-14 gap-8 grid grid-cols-1 md:grid-cols-2 md:px-10 px-3 w-full z-30'>
                <div className='p-6 md:p-10 rounded-3xl backdrop-blur-lg bg-primary-50/40'>
                    <h1 className='text-4xl font-medium text-white'>{title}</h1>
                </div>
            </div>
        </div>
    );
};

export { HeroDetail };
