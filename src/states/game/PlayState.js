import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import GameStateName from '../../enums/GameStateName.js';
import SoundName from '../../enums/SoundName.js';
import {sounds, stateMachine, timer, score, setScore, context } from '../../globals.js';
import Dungeon from '../../objects/Dungeon.js';

export default class PlayState extends State {
	constructor(mapDefinitions) {
		super();

		this.mapDefinitions = mapDefinitions
		this.player = new Player();
		this.dungeon = new Dungeon(this.player, mapDefinitions);
		//this.userInterface = new UserInterface(this.player);
	}

	enter(mapDefinition) {
		this.player.reset();
		this.dungeon = new Dungeon(this.player, this.mapDefinitions);
		sounds.play(SoundName.Music);
		setScore(0)
		timer.addTask(() => {
			setScore(score + 1)
		}, 1)
	}

	update(dt) {
		// debug.update();
		this.dungeon.update(dt);
		timer.update(dt);

		if (this.player.isDead || this.dungeon.currentRoom.chicken.isDead) {
			stateMachine.change(GameStateName.Transition, {
				fromState: this,
				toState: stateMachine.states[GameStateName.GameOver],
			});
		}
	}

	render() {
		this.dungeon.render();
		context.font = '10px Arial';
		context.fillStyle = 'white';
		context.fillText(`Time: ${score}`, 43, 10);
	}
}
