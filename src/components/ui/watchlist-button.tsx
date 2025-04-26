'use client';

import { Button } from '@heroui/button';
import { addToast, type ToastProps } from '@heroui/toast';
import { Tooltip } from '@heroui/tooltip';
import axios from 'axios';
import { Bookmark } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo, use } from 'react';
import { useAuth } from '@/providers/use-auth';

type WatchlistButtonProps = {
    movieId: string;
    title: string;
    description: string;
    posterUrl?: string;
    releaseDate?: string;
    genres?: string[];
    voteAverage?: number;
};

const WatchlistButton = ({
    movieId,
    title,
    description,
    posterUrl,
    releaseDate,
    genres,
    voteAverage,
}: WatchlistButtonProps) => {
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { userPromise } = useAuth();
    const isLoggedIn = !!use(userPromise);

    const toastOptions: Pick<ToastProps, 'variant' | 'classNames' | 'timeout'> =
        useMemo(
            () => ({
                variant: 'flat',
                timeout: 5000,
            }),
            []
        );

    const checkItem = useCallback(async () => {
        await fetch(`/api/watchlist/check?movie_id=${movieId}`)
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
    }, [movieId]);

    const addItemToWatchlist = async () => {
        await axios
            .post('/api/watchlist/add', {
                movieId,
                title,
                description,
                posterUrl,
                releaseDate,
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
            .catch(() => {
                addToast({
                    title: 'Failed to add item to watchlist',
                });
            });
    };

    const removeItemFromWatchlist = async () => {
        await axios
            .post('/api/watchlist/remove', {
                movieId,
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
                variant={'light'}
                color='primary'
                isLoading={loading}
                onPress={handleClick}
            >
                <Bookmark
                    size={20}
                    fill={isAdded ? 'currentColor' : 'none'}
                />
            </Button>
        </Tooltip>
    );
};

export { WatchlistButton };
export type { WatchlistButtonProps };
