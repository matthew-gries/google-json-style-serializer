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
    params?: Record<string, any>;
}

/**
 * Base class for serializers. Handles all top level JSON properties outside of `data` and `error` fields.
 * @template T The interface describing the serialized child data (i.e. anything that is not a top level field).
 */
export default abstract class BaseSerializer<T> {
    /** Top level serializer options. */
    readonly baseOpts: BaseSerializerOpts;

    /**
     * Construct a base serializer.
     * @param opts The top level JSON properties to use, if provided.
     */
    constructor(opts?: BaseSerializerOpts) {
        this.baseOpts = opts !== undefined ? opts : {};
    }

    /**
     * Abstract method to define how data or errors are serialized.
     * @param content The object or array of objects representing the data or errors to be serialized.
     * @returns An object with one field, `name`, that describes the type of information serialized
     *  in its corresponding object described by `T`.
     */
    protected abstract serializeContent(content: Array<object> | object): {
        [name: string]: T;
    };

    /**
     * Serialize the given data and join it with the top level options.
     * @param content The data to serialize. The serialization of this data is handled by `serializeContent`.
     * @returns The complete serialized object, including top level fields.
     */
    serialize(
        content: Array<object> | object
    ): BaseSerializerOpts & { [name: string]: T } {
        const serializedChildData = this.serializeContent(content);
        const opts = this.baseOpts;
        return Object.assign({}, opts, serializedChildData);
    }
}