// NB! Circular dependency here bothers me. Should I do something with it?
import { GameControls } from "../index";
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

const WizardMovement = {
  SPEED_LEFT: -5,
  SPEED_RIGHT: 5,
  SPEED_UP: 2,
  SPEED_DOWN: -10,
};


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


const updateWizard = (wizard, controls, touchingObjects = null) => {
  const delta = {
    x: 0,
    y: 0,
    direction: wizard.direction,
  };

  if (Boolean(controls & GameControls.RIGHT)) {
    delta.x = WizardMovement.SPEED_RIGHT;
    delta.direction = Direction.RIGHT;
  }

  if (Boolean(controls & GameControls.LEFT)) {
    delta.x = WizardMovement.SPEED_LEFT;
    delta.direction = Direction.LEFT;
  }

  // NB! Due to gravity, wizard constantly moving either up or down
  // if he's not on the ground or any other obstacle
  delta.y = Boolean(controls & GameControls.UP)
    ? WizardMovement.SPEED_UP
    // NB! Math.max and comparison with negative y here 
    // assumes that wizard's SPEED_DOWN is always is set below zero
    : delta.y = Math.max(-1 * wizard.y, WizardMovement.SPEED_DOWN);

  wizard.x += delta.x;
  wizard.y += delta.y;
  wizard.direction = delta.direction;
  wizard.sprite = getWizardSprite(wizard.direction);

  return wizard;
};


export {
  createWizard,
  getWizardSprite,
  updateWizard,
  WizardMovement,
  WIZARD_PARAMETERS,
  WizardSprite,
};
