import { Direction } from "./objects";

const WIZARD_PARAMETERS = Object.seal({
  width: 61,
  height: 84,
  ySpeed: 10,
  xSpeed: 2,
  type: GameObjectType.WIZARD,
});

const getWizardSprite = (direction = Direction.RIGHT) => Boolean(direction & Direction.RIGHT)
  ? 'img/wizard.gif'
  : 'img/wizard-reversed.gif';

export {
  getWizardSprite,
  WIZARD_PARAMETERS,
};
