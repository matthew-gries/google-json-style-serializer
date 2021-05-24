/**
 * Properties of the `data` object. See
 * https://google.github.io/styleguide/jsoncstyleguide.xml#Reserved_Property_Names_in_the_data_object,
 * https://google.github.io/styleguide/jsoncstyleguide.xml#Reserved_Property_Names_for_Paging, and
 * https://google.github.io/styleguide/jsoncstyleguide.xml#Reserved_Property_Names_for_Links, for
 * more information. The only option not included is `items` since this is dependant on the type of
 * data given to be serialized.
 */
export interface DataSerializerOpts {
    kind?: string;
    fields?: string;
    etag?: string;
    lang?: string;
    id?: string;
    updated?: string;
    deleted?: boolean;
    currentItemCount?: number;
    itemsPerPage?: number;
    startIndex?: number;
    totalItems?: number;
    pagingLinkTemplate?: string;
    pageIndex?: number;
    totalPages?: number;
    self?: unknown;
    selfLink?: string;
    edit?: unknown;
    editLink?: string;
    next?: unknown;
    nextLink?: string;
    previous?: unknown;
    previousLink?: string;
}

/**
 * Alias for data that has been fully serialized.
 */
export type SerializedData = DataSerializerOpts & {
    items?: Array<unknown>;
} & Record<string, unknown>;
