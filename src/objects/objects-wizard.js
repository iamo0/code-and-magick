import { 
  GameObjectType,
  Direction,
} from "./objects";

const WIZARD_PARAMETERS = Object.seal({
  width: 61,
  height: 84,
  ySpeed: 10,
  xSpeed: 2,
  type: GameObjectType.WIZARD,
});

const WizardSprite = {
  REGULAR: 'img/wizard.gif',
  REVERSED: 'img/wizard-reversed.gif',
};

const getWizardSprite = (wizard) => Boolean(wizard.direction & Direction.LEFT)
  ? WizardSprite.REVERSED
  : WizardSprite.REGULAR;

export {
  getWizardSprite,
  WIZARD_PARAMETERS,
  WizardSprite,
};
