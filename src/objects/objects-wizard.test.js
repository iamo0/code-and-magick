import { BaseGameObject, Direction } from "./objects";
import { 
  getWizardSprite,
  WIZARD_PARAMETERS,
} from "./objects-wizard";

describe("Wizard sprite detection", () => {
  test("Default sprite for wizard object is one that moves right", () => {
    const myWizard = {
      ...BaseGameObject,
      ...WIZARD_PARAMETERS,
    };

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
});
