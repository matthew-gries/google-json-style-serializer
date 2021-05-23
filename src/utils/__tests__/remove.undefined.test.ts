import removeUndefined from "../remove.undefined";

describe("removeUndefined", () => {
    test.each`
        obj                             | expected
        ${{}}                           | ${{}}
        ${{ a: undefined }}             | ${{}}
        ${{ a: 1, b: undefined }}       | ${{ a: 1 }}
        ${{ a: undefined, b: "hello" }} | ${{ b: "hello" }}
    `("use $obj, expect $expected", ({ obj, expected }) => {
        expect(removeUndefined(obj)).toEqual(expected);
    });
});
