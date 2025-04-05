const Skeleton = () => {
    return (
        <div className='flex flex-col gap-3'>
            <div className='animate-pulse bg-gray-200 rounded-lg aspect-[2/3]' />
            <div className='animate-pulse bg-gray-200 h-3 rounded-md' />
        </div>
    );
};
export { Skeleton };
