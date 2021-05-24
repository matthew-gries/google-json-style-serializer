/**
 * Interface describing the properties of an error object inside of `error.errors`. See
 * https://google.github.io/styleguide/jsoncstyleguide.xml?showone=error.errors#error.errors for more
 * information. `reason` and `message` are provided by the error object that is serialized.
 */
export interface ErrorOpts {
    domain?: string;
    location?: string;
    locationType?: string;
    extendedHelp?: string;
    sendReport?: string;
}

/**
 * Interface to describe the properties of an `error` object. See
 * https://google.github.io/styleguide/jsoncstyleguide.xml#Reserved_Property_Names_in_the_error_object for
 * more information. The `message` field is dependant on the error that is serialized.
 */
export interface ErrorSerializerOpts<ErrorType> {
    code?: number;
    errors?: Array<ErrorType>;
}

/**
 * Alias for errors that have been fully serialized.
 */
export type SerializedError = ErrorSerializerOpts<
    ErrorOpts & { message?: string; reason?: string }
> & { message?: string };
