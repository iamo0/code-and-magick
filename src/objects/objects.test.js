import { 
  BaseGameObject,
  Direction,
  getObjectsIntersectionType,
  getObjectsIntersectionRect,
  ObjectsIntersectionType,
  updateObject,
} from "./objects";


describe("Objects intersection", () => {
  describe("Objects intersection rectangle", () => {
    describe("Objects intersect", () => {
      test("First object is at left of the second one, partial interlap", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 75,
          y: 75,
          width: 100,
          height: 100,
        };
    
        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 75,
          y: 75,
          width: 25,
          height: 25,
        });
      });
  
      test("First object is at right of the second one, partial interlap", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 75,
          y: 75,
          width: 100,
          height: 100,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        };
    
        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 75,
          y: 75,
          width: 25,
          height: 25,
        });
      });
  
      test("First object is within the second one, full interlap", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 10,
          y: 10,
          width: 10,
          height: 10,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        };

        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 10,
          y: 10,
          width: 10,
          height: 10,
        });
      });
  
      test("Second object is within the second one, full interlap", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 10,
          y: 10,
          width: 10,
          height: 10,
        };
    
        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 10,
          y: 10,
          width: 10,
          height: 10,
        });
      });
    });

    describe("Objects don't intersect", () => {
      test("First object is on the left, width is negative", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 20,
          y: 0,
          width: 10,
          height: 10,
        };
    
        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 20,
          y: 0,
          width: -10,
          height: 10,
        });
      });

      test("First object is on the right, width is negative", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 20,
          y: 0,
          width: 10,
          height: 10,
        };
    
        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 20,
          y: 0,
          width: -10,
          height: 10,
        });
      });

      test("First object is on top, height is negative", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 0,
          y: 20,
          width: 10,
          height: 10,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        };
    
        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 0,
          y: 20,
          width: 10,
          height: -10,
        });
      });

      test("First object is at the bottom, height is negative", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 0,
          y: 20,
          width: 10,
          height: 10,
        };
    
        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 0,
          y: 20,
          width: 10,
          height: -10,
        });
      });

      test("Object is at the top-left, both width and height are negative", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 20,
          y: 20,
          width: 10,
          height: 10,
        };
    
        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 20,
          y: 20,
          width: -10,
          height: -10,
        });
      });

      test("Object is at the bottom-right, both width and height are negative", () => {
        const obj1 = {
          ...BaseGameObject,
          x: 20,
          y: 20,
          width: 10,
          height: 10,
        };
        
        const obj2 = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        };
    
        expect(getObjectsIntersectionRect(obj1, obj2)).toEqual({
          x: 20,
          y: 20,
          width: -10,
          height: -10,
        });
      });
    });
  });

  describe("Objects Intersection Type", () => {
    test("Objects don't intersect", () => {
      const randomObject1 = {
        ...BaseGameObject,
        x: 10,
        y: 10,
        width: 10,
        height: 10,
      };
      
      const randomObject2 = {
        ...BaseGameObject,
        x: 100,
        y: 100,
        width: 10,
        height: 10,
      };

      const intersectionType = getObjectsIntersectionType(randomObject1, randomObject2);
  
      expect(intersectionType).toEqual(ObjectsIntersectionType.NULL);
    });

    describe("Tests of one object on top of the other", () => {
      test("One object is staying on the other one", () => {
        const standingObject = {
          ...BaseGameObject,
          x: 10,
          y: 10,
          width: 10,
          height: 10,
        };
        
        const baseObject = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 100,
          height: 10,
        };

        const intersectionType = getObjectsIntersectionType(standingObject, baseObject);

        expect(intersectionType).toEqual(ObjectsIntersectionType.ON_TOP);
      });

      test("If objects edges has the same Y coordinate but they diverge on X, collision is not registered", () => {
        const standingObject = {
          ...BaseGameObject,
          x: 300,
          y: 10,
          width: 10,
          height: 10,
        };
        
        const baseObject = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        };

        const intersectionType = getObjectsIntersectionType(standingObject, baseObject);
  
        expect(intersectionType).toEqual(ObjectsIntersectionType.NULL);
      });
    });

    describe("Collision tests", () => {
      test("Objects sharing a border collide", () => {
        const carelessObject = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        };
        
        const cluelessObject = {
          ...BaseGameObject,
          x: 10,
          y: 0,
          width: 10,
          height: 10,
        };

        const intersectionType = getObjectsIntersectionType(cluelessObject, carelessObject);
    
        expect(intersectionType).toEqual(ObjectsIntersectionType.COLLIDE);
      });
      
      test("Objects that partially intersect collide", () => {
        const cluelessObject = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        };
        
        const carelessObject = {
          ...BaseGameObject,
          x: 5,
          y: 0,
          width: 10,
          height: 10,
        };

        const intersectionType = getObjectsIntersectionType(cluelessObject, carelessObject);
    
        expect(intersectionType).toEqual(ObjectsIntersectionType.COLLIDE);
      });
    });

    describe("One object is within the other", () => {
      test("One object is within the other", () => {
        const penetratedObject = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        };
        
        const insertedObject = {
          ...BaseGameObject,
          x: 10,
          y: 10,
          width: 10,
          height: 10,
        };


        const intersectionType = getObjectsIntersectionType(penetratedObject, insertedObject);
    
        expect(intersectionType).toEqual(ObjectsIntersectionType.CONTAINS);
      });

      test("One object contains the other", () => {
        const penetratedObject = {
          ...BaseGameObject,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        };
        
        const insertedObject = {
          ...BaseGameObject,
          x: 10,
          y: 10,
          width: 10,
          height: 10,
        };

        const intersectionType = getObjectsIntersectionType(insertedObject, penetratedObject);
    
        expect(intersectionType).toEqual(ObjectsIntersectionType.WITHIN);
      });
    });
  });
});

describe("Movement tests", () => {
  describe("Gravity tests", () => {
    test("Object moves down with its vertical speed when it's not staying on the ground", () => {
      const initialObject = {
        ...BaseGameObject,
        x: 0,
        y: 10,
        width: 10,
        height: 10,
        ySpeed: 5,
      };
      
      expect(updateObject(initialObject).y).toEqual(5);
    });

    test("Object doesn't move down if it stays on the ground (y = 0)", () => {
      const initialObject = {
        ...BaseGameObject,
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        ySpeed: 5,
      };

      expect(updateObject(initialObject).y).toEqual(0);
    });

    test("It is impossible for the object to fall below ground: negative Y coord is turned to 0", () => {
      const initialObject = {
        ...BaseGameObject,
        x: 0,
        y: -5,
        width: 10,
        height: 10,
        ySpeed: 5,
      };

      expect(updateObject(initialObject).y).toEqual(0);
    });
  });
});

