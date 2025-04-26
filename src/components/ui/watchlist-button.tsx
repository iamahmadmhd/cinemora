'use client';

import { Button } from '@heroui/button';
import { addToast } from '@heroui/react';
import { Tooltip } from '@heroui/tooltip';
import axios from 'axios';
import { ListPlus } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/providers/use-auth';

type WatchlistButtonProps = {
    movieId: string;
    title: string;
    description: string;
};

type ToastOptions = {
    variant?: 'flat' | 'solid' | 'bordered';
    color?:
        | 'primary'
        | 'default'
        | 'foreground'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'danger'
        | undefined;
    timeout?: number;
};

const WatchlistButton = ({
    movieId,
    title,
    description,
}: WatchlistButtonProps) => {
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { isLoggedIn } = useAuth();

    const toastOptions: ToastOptions = useMemo(
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
            })
            .then((response) => {
                if (response.status === 200) {
                    setIsAdded(true);
                    addToast({
                        title: 'Added to watchlist',
                        icon: 'check',
                        ...toastOptions,
                    });
                }
            })
            .catch(() => {
                addToast({
                    title: 'Failed to add item to watchlist',
                    icon: 'x',
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
                variant={isAdded ? 'flat' : 'solid'}
                color='primary'
                isLoading={loading}
                onPress={handleClick}
            >
                <ListPlus size={18} />
            </Button>
        </Tooltip>
    );
};

export { WatchlistButton };
export type { WatchlistButtonProps };
