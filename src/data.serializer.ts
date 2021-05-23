import BaseSerializer, { BaseSerializerOpts } from "./base.serializer";

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
    dataID?: string;
    updated?: string;
    deleted?: boolean;
    currentItemCount?: number;
    itemsPerPage?: number;
    startIndex?: number;
    totalItems?: number;
    pagingLinkTemplate?: string;
    pageIndex?: number;
    totalPages?: number;
    self?: object;
    selfLink?: string;
    edit?: object;
    editLink?: string;
    next?: object;
    nextLink?: string;
    previous?: object;
    previousLink?: string;
}
/** Alias for serialized data */
type SerializedDataType = DataSerializerOpts & {
    items?: Array<object>;
} & Record<string, any>;

/**
 * Class to serialize data into the `data` object of a serialized JSON object.
 */
export default class DataSerializer extends BaseSerializer<SerializedDataType> {
    /** Fields specific to the `data` object, with the exception of `items` since this is created depending
     *  on the given data to serialize.
     */
    readonly dataOpts: DataSerializerOpts;

    /**
     * Constructs a data serializer.
     * @param opts The top level and `data` object specific options.
     */
    constructor(opts?: BaseSerializerOpts & DataSerializerOpts) {
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
        this.dataOpts =
            opts === undefined
                ? {}
                : {
                      kind: opts.kind,
                      fields: opts.fields,
                      etag: opts.etag,
                      dataID: opts.dataID,
                      deleted: opts.deleted,
                      updated: opts.updated,
                      currentItemCount: opts.currentItemCount,
                      itemsPerPage: opts.itemsPerPage,
                      startIndex: opts.startIndex,
                      totalItems: opts.totalItems,
                      pagingLinkTemplate: opts.pagingLinkTemplate,
                      pageIndex: opts.pageIndex,
                      totalPages: opts.totalPages,
                      self: opts.self,
                      selfLink: opts.selfLink,
                      edit: opts.edit,
                      editLink: opts.editLink,
                      next: opts.next,
                      nextLink: opts.nextLink,
                      previous: opts.previous,
                      previousLink: opts.previousLink,
                  };
    }

    /**
     * Serializes the given content as a `data` object.
     * @param content The object or array of objects representing the data to be serialized.
     * @returns An object with one field, `data`, that contains the serialized data in an object
     *  described by `DataSerializerOpts`. If `content` is an `Array`, then `items` will be present with
     *  data serialized data. Otherwise, the fields of `content` will be present in the `data` object.
     */
    protected serializeContent(content: Array<object> | object): {
        data: SerializedDataType;
    } {
        const serializedContent =
            content instanceof Array ? { items: content } : content;
        const serializedData = {
            data: {
                ...this.dataOpts,
            },
        };
        return Object.assign({}, serializedData, serializedContent);
    }
}
