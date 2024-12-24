import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import SoundName from "../../enums/SoundName.js";
import { sounds } from "../../globals.js";

export default class PlayerSwordSwingingState extends State {
	/**
	 * In this state, the player swings their sword out in
	 * front of them. This creates a temporary hitbox that
	 * enemies can potentially collide into.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;

		this.animation = {
			[Direction.Up]: new Animation([48, 49, 50, 51], 0.1, 1),
			[Direction.Down]: new Animation([36, 37, 38, 39], 0.1, 1),
			[Direction.Left]: new Animation([42, 43, 44, 45], 0.1, 1),
			[Direction.Right]: new Animation([42, 43, 44, 45], 0.1, 1),
		};
	}

	enter() {
		sounds.play(SoundName.Sword);
		this.player.positionOffset = { x: 0, y: 0 };
		this.player.sprites = this.player.mainSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	exit() {
		this.player.positionOffset = { x: 0, y: 0 };
		this.player.swordHitbox.set(0, 0, 0, 0);
	}

	update() {
		// Idle once one sword swing animation cycle has been played.
		if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();
			this.player.changeState(PlayerStateName.Idle);
		}

		/**
		 * Only set the sword's hitbox halfway through the animation.
		 * Otherwise, it will look like the enemy died as soon as the
		 * animation started which visually doesn't really make sense.
		 */
		if (this.player.currentAnimation.isHalfwayDone()) {
			this.setSwordHitbox();
		}
	}

	/**
	 * Creates a hitbox based the player's position and direction.
	 */
	setSwordHitbox() {
		let hitboxX, hitboxY, hitboxWidth, hitboxHeight;

		// The magic numbers here are to adjust the hitbox offsets to make it line up with the sword animation.
		if (this.player.direction === Direction.Left) {
			hitboxWidth = this.player.dimensions.x / 2;
			hitboxHeight = this.player.dimensions.x;
			hitboxX = this.player.position.x - hitboxWidth + 7;
			hitboxY = this.player.position.y + this.player.dimensions.y / 2;
		}
		else if (this.player.direction === Direction.Right) {
			hitboxWidth = this.player.dimensions.x / 2;
			hitboxHeight = this.player.dimensions.x;
			hitboxX = this.player.position.x + this.player.dimensions.x + 7;
			hitboxY = this.player.position.y + this.player.dimensions.y / 2;
		}
		else if (this.player.direction === Direction.Up) {
			hitboxWidth = this.player.dimensions.x;
			hitboxHeight = this.player.dimensions.x / 2;
			hitboxX = this.player.position.x + 7;
			hitboxY = this.player.position.y;
		}
		else {
			hitboxWidth = this.player.dimensions.x;
			hitboxHeight = this.player.dimensions.x / 2;
			hitboxX = this.player.position.x + 7;
			hitboxY = this.player.position.y + this.player.dimensions.y + 4;
		}

		this.player.swordHitbox.set(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
	}
}
