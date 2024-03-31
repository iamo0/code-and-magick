import { BaseGameObject, Direction } from "./objects";
import { 
  createWizard,
  getWizardSprite,
  WIZARD_PARAMETERS,
} from "./objects-wizard";

describe("Wizard constructor function", () => {
  test("Default wizard parameters should be composed from default object parameters, basic parameters of wizard and sprite", () => {
    const myWizard = createWizard();

    expect(myWizard).toEqual({
      ...BaseGameObject,
      ...WIZARD_PARAMETERS,
      sprite: 'img/wizard.gif',
    });
  });

  test("Extended parameters are applied correctly", () => {
    const myWizard = createWizard({
      additionalProp: "Additional value",
    });

    expect(myWizard.additionalProp).toEqual("Additional value");
  });
});

describe("Wizard sprite detection", () => {
  test("Default sprite for wizard object is one that moves right", () => {
    const myWizard = createWizard();

    const sprite = getWizardSprite(myWizard);
    expect(sprite).toEqual('img/wizard.gif');
  });

  test("If wizard explicitly moving right it's using correct sprite", () => {
    const myWizard = {
      ...BaseGameObject,
      ...WIZARD_PARAMETERS,
      direction: Direction.RIGHT,
    };

    const sprite = getWizardSprite(myWizard);
    expect(sprite).toEqual('img/wizard.gif');
  });

  test("If wizard is moving left it's using correct sprite", () => {
    const myWizard = {
      ...BaseGameObject,
      ...WIZARD_PARAMETERS,
      direction: Direction.LEFT,
    };

    const sprite = getWizardSprite(myWizard);
    expect(sprite).toEqual('img/wizard-reversed.gif');
  });

  test("If wizard is created with left direction as a default, it's created with correct sprite", () => {
    const myWizard = createWizard({
      direction: Direction.LEFT,
    });

    const sprite = getWizardSprite(myWizard);
    expect(sprite).toEqual('img/wizard-reversed.gif');
  });
});
