import { GameControls } from "../index";
import { BaseGameObject, Direction } from "./objects";
import { 
  createWizard,
  getWizardSprite,
  updateWizard,
  WizardMovement,
  WIZARD_PARAMETERS,
  WizardSprite,
} from "./objects-wizard";

describe("Wizard constructor function", () => {
  test("Default wizard parameters should be composed from default object parameters, basic parameters of wizard and sprite", () => {
    const myWizard = createWizard();

    expect(myWizard).toEqual({
      ...BaseGameObject,
      ...WIZARD_PARAMETERS,
      sprite: WizardSprite.REGULAR,
    });
  });

  test("Extended parameters are applied correctly", () => {
    const myWizard = createWizard({
      additionalProp: "Additional value",
    });

    expect(myWizard.additionalProp).toEqual("Additional value");
  });

  test("If default direction is overridden with Direction.LEFT correct sprite is used", () => {
    const myWizard = createWizard({
      direction: Direction.LEFT,
    });

    expect(myWizard).toEqual({
      ...BaseGameObject,
      ...WIZARD_PARAMETERS,
      direction: Direction.LEFT,
      sprite: WizardSprite.REVERSED,
    });
  });
});

describe("Wizard sprite detection", () => {
  test("If wizard explicitly moving right it's using correct sprite", () => {
    const sprite = getWizardSprite(Direction.RIGHT);
    expect(sprite).toEqual(WizardSprite.REGULAR);
  });

  test("If wizard is moving left it's using correct sprite", () => {
    const sprite = getWizardSprite(Direction.LEFT);
    expect(sprite).toEqual(WizardSprite.REVERSED);
  });
});

describe("Wizard update function", () => {
  describe("Null test", () => {
    test("Nothing happens to wizard if there'no game controls pressed and it stays on the ground", () => {
      const initialX = 0;
      const initialY = 0;
      const initialDirection = Direction.RIGHT;

      const wizard = createWizard({
        x: initialX,
        y: initialY,
        direction: initialDirection,
      });

      const initialSprite = wizard.sprite;

      updateWizard(wizard, GameControls.NULL, null);

      expect(wizard.x).toEqual(initialX);
      expect(wizard.y).toEqual(initialY);
      expect(wizard.direction).toEqual(initialDirection);
      expect(wizard.sprite).toEqual(initialSprite);
    });
  });

  describe("Horizontal movement", () => {
    describe("Movement to right", () => {
      test("Wizard moves right if right button is being pressed", () => {
        const initialX = 0;
        const wizard = createWizard({
          x: initialX,
        });
        updateWizard(wizard, GameControls.RIGHT, null);
  
        expect(wizard.x).toEqual(initialX + WizardMovement.SPEED_RIGHT);
      });
  
      test("Wizard direction stays right if right button is being pressed", () => {
        const wizard = createWizard();
        updateWizard(wizard, GameControls.RIGHT, null);
  
        expect(wizard.direction).toEqual(Direction.RIGHT);
      });

      test("Wizard direction is updated from left to right if right button is being pressed", () => {
        const wizard = createWizard({
          direction: Direction.LEFT,
        });
        updateWizard(wizard, GameControls.RIGHT, null);
  
        expect(wizard.direction).toEqual(Direction.RIGHT);
      });

      test("When direction is updated to right, sprite is updated as well", () => {
        const wizard = createWizard();
        updateWizard(wizard, GameControls.RIGHT, null);
  
        expect(wizard.sprite).toEqual(WizardSprite.REGULAR);
      });
    });

    describe("Movement to left", () => {
      test("Wizard moves left if left button is being pressed", () => {
        const initialX = 0;
        const wizard = createWizard({
          x: initialX,
        });
        updateWizard(wizard, GameControls.LEFT, null);
  
        expect(wizard.x).toEqual(initialX + WizardMovement.SPEED_LEFT);
      });
  
      test("Wizard direction stays left if left button is being pressed", () => {
        const wizard = createWizard();
        updateWizard(wizard, GameControls.LEFT, null);
  
        expect(wizard.direction).toEqual(Direction.LEFT);
      });

      test("Wizard direction is updated from right to left if left button is being pressed", () => {
        const wizard = createWizard({
          direction: Direction.RIGHT,
        });
        updateWizard(wizard, GameControls.LEFT, null);
  
        expect(wizard.direction).toEqual(Direction.LEFT);
      });

      test("When direction is updated to left, sprite is updated as well", () => {
        const wizard = createWizard();
        updateWizard(wizard, GameControls.LEFT, null);
  
        expect(wizard.sprite).toEqual(WizardSprite.REVERSED);
      });
    });
  });

  describe("Vertical movement", () => {
    describe("Up movement", () => {
      test("Wizard moves up from the ground if up button is being pressed", () => {
        const initialY = 0;
        const wizard = createWizard({
          y: initialY,
        });
  
        updateWizard(wizard, GameControls.UP, null);
  
        expect(wizard.y).toEqual(initialY + WizardMovement.SPEED_UP);
      });

      test("Wizard moves up from the midair if up button is being pressed", () => {
        const initialY = 20;
        const wizard = createWizard({
          y: initialY,
        });
  
        updateWizard(wizard, GameControls.UP, null);
  
        expect(wizard.y).toEqual(initialY + WizardMovement.SPEED_UP);
      });

      test("When wizard moves up only its horizontal direction stays right", () => {
        const wizard = createWizard({
          direction: Direction.RIGHT,
        });
        updateWizard(wizard, GameControls.UP, null);
        expect(wizard.direction).toEqual(Direction.RIGHT);
      });

      test("When wizard moves up only its horizontal direction stays left", () => {
        const wizard = createWizard({
          direction: Direction.LEFT,
        });
        updateWizard(wizard, GameControls.UP, null);
        expect(wizard.direction).toEqual(Direction.LEFT);
      });
    });

    describe("Down movement", () => {
      test("If wizard stays on a ground (Y = 0) its vertical coordinate doesn't change", () => {
        const wizard = createWizard({
          y: 0,
        });

        updateWizard(wizard, GameControls.NULL, null);
        expect(wizard.y).toEqual(0);
      });

      test("If wizard is somewhere up in the air its vertical coordinate is decreased by its vertical down speed", () => {
        const initialY = 15;
        const wizard = createWizard({
          y: initialY,
        });

        updateWizard(wizard, GameControls.NULL, null);
        expect(wizard.y).toEqual(initialY + WizardMovement.SPEED_DOWN);
      });

      test("Wizard never falls below the ground", () => {
        const wizard = createWizard({
          y: -1 * WizardMovement.SPEED_DOWN / 2,
        });

        updateWizard(wizard, GameControls.NULL, null);
        expect(wizard.y).toEqual(0);
      });
    });
  });

  describe("Compound movement", () => {
    describe("Up-Right", () => {
      test("Wizard simultaneously moves up and right if both controls are pressed", () => {
        const initialX = 0;
        const initialY = 0;

        const wizard = createWizard({
          x: initialX,
          y: initialY,
        });

        updateWizard(wizard, GameControls.RIGHT | GameControls.UP, null);

        expect(wizard.x).toEqual(initialX + WizardMovement.SPEED_RIGHT);
        expect(wizard.y).toEqual(initialY + WizardMovement.SPEED_UP);
      });

      test("If wizard moves simultaneously up and right its direction is right and correct sprite is used", () => {
        const wizard = createWizard({
          direction: Direction.RIGHT,
        });
        updateWizard(wizard, GameControls.RIGHT | GameControls.UP, null);

        expect(wizard.direction).toEqual(Direction.RIGHT);
        expect(wizard.sprite).toEqual(WizardSprite.REGULAR);
      });
    });

    describe("Up-Left", () => {
      test("Wizard simultaneously moves up and left if both controls are pressed", () => {
        const initialX = 100;
        const initialY = 0;

        const wizard = createWizard({
          x: initialX,
          y: initialY,
        });

        updateWizard(wizard, GameControls.LEFT | GameControls.UP, null);

        expect(wizard.x).toEqual(initialX + WizardMovement.SPEED_LEFT);
        expect(wizard.y).toEqual(initialY + WizardMovement.SPEED_UP);
      });

      test("If wizard moves simultaneously up and left its direction is left and correct sprite is used", () => {
        const wizard = createWizard({
          direction: Direction.LEFT,
        });
        updateWizard(wizard, GameControls.LEFT | GameControls.UP, null);

        expect(wizard.direction).toEqual(Direction.LEFT);
        expect(wizard.sprite).toEqual(WizardSprite.REVERSED);
      });
    });

    describe("Down-Right", () => {
      test("Wizard simultaneously moves bottom and right if right button is pressed and wizard is above the ground", () => {
        const initialX = 0;
        const initialY = 20;

        const wizard = createWizard({
          x: initialX,
          y: initialY,
        });

        updateWizard(wizard, GameControls.RIGHT, null);

        expect(wizard.x).toEqual(initialX + WizardMovement.SPEED_RIGHT);
        expect(wizard.y).toEqual(initialY + WizardMovement.SPEED_DOWN);
      });

      test("If wizard moves simultaneously down and right its direction is right and correct sprite is used", () => {
        const initialX = 0;
        const initialY = 20;

        const wizard = createWizard({
          x: initialX,
          y: initialY,
          direction: Direction.RIGHT,
        });
        updateWizard(wizard, GameControls.RIGHT, null);

        expect(wizard.direction).toEqual(Direction.RIGHT);
        expect(wizard.sprite).toEqual(WizardSprite.REGULAR);
      });
    });

    describe("Down-Left", () => {
      test("Wizard simultaneously moves bottom and left if left button is pressed and wizard is above the ground", () => {
        const initialX = 20;
        const initialY = 20;

        const wizard = createWizard({
          x: initialX,
          y: initialY,
        });

        updateWizard(wizard, GameControls.LEFT, null);

        expect(wizard.x).toEqual(initialX + WizardMovement.SPEED_LEFT);
        expect(wizard.y).toEqual(initialY + WizardMovement.SPEED_DOWN);
      });

      test("If wizard moves simultaneously down and left its direction is left and correct sprite is used", () => {
        const initialX = 20;
        const initialY = 20;

        const wizard = createWizard({
          x: initialX,
          y: initialY,
          direction: Direction.RIGHT,
        });
        updateWizard(wizard, GameControls.LEFT, null);

        expect(wizard.direction).toEqual(Direction.LEFT);
        expect(wizard.sprite).toEqual(WizardSprite.REVERSED);
      });
    });
  });
});
