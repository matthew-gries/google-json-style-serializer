import BaseSerializer from "./base.serializer";
import removeUndefined from "../utils/remove.undefined";
import { BaseSerializerOpts } from "../interfaces/base.serializer.interfaces";
import {
    ErrorSerializerOpts,
    ErrorOpts,
    SerializedError,
} from "../interfaces/error.serializer.interfaces";

/**
 * Class to serialize error into an `error` object of a serialized JSON object.
 */
export default class ErrorSerializer extends BaseSerializer<SerializedError> {
    /** Options specific to an `error` object. */
    readonly errorOpts: ErrorSerializerOpts<ErrorOpts>;

    /**
     * Constructs an error serializer.
     * @param opts The top level and `error` object specific options.
     */
    constructor(opts?: {
        topLevel?: BaseSerializerOpts;
        error?: ErrorSerializerOpts<ErrorOpts>;
    }) {
        const baseOpts: BaseSerializerOpts =
            opts !== undefined && opts.topLevel !== undefined
                ? removeUndefined<BaseSerializerOpts>(opts.topLevel)
                : {};
        super(baseOpts);
        this.errorOpts =
            opts !== undefined && opts.error !== undefined
                ? removeUndefined<ErrorSerializerOpts<ErrorOpts>>(opts.error)
                : {};
    }

    /**
     * Serializes the given content as a `error` object.
     * @param content The object or array of error objects representing the errors to be serialized. If an `Array` of
     *  error objects is given, then each error's `message` field is mapped to the corresponding `message` field of the
     *  object at the same index in `error.errors`. Likewise, the name of the error class is mapped to the corresponding
     *  `reason` field of the object at the same index in `error.errors`. TODO update this comment.
     * @returns An object with one field, `error`, and the corresponding serialized error object
     * @throws `RangeError` if `content` is an `Array` and `error.errors` does not have the same length as `content`.
     */
    protected serializeContent(content: Array<Error> | Error): {
        error: SerializedError;
    } {
        if (content instanceof Array) {
            return this.handleArrayContent(content);
        } else {
            return this.handleObjectContent(content);
        }
    }

    private handleArrayContent(content: Array<Error>): {
        error: SerializedError;
    } {
        if (
            this.errorOpts.errors !== undefined &&
            this.errorOpts.errors.length !== content.length
        ) {
            throw new RangeError(
                "If error.errors is defined, must have the same length as content"
            );
        }

        if (this.errorOpts.errors === undefined) {
            const serializedErrorEntries = content.map((error) => {
                return {
                    message: error.message,
                    reason: error.name,
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
        }
    }

    private handleObjectContent(content: Error): {
        error: SerializedError;
    } {
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
