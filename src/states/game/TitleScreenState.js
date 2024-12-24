import State from "../../../lib/State.js";

import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	timer,
	sounds,
	stateMachine,
	input,
} from './../../globals.js';
import SoundName from "../../enums/SoundName.js";
import ImageName from "./../../enums/ImageName.js"
import Input from "../../../lib/Input.js";
import GameStateName from "../../enums/GameStateName.js";
import { loadHighScore } from "../../services/Saving.js";

export default class TitleScreenState extends State {
	constructor() {
		super();
		this.highScore = 0;
	}

	enter() {
		sounds.play(SoundName.TitleMusic);
		this.highScore = loadHighScore();
	}

	exit() {
		sounds.stop(SoundName.TitleMusic);
	}

	update(dt) {
		timer.update(dt);

		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateMachine.change(GameStateName.Transition, {
				fromState: this,
				toState: stateMachine.states[GameStateName.Play],
			});
		}
	}
	
	render() {
		images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	
		const text = 'Save the Chicken';
		const centerX = CANVAS_WIDTH / 2;
		const centerY = CANVAS_HEIGHT / 2.5 + 30;
		const radius = 50; // Radius of the arc
		const angleStep = Math.PI / text.length;
		const startAngle = -Math.PI / 2 - (angleStep * text.length) / 2;
	
		context.font = '20px Save the Chicken';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
	
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			const angle = startAngle + i * angleStep;
	
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);
	
			context.save();
			context.translate(x, y);
			context.rotate(angle + Math.PI / 2);
			context.fillText(char, 0, 0);
			
			context.restore();
		}
	
		context.font = '10px Save the Chicken';
		context.fillText(
			'press enter to begin',
			CANVAS_WIDTH / 2,
			CANVAS_HEIGHT - 30
		);

		// Render high score in the top-right corner
		const highScoreText = `High Score: ${this.highScore}`;
		context.font = '14px Arial';
		context.textAlign = 'right'; // Align text to the right
		context.fillText(
			highScoreText,
			CANVAS_WIDTH - 20, // 10px padding from the right edge
			10 // 20px from the top
		);
	}
}
