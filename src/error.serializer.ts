import BaseSerializer, { BaseSerializerOpts } from "./base.serializer";

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

/** Alias for a serialized error. */
type SerializedErrorType = ErrorSerializerOpts<
    ErrorOpts & { message?: string; reason?: string }
> & { message?: string };

/**
 * Class to serialize error into an `error` object of a serialized JSON object.
 */
export default class ErrorSerializer extends BaseSerializer<SerializedErrorType> {
    /** Options specific to an `error` object. */
    readonly errorOpts: ErrorSerializerOpts<ErrorOpts>;

    /**
     * Constructs an error serializer.
     * @param opts The top level and `error` object specific options.
     */
    constructor(opts?: BaseSerializerOpts & ErrorSerializerOpts<ErrorOpts>) {
        const baseOpts: BaseSerializerOpts =
            opts === undefined
                ? {}
                : {
                      apiVersion: opts.apiVersion,
                      context: opts.context,
                      id: opts.id,
                      method: opts.method,
                      params: opts.params,
                  };
        super(baseOpts);
        this.errorOpts =
            opts === undefined
                ? {}
                : {
                      code: opts.code,
                      errors: opts.errors,
                  };
    }

    /**
     * Serializes the given content as a `error` object.
     * @param content The object or array of error objects representing the errors to be serialized. If an `Array` of
     *  error objects is given, then each error's `message` field is mapped to the corresponding `message` field of the
     *  object at the same index in `error.errors`. Likewise, the name of the error class is mapped to the corresponding
     *  `reason` field of the object at the same index in `error.errors`.
     * @returns An object with one field, `error`, and the corresponding serialized error object
     * @throws `TypeError` if `error.errors` is `undefined` and `content` is an `Array`.
     */
    protected serializeContent(content: Array<Error> | Error): {
        error: SerializedErrorType;
    } {
        if (content instanceof Array) {
            if (this.errorOpts.errors === undefined) {
                throw new TypeError(
                    "error.errors must be defined if content is an Array"
                );
            }

            const errorElementOpts: Array<ErrorOpts> = this.errorOpts.errors;

            const serializedErrorEntries = content.map((error, index) => {
                return {
                    message: error.message,
                    reason: error.name,
                    domain: errorElementOpts[index].domain,
                    location: errorElementOpts[index].location,
                    locationType: errorElementOpts[index].locationType,
                    extendedHelp: errorElementOpts[index].extendedHelp,
                    sendReport: errorElementOpts[index].sendReport,
                } as ErrorOpts & { message?: string; reason?: string };
            });

            return {
                error: {
                    code: this.errorOpts.code,
                    message: serializedErrorEntries[0].message,
                    errors: serializedErrorEntries,
                },
            };
        } else {
            if (
                this.errorOpts.errors !== undefined &&
                this.errorOpts.errors.length >= 1
            ) {
                const errorElement: ErrorOpts & {
                    message?: string;
                    reason?: string;
                } = {
                    message: content.message,
                    reason: content.name,
                    domain: this.errorOpts.errors[0].domain,
                    location: this.errorOpts.errors[0].location,
                    locationType: this.errorOpts.errors[0].locationType,
                    extendedHelp: this.errorOpts.errors[0].extendedHelp,
                    sendReport: this.errorOpts.errors[0].sendReport,
                };

                return {
                    error: {
                        code: this.errorOpts.code,
                        message: content.message,
                        errors: [errorElement],
                    },
                };
            } else {
                return {
                    error: {
                        code: this.errorOpts.code,
                        message: content.message,
                    },
                };
            }
        }
    }
}
