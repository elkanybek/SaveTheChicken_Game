/**
 * Game Name : Save the Chicken.
 *
 * Authors: Joseph Lehman and Elsana Kanybek.
 *
 * Brief description: Read READ.ME.
 *
 * Asset sources: Starter code from Vikram Singh. Game Programming Professor at John Abbott College.
 */

import GameStateName from './enums/GameStateName.js';
import Game from '../lib/Game.js';
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
} from './globals.js';
import PlayState from './states/game/PlayState.js';
import GameOverState from './states/game/GameOverState.js';
import VictoryState from './states/game/VictoryState.js';
import TitleScreenState from './states/game/TitleScreenState.js';
import TransitionState from './states/game/TransitionState.js';

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
} = await fetch('./config/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

const level1mapDefinition = await fetch('./config/level-1-map.json').then((response) =>
	response.json()
);

const level2mapDefinition = await fetch('./config/level-2-map.json').then((response) =>
	response.json()
);

const level3mapDefinition = await fetch('./config/level-3-map.json').then((response) =>
	response.json()
);

const levelMaps = [level1mapDefinition, level2mapDefinition, level3mapDefinition]

// Add all the states to the state machine.
stateMachine.add(GameStateName.Transition, new TransitionState());
stateMachine.add(GameStateName.GameOver, new GameOverState());
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.Play, new PlayState(levelMaps));
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());


stateMachine.change(GameStateName.TitleScreen);

const game = new Game(
	stateMachine,
	context,
	timer,
	canvas.width,
	canvas.height
);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
