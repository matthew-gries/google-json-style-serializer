/**
 * Interface for top level serializer options, see
 * https://google.github.io/styleguide/jsoncstyleguide.xml#Top-Level_Reserved_Property_Names for
 * more information. Does not include `data` or `error`.
 */
export interface BaseSerializerOpts {
    apiVersion?: string;
    context?: string;
    id?: string;
    method?: string;
    params?: Record<string, unknown>;
}
