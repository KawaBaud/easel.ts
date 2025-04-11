import { Matrix4 as ThreeMatrix4, Vector3 as ThreeVector3 } from "three";
import { Maths } from "../../../src/maths/Maths.js";
import { createMatrix4 } from "../../../src/maths/Matrix4.js";
import { createVector3 } from "../../../src/maths/Vector3.js";

const compareMatrices = (ourMat, threeMat, testName, epsilon = 1e-6) => {
    expect(ourMat.elements.length).toBe(16);
    expect(threeMat.elements.length).toBe(16);
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
    test("identity", () => {
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

    test("clone and copy", () => {
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

    test("fromArray / toArray", () => {
        const arr = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]; // column-major
        const ourMat = createMatrix4().fromArray(arr);
        const threeMat = new ThreeMatrix4().fromArray(arr);
        compareMatrices(ourMat, threeMat, "fromArray");

        const ourArr = ourMat.toArray();
        const threeArr = threeMat.toArray();
        expect(ourArr).toEqual(threeArr);

        const offsetArr = [99, 99, ...arr];
        const ourMatOffset = createMatrix4().fromArray(offsetArr, 2);
        const threeMatOffset = new ThreeMatrix4().fromArray(offsetArr, 2);
        compareMatrices(ourMatOffset, threeMatOffset, "fromArray offset");

        const targetArr = [0, 0, 0, 0];
        ourMat.toArray(targetArr, 1);
        threeMat.toArray(targetArr, 1 + 16);
        const threeTargetArr = [];
        threeMat.toArray(threeTargetArr, 0);

        expect(targetArr[0]).toBe(0);
        expect(targetArr[1]).toBeCloseTo(threeTargetArr[0]);
        expect(targetArr[1 + 15]).toBeCloseTo(threeTargetArr[15]);
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
            rotation: [Math.PI / 2, 0, 0],
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
            rotation: [0, Math.PI / 4, 0],
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

        // test(`makeRotationFromQuaternion: ${name}`, () => {
        //     const { ourQuat, threeQuat } = createQuaternions(...rot);
        //     const ourMat = createMatrix4().makeRotationFromQuaternion(ourQuat);
        //     const threeMat = new ThreeMatrix4().makeRotationFromQuaternion(
        //         threeQuat,
        //     );
        //     compareMatrices(
        //         ourMat,
        //         threeMat,
        //         `makeRotationFromQuaternion: ${name}`,
        //         1e-5,
        //     );
        // });

        // test(`compose: ${name}`, () => {
        //     const ourPos = createVector3(...position);
        //     const threePos = new ThreeVector3(...position);
        //     const { ourQuat, threeQuat } = createQuaternions(...rotation);
        //     const ourScale = createVector3(...scale);
        //     const threeScale = new ThreeVector3(...scale);

        //     const ourMat = createMatrix4().compose(ourPos, ourQuat, ourScale);
        //     const threeMat = new ThreeMatrix4().compose(
        //         threePos,
        //         threeQuat,
        //         threeScale,
        //     );
        //     compareMatrices(ourMat, threeMat, `compose: ${name}`, 1e-5);
        // });
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

    test("mulMatrices (A * B)", () => {
        const ourMat = createMatrix4().mulMatrices(ourMatA, ourMatB);
        const threeMat = new ThreeMatrix4().multiplyMatrices(
            threeMatA,
            threeMatB,
        );
        compareMatrices(ourMat, threeMat, "multiplyMatrices (A*B)");
    });

    test("mul (A * B)", () => {
        const ourMat = ourMatA.clone().mul(ourMatB);
        const threeMat = threeMatA.clone().multiply(threeMatB);
        compareMatrices(ourMat, threeMat, "mul (A*B)");
    });

    test("premul (B * A)", () => {
        const ourMat = ourMatA.clone().premul(ourMatB);
        const threeMat = threeMatA.clone().premultiply(threeMatB);
        compareMatrices(ourMat, threeMat, "premul (B*A)");
    });

    test("mulScalar", () => {
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

    test("setPosition / copyPosition", () => {
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
        const fov = 75 * Maths.DEG2RAD;
        const aspect = 16 / 9;
        const near = 0.1;
        const far = 1000;

        const ourMat = createMatrix4().makePerspective(fov, aspect, near, far);
        // three.js uses "left/right/top/bottom", so we convert our "fov/aspect" to
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

describe("Matrix4 lookAt", () => {
    test("matches three.js implementation", () => {
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

    test("produces orthonormal basis", () => {
        const m = createMatrix4();
        const eye = createVector3(1, 2, 3);
        const target = createVector3(4, 5, 6);
        const up = createVector3(0, 1, 0);
        m.lookAt(eye, target, up);

        const right = createVector3(
            m.elements[0],
            m.elements[1],
            m.elements[2],
        );
        const upResult = createVector3(
            m.elements[4],
            m.elements[5],
            m.elements[6],
        );
        const backward = createVector3(
            m.elements[8],
            m.elements[9],
            m.elements[10],
        );

        expect(right.dot(upResult)).toBeCloseTo(0, 6);
        expect(right.dot(backward)).toBeCloseTo(0, 6);
        expect(upResult.dot(backward)).toBeCloseTo(0, 6);

        expect(right.length).toBeCloseTo(1, 6);
        expect(upResult.length).toBeCloseTo(1, 6);
        expect(backward.length).toBeCloseTo(1, 6);
    });

    test("creates correct view matrix when combined w/ translation", () => {
        const eye = createVector3(10, 20, 5);
        const target = createVector3(0, 0, 0);
        const up = createVector3(0, 1, 0);

        const rotationMatrix = createMatrix4();
        rotationMatrix.lookAt(eye, target, up);

        const right = createVector3(
            rotationMatrix.elements[0],
            rotationMatrix.elements[1],
            rotationMatrix.elements[2],
        );
        const upVec = createVector3(
            rotationMatrix.elements[4],
            rotationMatrix.elements[5],
            rotationMatrix.elements[6],
        );
        const forward = createVector3(
            rotationMatrix.elements[8],
            rotationMatrix.elements[9],
            rotationMatrix.elements[10],
        );

        expect(right.dot(upVec)).toBeCloseTo(0, 6);
        expect(right.dot(forward)).toBeCloseTo(0, 6);
        expect(upVec.dot(forward)).toBeCloseTo(0, 6);

        expect(right.length).toBeCloseTo(1, 6);
        expect(upVec.length).toBeCloseTo(1, 6);
        expect(forward.length).toBeCloseTo(1, 6);

        const eyeToTarget = target.clone().sub(eye).unit();
        expect(forward.dot(eyeToTarget)).toBeCloseTo(-1, 6);
    });
});
