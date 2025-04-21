'use client';

import { Button } from '@heroui/button';
import { addToast } from '@heroui/react';
import { Tooltip } from '@heroui/tooltip';
import axios from 'axios';
import { ListPlus } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

type WatchlistButtonProps = {
    externalId: string;
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

const toastOptions: ToastOptions = {
    variant: 'flat',
    timeout: 5000,
};

const WatchlistButton = ({
    externalId,
    title,
    description,
}: WatchlistButtonProps) => {
    const [isAdded, setIsAdded] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkItem = useCallback(async () => {
        try {
            const response = await fetch(
                `/api/watchlist/check?external_id=${externalId}`
            );
            const data = await response.json();
            setIsAdded(data.exists);
        } catch (error) {
            console.error('Failed to check item availability:', error);
        }
    }, [isAdded]);

    useEffect(() => {
        checkItem();
    }, [checkItem]);

    const handleAdd = async () => {
        setLoading(true);
        if (!isAdded) {
            try {
                await axios.post('/api/watchlist/add', {
                    externalId,
                    title,
                    description,
                });
                setIsAdded(true);
                addToast({
                    title: 'Added to watchlist',
                    ...toastOptions,
                });
            } catch {
                addToast({
                    title: 'Failed to add item to watchlist',
                });
            }
        } else {
            try {
                await axios.post('/api/watchlist/delete', {
                    externalId,
                });
                setIsAdded(false);
                addToast({
                    title: 'Removed from watchlist',
                    color: 'danger',
                    ...toastOptions,
                });
            } catch {
                addToast({
                    title: 'Failed to remove item from watchlist',
                });
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        console.log('isAdded:', isAdded);
    }, [isAdded]);

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
                onPress={handleAdd}
            >
                <ListPlus size={18} />
            </Button>
        </Tooltip>
    );
};

export { WatchlistButton };
export type { WatchlistButtonProps };
