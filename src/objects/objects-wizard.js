import { 
  BaseGameObject,
  GameObjectType,
  Direction,
} from "./objects";

const WizardSprite = {
  REGULAR: 'img/wizard.gif',
  REVERSED: 'img/wizard-reversed.gif',
};

const WIZARD_PARAMETERS = Object.seal({
  width: 61,
  height: 84,
  type: GameObjectType.WIZARD,
});


const getWizardSprite = (direction) => Boolean(direction & Direction.LEFT)
  ? WizardSprite.REVERSED
  : WizardSprite.REGULAR;


const createWizard = (extendedParameters) => {
  const nakedWizard = {
    ...BaseGameObject,
    ...WIZARD_PARAMETERS,
    ...extendedParameters,
  };

  nakedWizard.sprite = getWizardSprite(nakedWizard.direction);

  return nakedWizard;
};


export {
  createWizard,
  getWizardSprite,
  WIZARD_PARAMETERS,
  WizardSprite,
};
