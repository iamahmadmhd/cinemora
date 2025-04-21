'use client';

import { Button } from '@heroui/button';
import axios from 'axios';
import { ListPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

type WatchlistButtonProps = {
    externalId: string;
    title: string;
    description: string;
};

function WatchlistButton({
    externalId,
    title,
    description,
}: WatchlistButtonProps) {
    const [isAdded, setIsAdded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log({ isAdded });
        const checkItem = async () => {
            const response = await fetch(
                `/api/watchlist/check?external_id=${externalId}`
            );
            const data = await response.json();
            console.log({ data });
            setIsAdded(data.exists);
        };

        checkItem();
    }, [isAdded]);

    const handleAdd = async () => {
        setLoading(true);
        const response = await axios.post('/api/watchlist/add', {
            externalId,
            title,
            description,
        });
        if (response.data.exists) setIsAdded(true);
        setLoading(false);
    };

    return (
        <Button
            isIconOnly
            variant={isAdded ? 'flat' : 'solid'}
            color='primary'
            isLoading={loading}
            onPress={handleAdd}
        >
            <ListPlus size={18} />
        </Button>
    );
}

export { WatchlistButton };
export type { WatchlistButtonProps };
