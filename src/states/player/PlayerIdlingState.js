import Animation from '../../../lib/Animation.js';
import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import Direction from '../../enums/Direction.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { input } from '../../globals.js';
import Input from '../../../lib/Input.js';

export default class PlayerIdlingState extends State {
	/**
	 * In this state, the player is stationary unless
	 * a directional key or the spacebar is pressed.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = {
			[Direction.Up]: new Animation([12], 1),
			[Direction.Down]: new Animation([0], 1),
			[Direction.Left]: new Animation([6], 1),
			[Direction.Right]: new Animation([6], 1),
		};
	}

	enter() {
		this.player.sprites = this.player.mainSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update() {
		this.checkForMovement();
		this.checkForSwordSwing();
		this.checkForLift();
	}

	checkForMovement() {
		if (input.isKeyPressed(Input.KEYS.S)) {
			this.player.direction = Direction.Down;
			this.player.changeState(PlayerStateName.Walking);
		} else if (input.isKeyPressed(Input.KEYS.D)) {
			this.player.direction = Direction.Right;
			this.player.changeState(PlayerStateName.Walking);
		} else if (input.isKeyPressed(Input.KEYS.W)) {
			this.player.direction = Direction.Up;
			this.player.changeState(PlayerStateName.Walking);
		} else if (input.isKeyPressed(Input.KEYS.A)) {
			this.player.direction = Direction.Left;
			this.player.changeState(PlayerStateName.Walking);
		}
	}

	checkForSwordSwing() {
		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			this.player.changeState(PlayerStateName.SwordSwinging);
		}
	}

	checkForLift(){
		if(this.player.didCollideWithEntity(this.player.chicken.hitbox) && input.isKeyPressed(Input.KEYS.ENTER)){
			this.player.changeState(PlayerStateName.CarryingIdling);
			this.player.chicken.initializeLift(this.player);
		}
	}
}
