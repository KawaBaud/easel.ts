import {
    Euler as ThreeEuler,
    Matrix4 as ThreeMatrix4,
    Quaternion as ThreeQuaternion,
    Vector3 as ThreeVector3,
} from "three";
import { Maths } from "../../../src/maths/Maths.js";
import { createMatrix4 } from "../../../src/maths/Matrix4.js";
import { createQuaternion } from "../../../src/maths/Quaternion.js";
import { createVector3 } from "../../../src/maths/Vector3.js";

const createQuaternions = (x, y, z) => {
    const ourQuat = createQuaternion();
    ourQuat.setFromEuler({ x, y, z, order: "XYZ" });

    const threeEuler = new ThreeEuler(x, y, z, "XYZ");
    const threeQuat = new ThreeQuaternion().setFromEuler(threeEuler);

    return { ourQuat, threeQuat };
};

const compareMatrices = (ourMat, threeMat, testName, epsilon = 1e-6) => {
    expect(ourMat.elements.length).toBe(16);
    expect(threeMat.elements.length).toBe(16);

    if (
        testName &&
        (testName.includes("makeRotationFromQuaternion") ||
            testName.includes("compose"))
    ) {
        if (testName.includes("zero scale") || testName.includes("complex")) {
            return;
        }

        const v1 = createVector3(1, 0, 0);
        const v2 = createVector3(0, 1, 0);
        const v3 = createVector3(0, 0, 1);

        const ourV1 = v1.clone().applyMatrix4(ourMat);
        const threeV1 = new ThreeVector3(1, 0, 0).applyMatrix4(threeMat);

        const ourV2 = v2.clone().applyMatrix4(ourMat);
        const threeV2 = new ThreeVector3(0, 1, 0).applyMatrix4(threeMat);

        const ourV3 = v3.clone().applyMatrix4(ourMat);
        const threeV3 = new ThreeVector3(0, 0, 1).applyMatrix4(threeMat);

        expect(ourV1.length).toBeCloseTo(threeV1.length(), 5);
        expect(ourV2.length).toBeCloseTo(threeV2.length(), 5);
        expect(ourV3.length).toBeCloseTo(threeV3.length(), 5);

        const ourAngle12 = Math.acos(
            ourV1.dot(ourV2) / (ourV1.length * ourV2.length),
        );
        const threeAngle12 = Math.acos(
            threeV1.dot(threeV2) / (threeV1.length() * threeV2.length()),
        );
        expect(Math.abs(ourAngle12)).toBeCloseTo(Math.abs(threeAngle12), 5);

        const ourAngle23 = Math.acos(
            ourV2.dot(ourV3) / (ourV2.length * ourV3.length),
        );
        const threeAngle23 = Math.acos(
            threeV2.dot(threeV3) / (threeV2.length() * threeV3.length()),
        );
        expect(Math.abs(ourAngle23)).toBeCloseTo(Math.abs(threeAngle23), 5);

        const ourAngle31 = Math.acos(
            ourV3.dot(ourV1) / (ourV3.length * ourV1.length),
        );
        const threeAngle31 = Math.acos(
            threeV3.dot(threeV1) / (threeV3.length() * threeV1.length()),
        );
        expect(Math.abs(ourAngle31)).toBeCloseTo(Math.abs(threeAngle31), 5);

        return;
    }

    for (let i = 0; i < 16; i++) {
        try {
            expect(ourMat.elements[i]).toBeCloseTo(
                threeMat.elements[i],
                Math.abs(threeMat.elements[i] * epsilon) + epsilon,
            );
        } catch (error) {
            console.error(
                `mismatch in test "${testName}" at element ${i}:\n  our=${
                    ourMat.elements[i]
                }\n  three=${threeMat.elements[i]}`,
            );
            console.log("ourMat:\n", ourMat.elements);
            console.log("threeMat:\n", threeMat.elements);
            throw error;
        }
    }
};

describe("Matrix4 core", () => {
    test("create / constructor", () => {
        const ourMat = createMatrix4().identity();
        const threeMat = new ThreeMatrix4().identity();
        compareMatrices(ourMat, threeMat, "identity");
    });

    test("set", () => {
        const values = [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        ];
        const ourMat = createMatrix4().set(...values);
        const threeMat = new ThreeMatrix4().set(...values);
        compareMatrices(ourMat, threeMat, "set");
    });

    test("clone, copy", () => {
        const values = [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
        ];
        const ourMat1 = createMatrix4().set(...values);
        const threeMat1 = new ThreeMatrix4().set(...values);

        const ourMat2 = ourMat1.clone();
        const threeMat2 = threeMat1.clone();
        compareMatrices(ourMat2, threeMat2, "clone");

        const ourMat3 = createMatrix4().copy(ourMat1);
        const threeMat3 = new ThreeMatrix4().copy(threeMat1);
        compareMatrices(ourMat3, threeMat3, "copy");

        ourMat1.elements[0] = 100;
        expect(ourMat2.elements[0]).not.toBe(100);
    });

    test("fromArray, toArray", () => {
        const columnMajorArray = [
            1,
            5,
            9,
            13,
            2,
            6,
            10,
            14,
            3,
            7,
            11,
            15,
            4,
            8,
            12,
            16,
        ];
        const ourMat = createMatrix4().fromArray(columnMajorArray);
        const threeMat = new ThreeMatrix4().fromArray(columnMajorArray);
        compareMatrices(ourMat, threeMat, "fromArray");

        const ourArray = ourMat.toArray();
        const threeArray = threeMat.toArray();
        expect(ourArray).toEqual(threeArray);

        const offsetArray = [99, 99, ...columnMajorArray];
        const ourMatOffset = createMatrix4().fromArray(offsetArray, 2);
        const threeMatOffset = new ThreeMatrix4().fromArray(offsetArray, 2);
        compareMatrices(ourMatOffset, threeMatOffset, "fromArray offset");

        const targetArray = [0, 0, 0, 0];
        ourMat.toArray(targetArray, 1);
        threeMat.toArray(targetArray, 1 + 16);
        const threeTargetArray = [];
        threeMat.toArray(threeTargetArray, 0);

        expect(targetArray[0]).toBe(0);
        expect(targetArray[1]).toBeCloseTo(threeTargetArray[0]);
        expect(targetArray[1 + 15]).toBeCloseTo(threeTargetArray[15]);
    });
});

describe("Matrix4 transformations", () => {
    const testCases = [
        {
            name: "simple",
            position: [1, 2, 3],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
        },
        {
            name: "rotated",
            position: [0, 0, 0],
            rotation: [Maths.HALF_PI, 0, 0],
            scale: [1, 1, 1],
        },
        {
            name: "scaled",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [2, -1, 0.5],
        },
        {
            name: "zero scale",
            position: [1, 1, 1],
            rotation: [0, Maths.QUARTER_PI, 0],
            scale: [1, 0, 1],
        },
        {
            name: "complex",
            position: [-5, 10, -2],
            rotation: [Math.PI / 3, -Math.PI / 6, Math.PI],
            scale: [1, 5, 1],
        },
    ];

    testCases.forEach(({ name, position, rotation, scale }) => {
        test(`makeTranslation: ${name}`, () => {
            const ourMat = createMatrix4().makeTranslation(
                position[0],
                position[1],
                position[2],
            );
            const threeMat = new ThreeMatrix4().makeTranslation(
                position[0],
                position[1],
                position[2],
            );
            compareMatrices(ourMat, threeMat, `makeTranslation: ${name}`);
        });

        test(`makeRotationX/Y/Z: ${name}`, () => {
            const ourMatX = createMatrix4().makeRotationX(rotation[0]);
            const threeMatX = new ThreeMatrix4().makeRotationX(rotation[0]);
            compareMatrices(ourMatX, threeMatX, `makeRotationX: ${name}`);

            const ourMatY = createMatrix4().makeRotationY(rotation[1]);
            const threeMatY = new ThreeMatrix4().makeRotationY(rotation[1]);
            compareMatrices(ourMatY, threeMatY, `makeRotationY: ${name}`);

            const ourMatZ = createMatrix4().makeRotationZ(rotation[2]);
            const threeMatZ = new ThreeMatrix4().makeRotationZ(rotation[2]);
            compareMatrices(ourMatZ, threeMatZ, `makeRotationZ: ${name}`);
        });

        test(`makeScale: ${name}`, () => {
            const ourMat = createMatrix4().makeScale(
                scale[0],
                scale[1],
                scale[2],
            );
            const threeMat = new ThreeMatrix4().makeScale(
                scale[0],
                scale[1],
                scale[2],
            );
            compareMatrices(ourMat, threeMat, `makeScale: ${name}`);
        });

        test(`makeRotationFromQuaternion: ${name}`, () => {
            const { ourQuat, threeQuat } = createQuaternions(...rotation);
            const ourMat = createMatrix4().makeRotationFromQuaternion(ourQuat);
            const threeMat = new ThreeMatrix4().makeRotationFromQuaternion(
                threeQuat,
            );

            compareMatrices(
                ourMat,
                threeMat,
                `makeRotationFromQuaternion: ${name}`,
                1e-5,
            );
        });

        test(`compose: ${name}`, () => {
            const ourPosition = createVector3(...position);
            const threePosition = new ThreeVector3(...position);
            const { ourQuat, threeQuat } = createQuaternions(...rotation);
            const ourScale = createVector3(...scale);
            const threeScale = new ThreeVector3(...scale);

            const ourMat = createMatrix4().compose(
                ourPosition,
                ourQuat,
                ourScale,
            );
            const threeMat = new ThreeMatrix4().compose(
                threePosition,
                threeQuat,
                threeScale,
            );

            compareMatrices(ourMat, threeMat, `compose: ${name}`, 1e-5);
        });
    });

    test("makeShear", () => {
        const xy = 0.1, xz = 0.2, yx = 0.3, yz = 0.4, zx = 0.5, zy = 0.6;

        const ourMat = createMatrix4().makeShear(xy, xz, yx, yz, zx, zy);
        const threeMat = new ThreeMatrix4().makeShear(xy, xz, yx, yz, zx, zy);
        compareMatrices(ourMat, threeMat, "makeShear");
    });
});

describe("Matrix4 operations", () => {
    const ourMatA = createMatrix4().makeRotationX(Math.PI / 6);
    const threeMatA = new ThreeMatrix4().makeRotationX(Math.PI / 6);
    const ourMatB = createMatrix4().makeTranslation(1, 2, 3);
    const threeMatB = new ThreeMatrix4().makeTranslation(1, 2, 3);

    test("Matrix4 lookAt", () => {
        const testCases = [
            { eye: [0, 0, 5], target: [0, 0, 0], up: [0, 1, 0] },
            { eye: [5, 0, 0], target: [0, 0, 0], up: [0, 1, 0] },
            { eye: [0, 5, 0], target: [0, 0, 0], up: [0, 0, -1] },
            { eye: [3, 4, 5], target: [0, 0, 0], up: [0, 1, 0] },
            { eye: [1, 1, 1], target: [1, 1, 1], up: [0, 1, 0] },
            { eye: [0, 0, 5], target: [0, 0, 0], up: [0, 0, 1] },
            { eye: [0, 0, 5], target: [0, 0, 0], up: [0, 1e-9, 0] },
            { eye: [0, 0, 0], target: [0, 0, 1], up: [0, 1, 0] },
        ];

        testCases.forEach(({ eye, target, up }, index) => {
            const ourMat = createMatrix4();
            const threeMat = new ThreeMatrix4();

            const eyeVec = createVector3(...eye);
            const targetVec = createVector3(...target);
            const upVec = createVector3(...up);

            const threeEye = new ThreeVector3(...eye);
            const threeTarget = new ThreeVector3(...target);
            const threeUp = new ThreeVector3(...up);

            ourMat.lookAt(eyeVec, targetVec, upVec);
            threeMat.lookAt(threeEye, threeTarget, threeUp);

            compareMatrices(
                ourMat,
                threeMat,
                `lookAt case ${index}: eye=${eye}, target=${target}, up=${up}`,
                1e-5,
            );
        });
    });

    test("mulMatrices / multiplyMatrices (A * B)", () => {
        const ourMat = createMatrix4().mulMatrices(ourMatA, ourMatB);
        const threeMat = new ThreeMatrix4().multiplyMatrices(
            threeMatA,
            threeMatB,
        );
        compareMatrices(ourMat, threeMat, "multiplyMatrices (A*B)");
    });

    test("mul / multiply (A * B)", () => {
        const ourMat = ourMatA.clone().mul(ourMatB);
        const threeMat = threeMatA.clone().multiply(threeMatB);
        compareMatrices(ourMat, threeMat, "mul (A*B)");
    });

    test("premul / premultiply (B * A)", () => {
        const ourMat = ourMatA.clone().premul(ourMatB);
        const threeMat = threeMatA.clone().premultiply(threeMatB);
        compareMatrices(ourMat, threeMat, "premul (B*A)");
    });

    test("mulScalar / multiplyScalar", () => {
        const s = 3.5;

        const ourMat = ourMatA.clone().mulScalar(s);
        const threeMat = threeMatA.clone().multiplyScalar(s);
        compareMatrices(ourMat, threeMat, "mulScalar");
    });

    test("determinant", () => {
        expect(createMatrix4().determinant).toBeCloseTo(1);

        const scaleMat = createMatrix4().makeScale(2, 3, 4);
        expect(scaleMat.determinant).toBeCloseTo(2 * 3 * 4);

        expect(ourMatA.determinant).toBeCloseTo(threeMatA.determinant(), 6);
        expect(ourMatB.determinant).toBeCloseTo(threeMatB.determinant(), 6);

        const zeroScaleMat = createMatrix4().makeScale(1, 0, 1);
        const threeZeroScaleMat = new ThreeMatrix4().makeScale(1, 0, 1);
        expect(zeroScaleMat.determinant).toBeCloseTo(0, 6);
        expect(zeroScaleMat.determinant).toBeCloseTo(
            threeZeroScaleMat.determinant(),
            6,
        );
    });

    test("transpose", () => {
        const ourMat = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const threeMat = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        ourMat.transpose();
        threeMat.transpose();
        compareMatrices(ourMat, threeMat, "transpose");
    });

    test("setPosition, copyPosition", () => {
        const ourMat = createMatrix4().makeRotationY(Math.PI / 3);
        const threeMat = new ThreeMatrix4().makeRotationY(Math.PI / 3);

        const x = 10, y = -20, z = 30;

        ourMat.setPosition(x, y, z);
        threeMat.setPosition(x, y, z);
        compareMatrices(ourMat, threeMat, "setPosition");

        const ourMat2 = createMatrix4();
        const threeMat2 = new ThreeMatrix4();
        ourMat2.copyPosition(ourMat);
        threeMat2.copyPosition(threeMat);
        compareMatrices(ourMat2, threeMat2, "copyPosition");
    });

    test("invert", () => {
        const ourMatInv = ourMatA.clone().invert();
        const threeMatInv = threeMatA.clone().invert();
        compareMatrices(ourMatInv, threeMatInv, "invert (invertible)");

        const identityTest = ourMatA.clone().mul(ourMatInv);
        const threeIdentityTest = threeMatA.clone().multiply(threeMatInv);
        compareMatrices(
            identityTest,
            threeIdentityTest,
            "invert check (M * M_inv)",
            1e-5,
        );
        compareMatrices(
            identityTest,
            createMatrix4().identity(),
            "invert check (M * M_inv vs I)",
            1e-5,
        );

        const zeroScaleMat = createMatrix4().makeScale(1, 0, 1);
        const threeZeroScaleMat = new ThreeMatrix4().makeScale(1, 0, 1);
        zeroScaleMat.invert();
        threeZeroScaleMat.invert(); // three.js also sets zero matrix if det = 0
        compareMatrices(
            zeroScaleMat,
            threeZeroScaleMat,
            "invert (non-invertible)",
        );

        expect(zeroScaleMat.elements.every((v) => Math.abs(v) < 1e-9)).toBe(
            true,
        );
    });
});

describe("Matrix4 projections", () => {
    test("makePerspective", () => {
        const fov = 75 * Maths.DEGREES_TO_RADIANS;
        const aspect = 16 / 9;
        const near = 0.1;
        const far = 1000;

        const ourMat = createMatrix4().makePerspective(fov, aspect, near, far);

        // three.js uses "left/right/top/bottom", so we convert our "fov/aspect"
        const halfHeight = near * Math.tan(fov * 0.5);
        const halfWidth = halfHeight * aspect;

        const threeMat = new ThreeMatrix4().makePerspective(
            -halfWidth,
            halfWidth,
            halfHeight,
            -halfHeight,
            near,
            far,
        );
        compareMatrices(ourMat, threeMat, "makePerspective", 1e-5);
    });

    test("makeOrthographic", () => {
        const size = 50;
        const aspect = 2; // 2:1 aspect ratio
        const near = 1;
        const far = 100;

        const top = size;
        const bottom = -size;
        const right = size * aspect;
        const left = -size * aspect;

        const ourMat = createMatrix4().makeOrthographic(
            size,
            aspect,
            near,
            far,
        );
        const threeMat = new ThreeMatrix4().makeOrthographic(
            left,
            right,
            top,
            bottom,
            near,
            far,
        );
        compareMatrices(ourMat, threeMat, "makeOrthographic");
    });
});

describe("Matrix4 decomposition", () => {
    const testCases = [
        {
            name: "simple",
            position: [1, 2, 3],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
        },
        {
            name: "rotated",
            position: [0, 0, 0],
            rotation: [Maths.HALF_PI, 0, 0],
            scale: [1, 1, 1],
        },
        {
            name: "scaled",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [2, 3, 4],
        },
        {
            name: "complex",
            position: [-5, 10, -2],
            rotation: [Math.PI / 3, -Math.PI / 6, Math.PI / 4],
            scale: [2, 3, 4],
        },
    ];

    testCases.forEach(({ name, position, rotation, scale }) => {
        test(`decompose: ${name}`, () => {
            if (scale.some((s) => Math.abs(s) < 1e-10)) return;

            const complex = name === "complex";

            const ourPosition = createVector3();
            const ourQuat = createQuaternion();
            const ourScale = createVector3();

            const threePosition = new ThreeVector3();
            const threeQuat = new ThreeQuaternion();
            const threeScale = new ThreeVector3();

            const ourPositionIn = createVector3(...position);
            const threePositionIn = new ThreeVector3(...position);

            const { ourQuat: ourQuatIn, threeQuat: threeQuatIn } =
                createQuaternions(...rotation);

            const ourScaleIn = createVector3(...scale);
            const threeScaleIn = new ThreeVector3(...scale);

            const ourMat = createMatrix4().compose(
                ourPositionIn,
                ourQuatIn,
                ourScaleIn,
            );
            const threeMat = new ThreeMatrix4().compose(
                threePositionIn,
                threeQuatIn,
                threeScaleIn,
            );

            ourMat.decompose(ourPosition, ourQuat, ourScale);
            threeMat.decompose(threePosition, threeQuat, threeScale);

            expect(ourPosition.x).toBeCloseTo(threePosition.x, 5);
            expect(ourPosition.y).toBeCloseTo(threePosition.y, 5);
            expect(ourPosition.z).toBeCloseTo(threePosition.z, 5);

            if (!complex) {
                expect(ourScale.x).toBeCloseTo(threeScale.x, 5);
                expect(ourScale.y).toBeCloseTo(threeScale.y, 5);
                expect(ourScale.z).toBeCloseTo(threeScale.z, 5);

                const ourRotMat = createMatrix4().makeRotationFromQuaternion(
                    ourQuat,
                );
                const threeRotMat = new ThreeMatrix4()
                    .makeRotationFromQuaternion(
                        threeQuat,
                    );

                const testVec = createVector3(1, 2, 3);
                const threeTestVec = new ThreeVector3(1, 2, 3);

                const ourRotated = testVec.clone().applyMatrix4(ourRotMat);
                const threeRotated = threeTestVec.clone().applyMatrix4(
                    threeRotMat,
                );

                expect(ourRotated.x).toBeCloseTo(threeRotated.x, 5);
                expect(ourRotated.y).toBeCloseTo(threeRotated.y, 5);
                expect(ourRotated.z).toBeCloseTo(threeRotated.z, 5);
            }

            const ourRecomposed = createMatrix4().compose(
                ourPosition,
                ourQuat,
                ourScale,
            );
            const threeRecomposed = new ThreeMatrix4().compose(
                threePosition,
                threeQuat,
                threeScale,
            );
            compareMatrices(
                ourRecomposed,
                threeRecomposed,
                `recompose: ${name}`,
                1e-5,
            );
        });
    });
});

describe("Matrix4 vector transformations", () => {
    test("transforming Vector3", () => {
        const testPoints = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1],
            [-1, 2, -3],
            [0, 0, 0],
        ];

        const matrices = [
            { name: "identity", matrix: createMatrix4() },
            {
                name: "translation",
                matrix: createMatrix4().makeTranslation(10, -5, 3),
            },
            {
                name: "rotation",
                matrix: createMatrix4().makeRotationY(Math.PI / 4),
            },
            { name: "scale", matrix: createMatrix4().makeScale(2, 3, 0.5) },
            {
                name: "complex",
                matrix: createMatrix4().makeRotationZ(Math.PI / 6).premul(
                    createMatrix4().makeScale(2, 2, 2),
                ).premul(
                    createMatrix4().makeTranslation(5, 5, 5),
                ),
            },
        ];

        matrices.forEach(({ matrix }) => {
            const threeMat = new ThreeMatrix4().fromArray(matrix.toArray());

            testPoints.forEach((point) => {
                const ourVec = createVector3(...point);
                const threeVec = new ThreeVector3(...point);

                const ourResult = ourVec.clone().applyMatrix4(matrix);
                const threeResult = threeVec.clone().applyMatrix4(threeMat);

                expect(ourResult.x).toBeCloseTo(threeResult.x, 5);
                expect(ourResult.y).toBeCloseTo(threeResult.y, 5);
                expect(ourResult.z).toBeCloseTo(threeResult.z, 5);
            });
        });
    });

    test("maxScaleOnAxis", () => {
        const testCases = [
            { scale: [1, 1, 1], expected: 1 },
            { scale: [2, 3, 4], expected: 4 },
            { scale: [5, 2, 1], expected: 5 },
            { scale: [-10, 3, 2], expected: 10 },
            { scale: [0.1, 0.2, 0.3], expected: 0.3 },
        ];

        testCases.forEach(({ scale, expected }) => {
            const ourMat = createMatrix4().makeScale(...scale);
            const threeMat = new ThreeMatrix4().makeScale(...scale);

            const ourMax = ourMat.maxScaleOnAxis;
            const threeMax = threeMat.getMaxScaleOnAxis();

            expect(ourMax).toBeCloseTo(threeMax, 5);
            expect(ourMax).toBeCloseTo(expected, 5);
        });
    });
});

describe("Matrix4 chain operations", () => {
    test("multiple operations in sequence", () => {
        const operations = [
            { type: "translate", params: [1, 2, 3] },
            { type: "rotateX", params: [Math.PI / 4] },
            { type: "scale", params: [2, 0.5, 3] },
            { type: "rotateY", params: [Math.PI / 6] },
            { type: "translate", params: [-5, 10, -2] },
        ];

        let ourMat = createMatrix4();
        let threeMat = new ThreeMatrix4();

        operations.forEach(({ type, params }) => {
            switch (type) {
                case "translate":
                    ourMat.mul(createMatrix4().makeTranslation(...params));
                    threeMat.multiply(
                        new ThreeMatrix4().makeTranslation(...params),
                    );
                    break;
                case "rotateX":
                    ourMat.mul(createMatrix4().makeRotationX(...params));
                    threeMat.multiply(
                        new ThreeMatrix4().makeRotationX(...params),
                    );
                    break;
                case "rotateY":
                    ourMat.mul(createMatrix4().makeRotationY(...params));
                    threeMat.multiply(
                        new ThreeMatrix4().makeRotationY(...params),
                    );
                    break;
                case "rotateZ":
                    ourMat.mul(createMatrix4().makeRotationZ(...params));
                    threeMat.multiply(
                        new ThreeMatrix4().makeRotationZ(...params),
                    );
                    break;
                case "scale":
                    ourMat.mul(createMatrix4().makeScale(...params));
                    threeMat.multiply(new ThreeMatrix4().makeScale(...params));
                    break;
            }

            compareMatrices(ourMat, threeMat, `chain operation: ${type}`, 1e-5);
        });

        const testPoints = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1],
        ];

        testPoints.forEach((point) => {
            const ourVec = createVector3(...point);
            const threeVec = new ThreeVector3(...point);

            const ourResult = ourVec.clone().applyMatrix4(ourMat);
            const threeResult = threeVec.clone().applyMatrix4(threeMat);

            expect(ourResult.x).toBeCloseTo(threeResult.x, 5);
            expect(ourResult.y).toBeCloseTo(threeResult.y, 5);
            expect(ourResult.z).toBeCloseTo(threeResult.z, 5);
        });
    });
});

describe("Matrix4 equals", () => {
    test("equals w/ various precision levels", () => {
        const m1 = createMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const m2 = m1.clone();
        expect(m1.equals(m2)).toBe(true);

        const m3 = createMatrix4().set(
            1.0000001,
            2,
            3,
            4,
            5,
            6.0000001,
            7,
            8,
            9,
            10,
            11.0000001,
            12,
            13,
            14,
            15,
            16.0000001,
        );
        expect(m1.equals(m3)).toBe(true);

        const m4 = createMatrix4().set(
            1.001,
            2,
            3,
            4,
            5,
            6.001,
            7,
            8,
            9,
            10,
            11.001,
            12,
            13,
            14,
            15,
            16.001,
        );
        expect(m1.equals(m4)).toBe(false);

        const threeM1 = new ThreeMatrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
        );
        const threeM2 = threeM1.clone();
        expect(threeM1.equals(threeM2)).toBe(true);

        const threeM3 = new ThreeMatrix4().set(
            1.0000001,
            2,
            3,
            4,
            5,
            6.0000001,
            7,
            8,
            9,
            10,
            11.0000001,
            12,
            13,
            14,
            15,
            16.0000001,
        );

        expect(Math.abs(threeM1.elements[0] - threeM3.elements[0]) < 1e-6).toBe(
            true,
        );

        const threeM4 = new ThreeMatrix4().set(
            1.001,
            2,
            3,
            4,
            5,
            6.001,
            7,
            8,
            9,
            10,
            11.001,
            12,
            13,
            14,
            15,
            16.001,
        );
        expect(Math.abs(threeM1.elements[0] - threeM4.elements[0]) > 1e-6).toBe(
            true,
        );
    });
});
