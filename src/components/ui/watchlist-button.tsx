'use client';

import { Button } from '@heroui/button';
import { addToast, type ToastProps } from '@heroui/toast';
import { Tooltip } from '@heroui/tooltip';
import axios from 'axios';
import { ListPlus } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo, use } from 'react';
import { useAuth } from '@/providers/use-auth';
import { WatchlistTableItem } from '../watchlist-table';

const WatchlistButton = ({
    id,
    title,
    overview,
    posterUrl,
    backdropUrl,
    href,
    mediaType,
    releaseDate,
    genres,
    voteAverage,
}: WatchlistTableItem) => {
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { userPromise } = useAuth();
    const isLoggedIn = !!use(userPromise);

    const toastOptions: Pick<ToastProps, 'variant' | 'classNames' | 'timeout'> = useMemo(
        () => ({
            variant: 'flat',
            timeout: 5000,
        }),
        []
    );

    const checkItem = useCallback(async () => {
        await fetch(`/api/watchlist/check?media_id=${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setIsAdded(true);
                } else if (response.status === 404) {
                    setIsAdded(false);
                }
            })
            .catch((error) => {
                console.error('Failed to check item availability:', error);
            });
    }, [id]);

    const addItemToWatchlist = async () => {
        await axios
            .post('/api/watchlist/add', {
                id,
                title,
                overview,
                posterUrl,
                backdropUrl,
                href,
                releaseDate,
                mediaType,
                genres,
                voteAverage,
            })
            .then((response) => {
                if (response.status === 200) {
                    setIsAdded(true);
                    addToast({
                        title: 'Added to watchlist',
                        ...toastOptions,
                    });
                }
            })
            .catch((error) => {
                console.error('Failed to add item to watchlist:', error);
                addToast({
                    title: 'Failed to add item to watchlist',
                });
            });
    };

    const removeItemFromWatchlist = async () => {
        await axios
            .post('/api/watchlist/remove', {
                id,
            })
            .then((response) => {
                if (response.status === 200) {
                    setIsAdded(false);
                    addToast({
                        title: 'Removed from watchlist',
                        ...toastOptions,
                    });
                }
            })
            .catch(() => {
                addToast({
                    title: 'Failed to remove item from watchlist',
                });
            });
    };

    const handleClick = async () => {
        if (!isLoggedIn) {
            addToast({
                title: 'Please log in to add items to your watchlist',
                color: 'warning',
                ...toastOptions,
            });
            return;
        }
        setLoading(true);
        if (isAdded) {
            await removeItemFromWatchlist();
        } else {
            await addItemToWatchlist();
        }
        setLoading(false);
    };

    useEffect(() => {
        checkItem();
    }, [checkItem]);

    return (
        <Tooltip
            content={isAdded ? 'Remove from Watchlist' : 'Add to Watchlist'}
            placement='bottom'
        >
            <Button
                isIconOnly
                variant={isAdded ? 'shadow' : 'faded'}
                color='primary'
                size='lg'
                isLoading={loading}
                onPress={handleClick}
            >
                <ListPlus className={isAdded ? 'stroke-current' : 'stroke-foreground'} />
            </Button>
        </Tooltip>
    );
};

export { WatchlistButton };
