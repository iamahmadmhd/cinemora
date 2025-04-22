type GenreType = {
    id: number;
    name: string;
};

type MediaBase = {
    backdrop_path: string;
    id: number;
    overview: string;
    poster_path: string;
    is_adult: boolean;
    original_language: string;
    origin_country: string[];
    genre_ids?: number[];
    genres?: GenreType[];
    popularity: number;
    vote_average: number;
    vote_count: number;
    tagline?: string;
    status: string;
};

type MovieMedia = {
    title: string;
    original_title: string;
    release_date: string;
    has_video: boolean;
    media_type: 'movie';
} & MediaBase;

type TVShowMedia = {
    name: string;
    original_name: string;
    first_air_date: string;
    media_type: 'tv';
    number_of_seasons: number;
    number_of_episodes: number;
} & MediaBase;

type MediaType = MovieMedia | TVShowMedia;

interface MediaBaseInterface {
    id: number;
    title: string;
    overview: string;
    mediaType: 'movie' | 'tv';
    genres: string[];
    posterUrl: string;
    backdropUrl?: string;
    href?: string;
    releaseDate: string;
    voteAverage: number;
    voteCount: number;
    popularity: number;
    tagline: string;
    status: string;
    originCountry: string[];
}

interface TVShowInterface extends MediaBaseInterface {
    numberOfSeasons: number;
    numberOfEpisodes: number;
}

export type {
    MediaBase,
    MediaBaseInterface,
    MovieMedia,
    TVShowMedia,
    TVShowInterface,
    MediaType,
    GenreType,
};
