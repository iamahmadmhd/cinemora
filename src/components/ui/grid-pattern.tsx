import { useId } from 'react';

import { cn } from '@/utils/classname';

type Mask = {
    radius: string;
    positionX: string;
    positionY: string;
    background: string;
};
interface GridPatternProps extends Omit<React.SVGProps<SVGSVGElement>, 'mask'> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    squares?: Array<[x: number, y: number]>;
    mask?: Mask;
    strokeDasharray?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
}

export function GridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = '0',
    squares,
    mask,
    style,
    className,
    ...props
}: GridPatternProps) {
    const id = useId();

    return (
        <svg
            aria-hidden='true'
            className={cn(
                'pointer-events-none absolute inset-0 -z-1 h-full w-full fill-gray-400/30 stroke-gray-400/30',
                mask && 'mask-background',
                className
            )}
            style={
                {
                    '--mask-radius': mask?.radius,
                    '--mask-position-x': mask?.positionX,
                    '--mask-position-y': mask?.positionY,
                    '--mask-background': mask?.background,
                    ...style,
                } as React.CSSProperties
            }
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits='userSpaceOnUse'
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill='none'
                        strokeDasharray={strokeDasharray}
                    />
                </pattern>
            </defs>
            <rect
                width='100%'
                height='100%'
                strokeWidth={0}
                fill={`url(#${id})`}
            />
            {squares && (
                <svg
                    x={x}
                    y={y}
                    className='overflow-visible'
                >
                    {squares.map(([x, y]) => (
                        <rect
                            strokeWidth='0'
                            key={`${x}-${y}`}
                            width={width - 1}
                            height={height - 1}
                            x={x * width + 1}
                            y={y * height + 1}
                        />
                    ))}
                </svg>
            )}
        </svg>
    );
}
