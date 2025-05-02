'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import { Chip } from '@heroui/chip';
import { Tooltip } from '@heroui/tooltip';
import { MediaBaseInterface } from '@/types/types';
import { Button } from '@heroui/button';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { Database } from '@/types/supabase';

export const columns = [
    {
        name: 'Title',
        uid: 'title',
    },
    {
        name: 'Genres',
        uid: 'genres',
    },
    {
        name: 'Type',
        uid: 'mediaType',
    },
    {
        name: 'Rating',
        uid: 'rating',
    },
    {
        name: 'Actions',
        uid: 'actions',
    },
];

export type WatchlistTableItem = Pick<
    MediaBaseInterface,
    | 'id'
    | 'title'
    | 'overview'
    | 'genres'
    | 'mediaType'
    | 'releaseDate'
    | 'voteAverage'
    | 'posterUrl'
    | 'backdropUrl'
    | 'href'
> & {
    status?: Database['public']['Enums']['status'];
};

type WatchlistTableProps = {
    items: WatchlistTableItem[];
};

enum MediaType {
    MOVIE = 'Movie',
    TV = 'TV Show',
    UNKNOWN = 'Unknown',
}
const getMediaType = (type: string): MediaType => {
    switch (type) {
        case 'movie':
            return MediaType.MOVIE;
        case 'tv':
            return MediaType.TV;
        default:
            return MediaType.UNKNOWN;
    }
};

const WatchlistTable = ({ items }: WatchlistTableProps) => {
    const handleRemoveFromWatchlist = async (id: number) => {
        try {
            const response = await axios.post('/api/watchlist/remove', {
                id,
            });
            if (response.status === 200) {
                window.location.reload();
            }
        } catch {
            console.error('Failed to remove item from watchlist');
        }
    };

    return (
        <Table
            aria-label='Watchlist Table'
            classNames={{
                wrapper: 'p-0',
                table: 'p-4',
            }}
        >
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
            </TableHeader>
            <TableBody
                emptyContent='You have no items in your watchlist.'
                items={items}
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>
                                {columnKey === 'title' && <span>{item.title}</span>}
                                {columnKey === 'genres' && (
                                    <div className='flex gap-2'>
                                        {item.genres.map((genre) => (
                                            <Chip
                                                key={genre}
                                                color='primary'
                                                variant='flat'
                                                size='sm'
                                            >
                                                {genre}
                                            </Chip>
                                        ))}
                                    </div>
                                )}
                                {columnKey === 'mediaType' && (
                                    <span>{getMediaType(item.mediaType)}</span>
                                )}
                                {columnKey === 'rating' && (
                                    <span>{item.voteAverage.toFixed(1)}</span>
                                )}
                                {columnKey === 'actions' && (
                                    <Tooltip
                                        content='Remove from watchlist'
                                        placement='top'
                                    >
                                        <Button
                                            isIconOnly
                                            variant='light'
                                            size='sm'
                                            color='danger'
                                            onPress={() => handleRemoveFromWatchlist(item.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </Tooltip>
                                )}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export { WatchlistTable };
