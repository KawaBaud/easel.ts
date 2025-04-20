import { MUSI } from "../../src/MUSI.js";

describe("MUSI singleton", () => {
    test("MUSI is frozen object", () => {
        expect(Object.isFrozen(MUSI)).toBe(true);
    });

    test("cannot modify MUSI properties", () => {
        const originalPerspCamera = MUSI.PerspCamera;

        expect(() => {
            MUSI.PerspCamera = () => "modified";
        }).toThrow();
        expect(MUSI.PerspCamera).toBe(originalPerspCamera);
    });

    test("cannot add new properties to MUSI", () => {
        expect(() => {
            MUSI.NewProperty = "new value";
        }).toThrow();
        expect(MUSI.NewProperty).toBeUndefined();
    });
});
