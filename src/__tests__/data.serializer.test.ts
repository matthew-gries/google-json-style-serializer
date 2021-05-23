import { BaseSerializerOpts } from "../base.serializer";
import DataSerializer, { DataSerializerOpts } from "../data.serializer";
import removeUndefined from "../utils/remove.undefined";


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
        name                         | input                                      | expectedBaseOpts | expectedDataOpts
        ${undefined}                 | ${undefined}                               | ${{}}            | ${{}}
        ${"empty object"}            | ${{}}                                      | ${{}}            | ${{}}
        ${"just base opts"}          | ${BASE_OPTS}                               | ${BASE_OPTS}     | ${{}}
        ${"just data opts"}          | ${DATA_OPTS}                               | ${{}}            | ${DATA_OPTS}
        ${"both base and data opts"} | ${Object.assign({}, BASE_OPTS, DATA_OPTS)} | ${BASE_OPTS}     | ${DATA_OPTS}
    `("use $name", ({ input, expectedBaseOpts, expectedDataOpts }) => {
        const serializer = new DataSerializer(input);

        const serializedBaseOpts = removeUndefined(serializer.baseOpts);
        const serializedDataOpts = removeUndefined(serializer.dataOpts);

        expect(serializedBaseOpts).toEqual(expectedBaseOpts);
        expect(serializedDataOpts).toEqual(expectedDataOpts);
    });
});

// Helper interface to set up scenarios for testing
interface DataSerializerScenario {
    opts: BaseSerializerOpts & DataSerializerOpts;
    data: Array<object> | object;
    expected: object;
}

const NO_OPTIONS: DataSerializerScenario = {
    opts: {},
    data: { field1: 1, field2: "2", field3: true },
    expected: {
        data: {
            field1: 1,
            field2: "2",
            field3: true,
        },
    },
};

describe("serialize", () => {
    test.each`
        name                           | scenario
        ${"no options, single object"} | ${NO_OPTIONS}
    `("$name", ({ scenario }) => {
        const serializer = new DataSerializer(scenario.opts);
        expect(serializer.serialize(scenario.data)).toEqual(scenario.expected);
    });
});
