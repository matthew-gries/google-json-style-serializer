import BaseSerializer from "./base.serializer";
import { BaseSerializerOpts } from "../interfaces/base.serializer.interfaces";
import removeUndefined from "../utils/remove.undefined";
import {
    DataSerializerOpts,
    SerializedData,
} from "@src/interfaces/data.serializer.interfaces";

/**
 * Class to serialize data into the `data` object of a serialized JSON object.
 */
export default class DataSerializer extends BaseSerializer<SerializedData> {
    /** Fields specific to the `data` object, with the exception of `items` since this is created depending
     *  on the given data to serialize.
     */
    readonly dataOpts: DataSerializerOpts;

    /**
     * Constructs a data serializer.
     * @param opts The top level and `data` object specific options.
     */
    constructor(opts?: {
        topLevel?: BaseSerializerOpts;
        data?: DataSerializerOpts;
    }) {
        const baseOpts: BaseSerializerOpts =
            opts !== undefined && opts.topLevel !== undefined
                ? removeUndefined<BaseSerializerOpts>(opts.topLevel)
                : {};
        super(baseOpts);
        this.dataOpts =
            opts !== undefined && opts.data !== undefined
                ? removeUndefined<DataSerializerOpts>(opts.data)
                : {};
    }

    /**
     * Serializes the given content as a `data` object.
     * @param content The object or array of objects representing the data to be serialized.
     * @returns An object with one field, `data`, that contains the serialized data in an object
     *  described by `SerializedData`. If `content` is an `Array`, then `items` will be present with
     *  data serialized data. Otherwise, the fields of `content` will be present in the `data` object.
     */
    protected serializeContent(content: Array<unknown> | unknown): {
        data: SerializedData;
    } {
        const serializedContent =
            content instanceof Array ? { items: content } : content;

        // Ensure that `kind` is the first field of the `data` object
        const sortedDataOpts = {
            kind: this.dataOpts.kind,
            ...((): DataSerializerOpts => {
                const tempOpts: DataSerializerOpts = { ...this.dataOpts };
                delete tempOpts.kind;
                return tempOpts;
            })(),
        };

        const serializedData = Object.assign(
            {},
            sortedDataOpts,
            serializedContent
        );

        return {
            data: removeUndefined<SerializedData>(serializedData),
        };
    }
}
