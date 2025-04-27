export default function WatchlistPage() {
    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-bold'>Watchlist</h1>
            <p className='text-gray-500'>
                This is your watchlist. You can add or remove items from here.
            </p>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between p-4 bg-white shadow-md rounded-lg'>
                    <div className='flex items-center gap-4'>
                        <img
                            src='/images/stock.png'
                            alt='Stock'
                            className='w-16 h-16 rounded-lg'
                        />
                        <div>
                            <h2 className='text-xl font-semibold'>
                                Stock Name
                            </h2>
                            <p className='text-gray-500'>Stock Symbol</p>
                        </div>
                    </div>
                    <button className='px-4 py-2 text-white bg-blue-500 rounded-lg'>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
