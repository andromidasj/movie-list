import { z } from "zod";

export const MediaItemSchema = z.object({
  art: z.string().url().optional(),
  banner: z.string().url(),
  guid: z.string(),
  key: z.string(),
  primaryExtraKey: z.string(),
  rating: z.number(),
  ratingKey: z.string(),
  studio: z.string(),
  type: z.enum(["movie", "show"]), // 'movie' or 'show'
  thumb: z.string().url(),
  addedAt: z.number(),
  duration: z.number(),
  publicPagesURL: z.string().url(),
  slug: z.string(),
  watchlistedAt: z.number(),
  viewCount: z.number(),
  viewOffset: z.number(),
  title: z.string(),
  contentRating: z.string(),
  originallyAvailableAt: z.string(), // date
  year: z.number(),
  audienceRating: z.number(),
  audienceRatingImage: z.string(),
  ratingImage: z.string(),
  imdbRatingCount: z.number(),
  source: z.string(),
  Image: z.object({
    alt: z.string(),
    type: z.string(),
    url: z.string().url(),
  }),
});

export type MediaItem = z.infer<typeof MediaItemSchema>;

export const PlexWatchlistResponseSchema = z.object({
  MediaContainer: z.object({
    librarySectionID: z.string(),
    librarySectionTitle: z.string(),
    offset: z.number(),
    totalSize: z.number(),
    identifier: z.string(),
    size: z.number(),
    Metadata: MediaItemSchema.array(),
  }),
});

export type PlexWatchlistResponse = z.infer<typeof PlexWatchlistResponseSchema>;

export const PlexMovieSchema = MediaItemSchema.extend({
  summary: z.string(),
  tagline: z.string(),
  contentRating: z.string(),
  Collection: z.array(
    z.object({
      guid: z.string(),
      key: z.string(),
      summary: z.string(),
      tag: z.string(),
    })
  ),
  Director: z.array(
    z.object({
      directory: z.boolean(),
      id: z.string(),
      role: z.string(),
      slug: z.string(),
      tag: z.string(),
      thumb: z.string().url(),
    })
  ),
  Genre: z.array(
    z.object({
      context: z.string(),
      directory: z.boolean(),
      filter: z.string(),
      id: z.string(),
      ratingKey: z.string(),
      slug: z.string(),
      tag: z.string(),
    })
  ),
  Guid: z.array(
    z.object({
      id: z.string(),
    })
  ),
  Producer: z.array(
    z.object({
      directory: z.boolean(),
      id: z.string(),
      role: z.string(),
      slug: z.string(),
      tag: z.string(),
      thumb: z.string().url(),
    })
  ),
  Rating: z.array(
    z.object({
      image: z.string(),
      type: z.enum(["critic", "audience"]),
      value: z.number(),
    })
  ),
  Role: z.array(
    z.object({
      key: z.string(),
      thumb: z.string().url(),
      id: z.string(),
      role: z.string(),
      slug: z.string(),
      tag: z.string(),
      type: z.string(),
    })
  ),
  Studio: z.array(z.object({ tag: z.string() })),
  Writer: z.array(
    z.object({
      thumb: z.string().url(),
      directory: z.boolean(),
      id: z.string(),
      role: z.string(),
      slug: z.string(),
      tag: z.string(),
    })
  ),
});

export type PlexMovie = z.infer<typeof PlexMovieSchema>;

export const PlexMovieUserStateSchema = z.object({
  MediaContainer: z.object({
    UserState: z.object({
      ratingKey: z.string(),
      type: z.enum(["movie", "show"]),
      viewCount: z.number(),
      viewOffset: z.number(),
      watchlistedAt: z.number().optional(),
      lastViewedAt: z.number().optional(),
    }),
  }),
});

export type PlexMovieUserStateResponse = z.infer<
  typeof PlexMovieUserStateSchema
>;

// Custom types

export const plexListSchema = z.object({
  movieId: z.string(),
  title: z.string(),
  year: z.number(),
  poster: z.string().url(),
});

export type PlexList = z.infer<typeof plexListSchema>;

export const listMovieSchema = z.object({
  inList: z.boolean(),
  movieId: z.string(),
  poster: z.string().url(),
  title: z.string(),
  watched: z.boolean(),
  year: z.number(),
});

export type ListMovieEntry = z.infer<typeof listMovieSchema>;

export const listSchema = z.object({
  id: z.number(),
  movies: z.array(listMovieSchema),
  name: z.string(),
});

export type ListSummary = z.infer<typeof listSchema>;

export const MovieInsertSchema = z.object({
  movieId: z.string(),
  title: z.string(),
  year: z.number(),
  inList: z.boolean(),
  listedDate: z.number().nullable(),
  watched: z.boolean(),
  watchedDate: z.number().nullable(),
  poster: z.string().url(),
  listId: z.string().cuid(),
  runtime: z.number(),
});

export type MovieInsert = z.infer<typeof MovieInsertSchema>;

// Search types
export const SearchResultSchema = z.object({
  MediaContainer: z.object({
    suggestedTerms: z.array(z.string()),
    identifier: z.string(),
    size: z.number(),
    SearchResults: z.array(
      z.union([
        z.object({
          id: z.string(),
          title: z.string(),
          size: z.number(),
          SearchResult: z.array(
            z.union([
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  art: z.string(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  art: z.string(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  subtype: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                score: z.number(),
              }),
            ])
          ),
        }),
        z.object({
          id: z.string(),
          title: z.string(),
          size: z.number(),
          SearchResult: z.array(
            z.union([
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  art: z.string(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                availabilityPlatforms: z.array(z.string()),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  playableKey: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                availabilityPlatforms: z.array(z.string()),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  art: z.string(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  art: z.string(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  playableKey: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                availabilityPlatforms: z.array(z.string()),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  subtype: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  art: z.string(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  subtype: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                availabilityPlatforms: z.array(z.string()),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  art: z.string(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  subtype: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  art: z.string(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  playableKey: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                availabilityPlatforms: z.array(z.string()),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  duration: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                score: z.number(),
              }),
              z.object({
                Metadata: z.object({
                  addedAt: z.number(),
                  guid: z.string(),
                  key: z.string(),
                  originallyAvailableAt: z.string(),
                  ratingKey: z.string(),
                  slug: z.string(),
                  source: z.string(),
                  thumb: z.string(),
                  title: z.string(),
                  type: z.string(),
                  year: z.number(),
                }),
                availabilityPlatforms: z.array(z.string()),
                score: z.number(),
              }),
            ])
          ),
        }),
      ])
    ),
  }),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

// export type SearchResult = {
//   MediaContainer: MediaContainer;
// };

// export type MediaContainer = {
//   suggestedTerms: string[];
//   identifier: string;
//   size: number;
//   SearchResults: MediaContainerSearchResult[];
// };

// export type MediaContainerSearchResult = {
//   id: string;
//   title: string;
//   size: number;
//   SearchResult: SearchResultSearchResult[];
// };

// export type SearchResultSearchResult = {
//   Metadata: Metadata;
//   score: number;
//   availabilityPlatforms?: string[];
// };

// export type Metadata = {
//   addedAt: number;
//   art?: string;
//   duration?: number;
//   guid: string;
//   key: string;
//   originallyAvailableAt: Date;
//   ratingKey: string;
//   slug: string;
//   source: Source;
//   thumb: string;
//   title: string;
//   type: Type;
//   year: number;
//   subtype?: string;
//   playableKey?: string;
// };

// export enum Source {
//   ProviderTvPlexProviderMetadata = "provider://tv.plex.provider.metadata",
//   ProviderTvPlexProviderVOD = "provider://tv.plex.provider.vod",
// }

// export enum Type {
//   Movie = "movie",
// }
