import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import GameStateName from '../../enums/GameStateName.js';
import ImageName from '../../enums/ImageName.js';
import SoundName from '../../enums/SoundName.js';
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	input,
	sounds,
	stateMachine,
} from '../../globals.js';


export default class GameOverState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	constructor() {
		super();
	}

	enter() {
		sounds.stop(SoundName.Music);

	}

	update() {
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateMachine.change(GameStateName.Transition, {
				fromState: this,
				toState: stateMachine.states[GameStateName.TitleScreen],
			});
		}
	}

	render() {
		images.render(ImageName.GameOver, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.font = '60px Game Over';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
		context.font = '30px press enter to continue';
		context.fillStyle = 'white';
		context.fillText(
			'press enter to continue',
			CANVAS_WIDTH / 2,
			CANVAS_HEIGHT - 40

		);
	}
}

