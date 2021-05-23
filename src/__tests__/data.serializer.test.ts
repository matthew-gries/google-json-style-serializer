import { BaseSerializerOpts } from "../base.serializer";
import DataSerializer, { DataSerializerOpts } from "../data.serializer";

// Helper function to remove undefined from objects
function removeUndefined(obj: object): object {
    return (Object.keys(obj) as Array<keyof typeof obj>).reduce((acc, key) => {
        if (obj[key] !== undefined) {
            acc[key] = obj[key];
        }
        return acc;
    }, {} as {[key: string]: any});
}

describe("removeUndefined", () => {
    test.each`
        obj                                 | expected
        ${{}}                               | ${{}}  
        ${{a: undefined}}                   | ${{}}
        ${{a: 1, b: undefined}}             | ${{a: 1}}
        ${{a: undefined, b: "hello"}}       | ${{b: "hello"}}
    `("use $obj, expect $expected", ({obj, expected}) => {
        expect(removeUndefined(obj)).toEqual(expected);
    });
});

const BASE_OPTS: BaseSerializerOpts = {
    apiVersion: "apiVersion",
    context: "context",
    id: "id",
    method: "method",
    params: { param1: 1 },
};

const DATA_OPTS: DataSerializerOpts = {
    kind: "kind",
    fields: "fields",
    etag: "etag",
    dataID: "dataID",
    updated: "updated",
    deleted: true,
    currentItemCount: 1,
    itemsPerPage: 2,
    startIndex: 3,
    totalItems: 4,
    pagingLinkTemplate: "pagingLinTemplate",
    pageIndex: 5,
    totalPages: 6,
    self: { self: "self" },
    selfLink: "selfLink",
    edit: { edit: "edit" },
    editLink: "editLink",
    next: { next: "next" },
    nextLink: "nextLink",
    previous: { previous: "previous" },
    previousLink: "previousLink",
};

describe("constructor with/without opts", () => {
    test.each`
        name                        | input                                      | expectedBaseOpts | expectedDataOpts
        ${undefined}                | ${undefined}                               | ${{}}            | ${{}}
        ${"empty object"}           | ${{}}                                      | ${{}}            | ${{}}
        ${"just base opts"}         | ${BASE_OPTS}                               | ${BASE_OPTS}     | ${{}}
        ${"just data opts"}         | ${DATA_OPTS}                               | ${{}}            | ${DATA_OPTS}
        ${"both base and data opts"}| ${Object.assign({}, BASE_OPTS, DATA_OPTS)} | ${BASE_OPTS}     | ${DATA_OPTS}
    `(
        "use $name",
        ({ input, expectedBaseOpts, expectedDataOpts }) => {
            const serializer = new DataSerializer(input);

            const serializedBaseOpts = removeUndefined(serializer.baseOpts);
            const serializedDataOpts = removeUndefined(serializer.dataOpts);

            expect(serializedBaseOpts).toEqual(expectedBaseOpts);
            expect(serializedDataOpts).toEqual(expectedDataOpts);
        }
    );
});
