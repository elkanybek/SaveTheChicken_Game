import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";

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
			[Direction.Up]: new Animation([8, 7, 6], 0.1, 1),
			[Direction.Down]: new Animation([2, 1, 0], 0.1, 1),
			[Direction.Left]: new Animation([11, 10, 9], 0.1, 1),
			[Direction.Right]: new Animation([5, 4, 3], 0.1, 1),
		};
	}

	enter() {
		this.player.sprites = this.player.liftingSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	exit() {
	}

	update() {
		// Idle once one sword swing animation cycle has been played.
		if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();
            this.player.canLift = true;
			this.player.changeState(PlayerStateName.Idle);
		}
	}
}
