import Animation from '../../../lib/Animation.js';
import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import Direction from '../../enums/Direction.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { input } from '../../globals.js';
import Room from '../../objects/Room.js';

export default class PlayerWalkingState extends State {
	/**
	 * In this state, the player can move around using the
	 * directional keys. From here, the player can go idle
	 * if no keys are being pressed. The player can also swing
	 * their sword if they press the spacebar.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = {
			[Direction.Up]: new Animation([30, 31, 32, 33, 34, 35], 0.2),
			[Direction.Down]: new Animation([18, 19, 20, 21, 22, 23], 0.2),
			[Direction.Left]: new Animation([24, 25, 26, 27, 28, 29], 0.2),
			[Direction.Right]: new Animation([24, 25, 26, 27, 28, 29], 0.2),
		};
	}

	enter() {
		this.player.sprites = this.player.mainSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update(dt) {
		this.player.canLift = false;
		this.handleMovement(dt);
		this.handleSwordSwing();
		this.handleLift();
	}

	handleMovement(dt) {
		this.player.currentAnimation = this.animation[this.player.direction];

		if (input.isKeyPressed(Input.KEYS.S)) {
			this.player.direction = Direction.Down;
			this.player.position.y += this.player.speed * dt;

			if (
				this.player.position.y + this.player.dimensions.y >=
				Room.BOTTOM_EDGE
			) {
				this.player.position.y =
					Room.BOTTOM_EDGE - this.player.dimensions.y;
			}
		} else if (input.isKeyPressed(Input.KEYS.D)) {
			this.player.direction = Direction.Right;
			this.player.position.x += this.player.speed * dt;

			if (
				this.player.position.x + this.player.dimensions.x >=
				Room.RIGHT_EDGE
			) {
				this.player.position.x =
					Room.RIGHT_EDGE - this.player.dimensions.x;
			}
		} else if (input.isKeyPressed(Input.KEYS.W)) {
			this.player.direction = Direction.Up;
			this.player.position.y -= this.player.speed * dt;

			if (
				this.player.position.y <=
				Room.TOP_EDGE - this.player.dimensions.y
			) {
				this.player.position.y =
					Room.TOP_EDGE - this.player.dimensions.y;
			}
		} else if (input.isKeyPressed(Input.KEYS.A)) {
			this.player.direction = Direction.Left;
			this.player.position.x -= this.player.speed * dt;

			if (this.player.position.x <= Room.LEFT_EDGE) {
				this.player.position.x = Room.LEFT_EDGE;
			}
		} else {
			this.player.changeState(PlayerStateName.Idle);
		}
	}

	handleSwordSwing() {
		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			this.player.changeState(PlayerStateName.SwordSwinging);
		}
	}

	handleLift(){
		if(this.player.canLift && input.isKeyPressed(Input.KEYS.ENTER)){
			this.player.changeState(PlayerStateName.Lifting);
		}
	}

	checkForLift(){
		if(this.player.didCollideWithEntity(this.player.chicken.hitbox) && input.isKeyPressed(Input.KEYS.ENTER)){
			this.player.changeState(PlayerStateName.CarryingIdling);
			this.player.chicken.initializeLift(this.player);
		}
	}
}
