import { BaseSerializerOpts } from "@src/base.serializer";
import DataSerializer, { DataSerializerOpts } from "@src/data.serializer";

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
    id: "id",
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
        name                         | input                                       | expectedBaseOpts | expectedDataOpts
        ${"undefined"}               | ${undefined}                                | ${{}}            | ${{}}
        ${"just base opts"}          | ${{ topLevel: BASE_OPTS }}                  | ${BASE_OPTS}     | ${{}}
        ${"just data opts"}          | ${{ data: DATA_OPTS }}                      | ${{}}            | ${DATA_OPTS}
        ${"both base and data opts"} | ${{ topLevel: BASE_OPTS, data: DATA_OPTS }} | ${BASE_OPTS}     | ${DATA_OPTS}
    `("use $name", ({ input, expectedBaseOpts, expectedDataOpts }) => {
        const serializer = new DataSerializer(input);

        expect(serializer.baseOpts).toEqual(expectedBaseOpts);
        expect(serializer.dataOpts).toEqual(expectedDataOpts);
    });
});

// Helper interface to set up scenarios for testing
interface DataSerializerScenario {
    opts?: { topLevel?: BaseSerializerOpts; data?: DataSerializerOpts };
    data: Array<object> | object;
    expected: object;
}

const NO_OPTIONS_WITH_OBJECT: DataSerializerScenario = {
    data: { field1: 1, field2: "2", field3: true },
    expected: {
        data: {
            field1: 1,
            field2: "2",
            field3: true,
        },
    },
};

const NO_OPTIONS_WITH_ARRAY_ONE_ELEMENT: DataSerializerScenario = {
    data: [{ field1: 1, field2: "1", field3: true }],
    expected: {
        data: {
            items: [{ field1: 1, field2: "1", field3: true }],
        },
    },
};

const TOP_LEVEL_OPTIONS: DataSerializerScenario = {
    opts: {
        topLevel: {
            apiVersion: "apiVersion",
            context: "context",
            id: "id",
            method: "method",
            params: { param1: "param1" },
        },
    },
    data: [
        { id: 1, field: "a" },
        { id: 2, field: "b" },
    ],
    expected: {
        apiVersion: "apiVersion",
        context: "context",
        id: "id",
        method: "method",
        params: { param1: "param1" },
        data: {
            items: [
                { id: 1, field: "a" },
                { id: 2, field: "b" },
            ],
        },
    },
};

const DATA_LEVEL_OPTIONS: DataSerializerScenario = {
    opts: {
        data: {
            kind: "kind",
            fields: "id,field1,field2",
            id: "id",
            self: { id: 1, field1: "1", field2: "a" },
            selfLink: "selfLink",
            next: { id: 2, field1: "2", field2: "b" },
            nextLink: "nextLink",
        },
    },
    data: [
        { id: 1, field1: "1", field2: "a" },
        { id: 2, field1: "2", field2: "b" },
    ],
    expected: {
        data: {
            kind: "kind",
            fields: "id,field1,field2",
            id: "id",
            self: { id: 1, field1: "1", field2: "a" },
            selfLink: "selfLink",
            next: { id: 2, field1: "2", field2: "b" },
            nextLink: "nextLink",
            items: [
                { id: 1, field1: "1", field2: "a" },
                { id: 2, field1: "2", field2: "b" },
            ],
        },
    },
};

const TOP_LEVEL_AND_DATA_LEVEL_OPTS: DataSerializerScenario = {
    opts: {
        data: {
            kind: "kind",
            fields: "id,field1,field2",
            etag: "etag",
            id: "dataID",
            updated: "updated",
            deleted: false,
            currentItemCount: 3,
            itemsPerPage: 1,
            startIndex: 0,
            totalItems: 2,
            pageIndex: 0,
            totalPages: 2,
        },
        topLevel: {
            apiVersion: "apiVersion",
            context: "context",
            id: "topLevelID",
            method: "method",
            params: { param1: "param1" },
        },
    },
    data: [{ id: 1, field1: "1", field2: "a" }],
    expected: {
        apiVersion: "apiVersion",
        context: "context",
        id: "topLevelID",
        method: "method",
        params: { param1: "param1" },
        data: {
            kind: "kind",
            fields: "id,field1,field2",
            etag: "etag",
            id: "dataID",
            updated: "updated",
            deleted: false,
            currentItemCount: 3,
            itemsPerPage: 1,
            startIndex: 0,
            totalItems: 2,
            pageIndex: 0,
            totalPages: 2,
            items: [{ id: 1, field1: "1", field2: "a" }],
        },
    },
};

const KIND_FIELD_MUST_COME_FIRST: DataSerializerScenario = {
    opts: {
        data: {
            fields: "field1,field2",
            kind: "kind",
            deleted: false,
        },
    },
    data: { field1: "1", field2: "a" },
    expected: {
        data: {
            kind: "kind",
            fields: "field1,field2",
            deleted: false,
            field1: "1",
            field2: "a",
        },
    },
};

describe("serialize", () => {
    test.each`
        name                                   | scenario
        ${"no options, single object"}         | ${NO_OPTIONS_WITH_OBJECT}
        ${"no options, single element array"}  | ${NO_OPTIONS_WITH_ARRAY_ONE_ELEMENT}
        ${"top level options only"}            | ${TOP_LEVEL_OPTIONS}
        ${"data level options only"}           | ${DATA_LEVEL_OPTIONS}
        ${"data and top level options"}        | ${TOP_LEVEL_AND_DATA_LEVEL_OPTS}
        ${"check that 'kind' is always first"} | ${KIND_FIELD_MUST_COME_FIRST}
    `("$name", ({ scenario }) => {
        const serializer = new DataSerializer(scenario.opts);
        expect(serializer.serialize(scenario.data)).toEqual(scenario.expected);
    });
});
