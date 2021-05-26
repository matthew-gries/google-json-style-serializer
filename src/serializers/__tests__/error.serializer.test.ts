import { BaseSerializerOpts } from "../../interfaces/base.serializer.interfaces";
import {
    ErrorOpts,
    ErrorSerializerOpts,
} from "../../interfaces/error.serializer.interfaces";
import ErrorSerializer from "../error.serializer";

const BASE_OPTS: BaseSerializerOpts = {
    apiVersion: "apiVersion",
    context: "context",
    id: "id",
    method: "method",
    params: { param1: 1 },
};

const ERROR_OPTS: ErrorSerializerOpts<ErrorOpts> = {
    code: 200,
    errors: [
        {
            domain: "domain",
            extendedHelp: "extendedHelp",
            location: "location",
            locationType: "locationType",
            sendReport: "sendReport",
        },
    ],
};

describe("constructor with/without opts", () => {
    test.each`
        name                          | input                                         | expectedBaseOpts | expectedErrorOpts
        ${"undefined"}                | ${undefined}                                  | ${{}}            | ${{}}
        ${"just base opts"}           | ${{ topLevel: BASE_OPTS }}                    | ${BASE_OPTS}     | ${{}}
        ${"just error opts"}          | ${{ error: ERROR_OPTS }}                      | ${{}}            | ${ERROR_OPTS}
        ${"both base and error opts"} | ${{ topLevel: BASE_OPTS, error: ERROR_OPTS }} | ${BASE_OPTS}     | ${ERROR_OPTS}
    `("use $name", ({ input, expectedBaseOpts, expectedErrorOpts }) => {
        const serializer = new ErrorSerializer(input);

        expect(serializer.baseOpts).toEqual(expectedBaseOpts);
        expect(serializer.errorOpts).toEqual(expectedErrorOpts);
    });
});

// Helper interface to set up scenarios for testing
interface ErrorSerializerScenario {
    opts?: {
        topLevel?: BaseSerializerOpts;
        error?: ErrorSerializerOpts<ErrorOpts>;
    };
    error: Array<Error> | Error;
    expected: object;
}

const NO_OPTIONS_WITH_OBJECT: ErrorSerializerScenario = {
    error: new Error("error"),
    expected: {
        error: {
            message: "error",
        },
    },
};

const NO_OPTIONS_WITH_ARRAY_ONE_ELEMENT: ErrorSerializerScenario = {
    error: [new TypeError("type error")],
    expected: {
        error: {
            message: "type error",
            errors: [{ message: "type error", reason: "TypeError" }],
        },
    },
};

const MAP_ERROR_OBJECTS_TO_SEIRALIZED_ERROR_LIST: ErrorSerializerScenario = {
    opts: {
        error: {
            errors: [
                {
                    domain: "domain1",
                    location: "location1",
                    locationType: "locationType1",
                    extendedHelp: "extendedHelp1",
                    sendReport: "sendReport1",
                },
                {
                    domain: "domain2",
                    location: "location2",
                    locationType: "locationType2",
                    extendedHelp: "extendedHelp2",
                    sendReport: "sendReport2",
                },
            ],
        },
    },
    error: [new TypeError("type error"), new RangeError("range error")],
    expected: {
        error: {
            message: "type error",
            errors: [
                {
                    message: "type error",
                    reason: "TypeError",
                    domain: "domain1",
                    location: "location1",
                    locationType: "locationType1",
                    extendedHelp: "extendedHelp1",
                    sendReport: "sendReport1",
                },
                {
                    message: "range error",
                    reason: "RangeError",
                    domain: "domain2",
                    location: "location2",
                    locationType: "locationType2",
                    extendedHelp: "extendedHelp2",
                    sendReport: "sendReport2",
                },
            ],
        },
    },
};

const ONLY_TOP_LEVEL_OPTS: ErrorSerializerScenario = {
    opts: {
        topLevel: {
            apiVersion: "apiVersion",
            context: "context",
            id: "id",
            method: "method",
            params: { param1: "param1" },
        },
    },
    error: new Error("error message"),
    expected: {
        apiVersion: "apiVersion",
        context: "context",
        id: "id",
        method: "method",
        params: { param1: "param1" },
        error: {
            message: "error message",
        },
    },
};

const ONLY_ERROR_LEVEL_OPTS: ErrorSerializerScenario = {
    opts: {
        error: {
            code: 200,
            errors: [
                {
                    domain: "domain1",
                    location: "location1",
                    locationType: "locationType1",
                    extendedHelp: "extendedHelp1",
                    sendReport: "sendReport1",
                },
            ],
        },
    },
    error: new Error("error message"),
    expected: {
        error: {
            code: 200,
            message: "error message",
            errors: [
                {
                    message: "error message",
                    reason: "Error",
                    domain: "domain1",
                    location: "location1",
                    locationType: "locationType1",
                    extendedHelp: "extendedHelp1",
                    sendReport: "sendReport1",
                },
            ],
        },
    },
};

const IF_OBJECT_ERROR_THEN_USE_FIRST_ERRORS_ENTRY: ErrorSerializerScenario = {
    opts: {
        error: {
            code: 200,
            errors: [
                {
                    domain: "domain1",
                    location: "location1",
                    locationType: "locationType1",
                    extendedHelp: "extendedHelp1",
                    sendReport: "sendReport1",
                },
                {
                    domain: "domain2",
                    location: "location2",
                    locationType: "locationType2",
                    extendedHelp: "extendedHelp2",
                    sendReport: "sendReport2",
                },
            ],
        },
    },
    error: new Error("error message"),
    expected: {
        error: {
            code: 200,
            message: "error message",
            errors: [
                {
                    message: "error message",
                    reason: "Error",
                    domain: "domain1",
                    location: "location1",
                    locationType: "locationType1",
                    extendedHelp: "extendedHelp1",
                    sendReport: "sendReport1",
                },
            ],
        },
    },
};

describe("serialize", () => {
    test.each`
        name                                                                      | scenario
        ${"no options, single object"}                                            | ${NO_OPTIONS_WITH_OBJECT}
        ${"no options, single element array"}                                     | ${NO_OPTIONS_WITH_ARRAY_ONE_ELEMENT}
        ${"errors options, two element array, map errors options to elements"}    | ${MAP_ERROR_OBJECTS_TO_SEIRALIZED_ERROR_LIST}
        ${"only top level opts"}                                                  | ${ONLY_TOP_LEVEL_OPTS}
        ${"only error level opts"}                                                | ${ONLY_ERROR_LEVEL_OPTS}
        ${"if errors is defined and error is object, use the first errors entry"} | ${IF_OBJECT_ERROR_THEN_USE_FIRST_ERRORS_ENTRY}
    `("$name", ({ scenario }) => {
        const serializer = new ErrorSerializer(scenario.opts);
        expect(serializer.serialize(scenario.error)).toEqual(scenario.expected);
    });
});

test("fails when error.errors and given list of error objects do not have same length", () => {
    const serializer = new ErrorSerializer({
        error: MAP_ERROR_OBJECTS_TO_SEIRALIZED_ERROR_LIST.opts?.error,
    });

    const tooLittleErrors = () => {
        serializer.serialize([new Error("e1")]);
    };

    const tooManyErrors = () => {
        serializer.serialize([
            new Error("e1"),
            new Error("e2"),
            new Error("e3"),
        ]);
    };

    expect(tooLittleErrors).toThrow(RangeError);
    expect(tooManyErrors).toThrow(RangeError);
});
