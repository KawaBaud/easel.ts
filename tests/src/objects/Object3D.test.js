import { Object3D as ThreeObject3D, Vector3 as ThreeVector3 } from "three";
import { Maths } from "../../../src/maths/Maths.js";
import { createQuaternion } from "../../../src/maths/Quaternion.js";
import { createVector3 } from "../../../src/maths/Vector3.js";
import { createObject3D } from "../../../src/objects/Object3D.js";

const compareVector3 = (ourVec, threeVec, testName, epsilon = 1e-5) => {
    try {
        expect(ourVec.x).toBeCloseTo(threeVec.x, epsilon);
        expect(ourVec.y).toBeCloseTo(threeVec.y, epsilon);
        expect(ourVec.z).toBeCloseTo(threeVec.z, epsilon);
    } catch (error) {
        console.error(
            `mismatch in test "${testName}":\n  our=[${ourVec.x}, ${ourVec.y}, ${ourVec.z}]\n  three=[${threeVec.x}, ${threeVec.y}, ${threeVec.z}]`,
        );
        throw error;
    }
};

const compareQuaternion = (ourQuat, threeQuat, testName, epsilon = 1e-5) => {
    const dotProduct = Math.abs(
        (ourQuat.x * threeQuat.x) +
            (ourQuat.y * threeQuat.y) +
            (ourQuat.z * threeQuat.z) +
            (ourQuat.w * threeQuat.w),
    );

    try {
        expect(dotProduct).toBeCloseTo(1, epsilon);
    } catch (error) {
        console.error(
            `quaternion mismatch in test "${testName}":\n  our=[${ourQuat.x}, ${ourQuat.y}, ${ourQuat.z}, ${ourQuat.w}]\n  three=[${threeQuat.x}, ${threeQuat.y}, ${threeQuat.z}, ${threeQuat.w}]`,
        );
        throw error;
    }
};

describe("Object3D core", () => {
    test("create / constructor", () => {
        const ourObj = createObject3D("test");
        const threeObj = new ThreeObject3D();
        threeObj.name = "test";

        expect(ourObj.id).toBe("test");
        expect(threeObj.name).toBe("test");

        expect(ourObj.isObject3D).toBe(true);
        expect(threeObj.isObject3D).toBe(true);

        expect(ourObj.visible).toBe(true);
        expect(threeObj.visible).toBe(true);

        expect(ourObj.children.length).toBe(0);
        expect(threeObj.children.length).toBe(0);
    });

    test("position, quaternion, scale", () => {
        const ourObj = createObject3D();
        const threeObj = new ThreeObject3D();

        expect(ourObj.position.x).toBe(0);
        expect(ourObj.position.y).toBe(0);
        expect(ourObj.position.z).toBe(0);
        expect(threeObj.position.x).toBe(0);
        expect(threeObj.position.y).toBe(0);
        expect(threeObj.position.z).toBe(0);

        ourObj.position.set(1, 2, 3);
        threeObj.position.set(1, 2, 3);
        expect(ourObj.position.x).toBe(1);
        expect(ourObj.position.y).toBe(2);
        expect(ourObj.position.z).toBe(3);
        expect(threeObj.position.x).toBe(1);
        expect(threeObj.position.y).toBe(2);
        expect(threeObj.position.z).toBe(3);

        expect(ourObj.quaternion.x).toBe(0);
        expect(ourObj.quaternion.y).toBe(0);
        expect(ourObj.quaternion.z).toBe(0);
        expect(ourObj.quaternion.w).toBe(1);
        expect(threeObj.quaternion.x).toBe(0);
        expect(threeObj.quaternion.y).toBe(0);
        expect(threeObj.quaternion.z).toBe(0);
        expect(threeObj.quaternion.w).toBe(1);

        expect(ourObj.scale.x).toBe(1);
        expect(ourObj.scale.y).toBe(1);
        expect(ourObj.scale.z).toBe(1);
        expect(threeObj.scale.x).toBe(1);
        expect(threeObj.scale.y).toBe(1);
        expect(threeObj.scale.z).toBe(1);
    });

    test("layers", () => {
        const ourObj = createObject3D();

        expect(ourObj.layers).toBe(1);
        expect(ourObj.isInLayer(0)).toBe(true);
        expect(ourObj.isInLayer(1)).toBe(false);

        ourObj.setLayer(1);
        expect(ourObj.layers).toBe(2);
        expect(ourObj.isInLayer(0)).toBe(false);
        expect(ourObj.isInLayer(1)).toBe(true);

        ourObj.enableLayer(2);
        expect(ourObj.layers).toBe(6);
        expect(ourObj.isInLayer(1)).toBe(true);
        expect(ourObj.isInLayer(2)).toBe(true);

        ourObj.disableLayer(1);
        expect(ourObj.layers).toBe(4);
        expect(ourObj.isInLayer(1)).toBe(false);
        expect(ourObj.isInLayer(2)).toBe(true);
    });
});

describe("Object3D hierarchy", () => {
    test("parent-child relationship", () => {
        const ourParent = createObject3D("parent");
        const ourChild = createObject3D("child");

        const threeParent = new ThreeObject3D();
        const threeChild = new ThreeObject3D();
        threeParent.name = "parent";
        threeChild.name = "child";

        ourParent.add(ourChild);
        threeParent.add(threeChild);

        expect(ourParent.children.length).toBe(1);
        expect(ourParent.children[0]).toBe(ourChild);
        expect(ourChild.parent).toBe(ourParent);

        expect(threeParent.children.length).toBe(1);
        expect(threeParent.children[0]).toBe(threeChild);
        expect(threeChild.parent).toBe(threeParent);

        ourParent.remove(ourChild);
        threeParent.remove(threeChild);

        expect(ourParent.children.length).toBe(0);
        expect(ourChild.parent).toBe(undefined);

        // three.js uses 'null' instead of 'undefined'
        expect(threeParent.children.length).toBe(0);
        expect(threeChild.parent).toBe(null);
    });

    test("traverse", () => {
        const ourParent = createObject3D("parent");
        const ourChild1 = createObject3D("child1");
        const ourChild2 = createObject3D("child2");

        ourParent.add(ourChild1);
        ourParent.add(ourChild2);

        const visited = [];
        ourParent.traverse((obj) => {
            visited.push(obj.id);
        });

        expect(visited).toEqual(["parent", "child1", "child2"]);
    });

    test("traverseVisible", () => {
        const ourParent = createObject3D("parent");
        const ourChild1 = createObject3D("child1");
        const ourChild2 = createObject3D("child2");

        ourParent.add(ourChild1);
        ourParent.add(ourChild2);

        ourChild2.visible = false;

        const visited = [];
        ourParent.traverseVisible((obj) => {
            visited.push(obj.id);
        });

        expect(visited).toEqual(["parent", "child1"]);
    });

    test("traverseAncestors", () => {
        const ourGrandparent = createObject3D("grandparent");
        const ourParent = createObject3D("parent");
        const ourChild = createObject3D("child");

        ourGrandparent.add(ourParent);
        ourParent.add(ourChild);

        const visited = [];
        ourChild.traverseAncestors((obj) => {
            visited.push(obj.id);
        });

        expect(visited).toEqual(["parent", "grandparent"]);
    });

    test("attach - parent-child relationship", () => {
        const ourParent = createObject3D("parent");
        const ourChild = createObject3D("child");

        ourParent.position.set(10, 0, 0);
        ourChild.position.set(5, 0, 0);

        ourParent.updateMatrix();
        ourChild.updateMatrix();

        ourParent.attach(ourChild);

        expect(ourChild.parent).toBe(ourParent);
        expect(ourParent.children).toContain(ourChild);
    });

    test("clear", () => {
        const ourParent = createObject3D("parent");
        const ourChild1 = createObject3D("child1");
        const ourChild2 = createObject3D("child2");

        ourParent.add(ourChild1);
        ourParent.add(ourChild2);

        expect(ourParent.children.length).toBe(2);

        ourParent.clear();

        expect(ourParent.children.length).toBe(0);
        expect(ourChild1.parent).toBe(undefined);
        expect(ourChild2.parent).toBe(undefined);
    });

    test("getObjectById and getObjectByName", () => {
        const ourParent = createObject3D("parent");
        const ourChild1 = createObject3D("child1");
        const ourChild2 = createObject3D("child2");

        ourChild1.id = "id1";
        ourChild2.id = "id2";

        ourChild1.name = "child1";
        ourChild2.name = "child2";

        ourParent.add(ourChild1);
        ourChild1.add(ourChild2);

        expect(ourParent.getObjectById("id1")).toBe(ourChild1);
        expect(ourParent.getObjectById("id2")).toBe(ourChild2);
        expect(ourParent.getObjectById("nonexistent")).toBe(undefined);

        expect(ourParent.getObjectByName("child1")).toBe(ourChild1);
        expect(ourParent.getObjectByName("child2")).toBe(ourChild2);
        expect(ourParent.getObjectByName("nonexistent")).toBe(undefined);
    });

    test("clone and copy", () => {
        const original = createObject3D("original");
        original.position.set(1, 2, 3);
        original.scale.set(2, 2, 2);
        original.userData = { test: "data" };

        const child = createObject3D("child");
        original.add(child);

        const clone = original.clone();

        expect(clone.id).toBe(original.id);
        expect(clone.position.x).toBe(1);
        expect(clone.position.y).toBe(2);
        expect(clone.position.z).toBe(3);
        expect(clone.scale.x).toBe(2);
        expect(clone.scale.y).toBe(2);
        expect(clone.scale.z).toBe(2);
        expect(clone.userData.test).toBe("data");
        expect(clone.children.length).toBe(1);
        expect(clone.children[0].id).toBe("child");

        const nonRecursiveClone = original.clone(false);
        expect(nonRecursiveClone.children.length).toBe(0);
    });
});

describe("Object3D transformations", () => {
    test("matrix updates", () => {
        const ourObj = createObject3D();
        const threeObj = new ThreeObject3D();

        ourObj.position.set(1, 2, 3);
        threeObj.position.set(1, 2, 3);

        ourObj.updateMatrix();
        threeObj.updateMatrix();

        expect(ourObj.matrix.elements[12]).toBe(1);
        expect(ourObj.matrix.elements[13]).toBe(2);
        expect(ourObj.matrix.elements[14]).toBe(3);

        expect(threeObj.matrix.elements[12]).toBe(1);
        expect(threeObj.matrix.elements[13]).toBe(2);
        expect(threeObj.matrix.elements[14]).toBe(3);
    });

    test("world matrix updates", () => {
        const ourParent = createObject3D();
        const ourChild = createObject3D();

        const threeParent = new ThreeObject3D();
        const threeChild = new ThreeObject3D();

        ourParent.add(ourChild);
        threeParent.add(threeChild);

        ourParent.position.set(1, 0, 0);
        ourChild.position.set(0, 1, 0);

        threeParent.position.set(1, 0, 0);
        threeChild.position.set(0, 1, 0);

        ourParent.updateWorldMatrix(false, true);
        threeParent.updateWorldMatrix(false, true);

        const ourWorldPos = createVector3();
        ourChild.getWorldPosition(ourWorldPos);

        const threeWorldPos = new ThreeVector3();
        threeChild.getWorldPosition(threeWorldPos);

        compareVector3(ourWorldPos, threeWorldPos, "world position");

        expect(ourWorldPos.x).toBeCloseTo(1);
        expect(ourWorldPos.y).toBeCloseTo(1);
        expect(ourWorldPos.z).toBeCloseTo(0);
    });

    test("lookAt", () => {
        const ourObj = createObject3D();
        const threeObj = new ThreeObject3D();

        const ourTarget = createVector3(0, 0, -1);
        const threeTarget = new ThreeVector3(0, 0, -1);

        ourObj.lookAt(ourTarget);
        threeObj.lookAt(threeTarget);

        expect(ourObj.position.x).toBe(0);
        expect(ourObj.position.y).toBe(0);
        expect(ourObj.position.z).toBe(0);

        compareQuaternion(
            ourObj.quaternion,
            threeObj.quaternion,
            "lookAt quaternion",
        );

        const ourDir = createVector3();
        const threeDir = new ThreeVector3();

        ourObj.getWorldDirection(ourDir);
        threeObj.getWorldDirection(threeDir);

        compareVector3(ourDir, threeDir, "lookAt direction");
    });

    test("rotation methods", () => {
        const testCases = [
            { name: "rotateX", angle: Maths.HALF_PI, method: "rotateX" },
            { name: "rotateY", angle: Math.PI / 3, method: "rotateY" },
            { name: "rotateZ", angle: Maths.QUARTER_PI, method: "rotateZ" },
        ];

        testCases.forEach(({ name, angle, method }) => {
            const ourObj = createObject3D();
            const threeObj = new ThreeObject3D();

            ourObj[method](angle);
            threeObj[method](angle);

            compareQuaternion(ourObj.quaternion, threeObj.quaternion, name);

            const ourDir = createVector3();
            const threeDir = new ThreeVector3();
            ourObj.getWorldDirection(ourDir);
            threeObj.getWorldDirection(threeDir);

            expect(Math.abs(ourDir.x)).toBeCloseTo(Math.abs(threeDir.x), 5);
            expect(Math.abs(ourDir.y)).toBeCloseTo(Math.abs(threeDir.y), 5);
            expect(Math.abs(ourDir.z)).toBeCloseTo(Math.abs(threeDir.z), 5);
        });
    });

    test("getWorldDirection", () => {
        const testCases = [
            { name: "default", rotation: [0, 0, 0], expected: [0, 0, 1] },
            {
                name: "rotateY90",
                rotation: [0, Maths.HALF_PI, 0],
                expected: [1, 0, 0],
            },
            {
                name: "rotateX90",
                rotation: [Maths.HALF_PI, 0, 0],
                expected: [0, -1, 0],
            },
        ];

        testCases.forEach(({ rotation, expected }) => {
            const ourObj = createObject3D();
            const threeObj = new ThreeObject3D();

            ourObj.rotateX(rotation[0]);
            ourObj.rotateY(rotation[1]);
            ourObj.rotateZ(rotation[2]);

            threeObj.rotateX(rotation[0]);
            threeObj.rotateY(rotation[1]);
            threeObj.rotateZ(rotation[2]);

            const ourDir = createVector3();
            const threeDir = new ThreeVector3();

            ourObj.getWorldDirection(ourDir);
            threeObj.getWorldDirection(threeDir);

            expect(Math.abs(ourDir.x)).toBeCloseTo(Math.abs(threeDir.x), 5);
            expect(Math.abs(ourDir.y)).toBeCloseTo(Math.abs(threeDir.y), 5);
            expect(Math.abs(ourDir.z)).toBeCloseTo(Math.abs(threeDir.z), 5);

            if (expected) {
                const absExpected = expected.map(Math.abs);
                const absOurDir = [
                    Math.abs(ourDir.x),
                    Math.abs(ourDir.y),
                    Math.abs(ourDir.z),
                ];

                expect(absOurDir[0]).toBeCloseTo(absExpected[0], 5);
                expect(absOurDir[1]).toBeCloseTo(absExpected[1], 5);
                expect(absOurDir[2]).toBeCloseTo(absExpected[2], 5);
            }
        });
    });

    test("getWorldQuaternion and getWorldScale", () => {
        const ourParent = createObject3D("parent");
        const ourChild = createObject3D();

        ourParent.position.set(1, 0, 0);
        ourParent.scale.set(2, 2, 2);
        ourParent.rotateY(Maths.HALF_PI); // 90 degrees

        ourChild.position.set(0, 1, 0);
        ourChild.scale.set(0.5, 0.5, 0.5);
        ourChild.rotateX(Maths.HALF_PI); // 90 degrees

        ourParent.add(ourChild);

        ourParent.updateWorldMatrix(false, true);

        const worldQuat = createQuaternion();
        ourChild.getWorldQuaternion(worldQuat);

        expect(worldQuat.x).not.toBeCloseTo(ourChild.quaternion.x);
        expect(worldQuat.y).not.toBeCloseTo(ourChild.quaternion.y);
        expect(worldQuat.z).not.toBeCloseTo(ourChild.quaternion.z);
        expect(worldQuat.w).not.toBeCloseTo(ourChild.quaternion.w);

        const worldScale = createVector3();
        ourChild.getWorldScale(worldScale);

        expect(worldScale.x).toBeCloseTo(1);
        expect(worldScale.y).toBeCloseTo(1);
        expect(worldScale.z).toBeCloseTo(1);
    });

    test("localToWorld and worldToLocal", () => {
        const ourObj = createObject3D();

        ourObj.position.set(1, 2, 3);
        ourObj.rotateY(Maths.HALF_PI); // 90 degrees
        ourObj.updateMatrix();
        ourObj.updateWorldMatrix();

        const localPoint = createVector3(0, 0, 1);
        const worldPoint = localPoint.clone();
        ourObj.localToWorld(worldPoint);

        expect(worldPoint.x).toBeCloseTo(0);
        expect(worldPoint.y).toBeCloseTo(2);
        expect(worldPoint.z).toBeCloseTo(3);

        const backToLocal = worldPoint.clone();
        ourObj.worldToLocal(backToLocal);

        expect(backToLocal.x).toBeCloseTo(localPoint.x);
        expect(backToLocal.y).toBeCloseTo(localPoint.y);
        expect(backToLocal.z).toBeCloseTo(localPoint.z);
    });

    test("translateOnAxis and rotateOnWorldAxis", () => {
        const ourObj = createObject3D();

        const customAxis = createVector3(1, 1, 0).unit();
        ourObj.translateOnAxis(customAxis, 2);

        const expectedPos = Math.sqrt(2);
        expect(ourObj.position.x).toBeCloseTo(expectedPos);
        expect(ourObj.position.y).toBeCloseTo(expectedPos);
        expect(ourObj.position.z).toBeCloseTo(0);

        ourObj.rotateY(Maths.HALF_PI);

        const worldZAxis = createVector3(0, 0, 1);
        ourObj.rotateOnWorldAxis(worldZAxis, Maths.HALF_PI);

        const dir = createVector3();
        ourObj.getWorldDirection(dir);

        const length = Math.sqrt(
            (dir.x * dir.x) + (dir.y * dir.y) + (dir.z * dir.z),
        );
        expect(length).toBeCloseTo(1);
    });
});
