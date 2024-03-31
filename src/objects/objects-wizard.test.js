import { BaseGameObject, Direction } from "./objects";
import { 
  createWizard,
  getWizardSprite,
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
