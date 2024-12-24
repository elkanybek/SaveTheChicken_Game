import Animation from '../../../lib/Animation.js';
import Enemy from '../../entities/Enemies/Enemy.js';
import Direction from '../../enums/Direction.js';
import { timer } from '../../globals.js';
import Room from '../../objects/Room.js';
import BotEntityStateName from '../../enums/BotEntityStateName.js';
import { didSucceedPercentChance, getRandomPositiveInteger, pickRandomElement } from '../../../lib/Random.js';
import State from '../../../lib/State.js';

export default class BotEntityWalkingState extends State {
	static IDLE_CHANCE = 0.5;
	static MOVE_DURATION_MIN = 2;
	static MOVE_DURATION_MAX = 6;

	/**
	 * In this state, the enemy moves around in random
	 * directions for a random period of time.
	 *
	 * @param {Enemy} enemy
	 * @param {Animation} animation
	 */
	constructor(enemy, animation) {
		super();

		this.enemy = enemy;
		this.animation = animation;
	}

	enter() {
		this.enemy.currentAnimation = this.animation[this.enemy.direction];

		this.reset();
		this.startTimer();
	}

	update(dt) {
		this.move(dt);
	}

	async startTimer() {
		await timer.wait(this.moveDuration);

		this.decideMovement();
	}

	/**
	 * 50% chance for the snail to go idle for more dynamic movement.
	 * Otherwise, start the movement timer again.
	 */
	decideMovement() {
		if (didSucceedPercentChance(BotEntityWalkingState.IDLE_CHANCE)) {
			this.enemy.changeState(BotEntityStateName.Idle, {});
		} else {
			this.reset();
			this.startTimer();
		}
	}

	/**
	 * 25% chance for the enemy to move in any direction.
	 * Reset the movement timer to a random duration.
	 */
	reset() {
		this.enemy.direction = pickRandomElement([
			Direction.Up,
			Direction.Down,
			Direction.Left,
			Direction.Right,
		]);
		this.enemy.currentAnimation = this.animation[this.enemy.direction];
		this.moveDuration = getRandomPositiveInteger(
			BotEntityWalkingState.MOVE_DURATION_MIN,
			BotEntityWalkingState.MOVE_DURATION_MAX
		);
	}

	move(dt) {
		if (this.enemy.direction === Direction.Down) {
			this.enemy.position.y += this.enemy.speed * dt;

			if (
				this.enemy.position.y + this.enemy.dimensions.y >
				Room.BOTTOM_EDGE
			) {
				this.enemy.position.y =
					Room.BOTTOM_EDGE - this.enemy.dimensions.y;
				this.reset();
			}
		} else if (this.enemy.direction === Direction.Right) {
			this.enemy.position.x += this.enemy.speed * dt;

			if (
				this.enemy.position.x + this.enemy.dimensions.x >
				Room.RIGHT_EDGE
			) {
				this.enemy.position.x =
					Room.RIGHT_EDGE - this.enemy.dimensions.x;
				this.reset();
			}
		} else if (this.enemy.direction === Direction.Up) {
			this.enemy.position.y -= this.enemy.speed * dt;

			if (
				this.enemy.position.y <
				Room.TOP_EDGE - this.enemy.dimensions.y / 2
			) {
				this.enemy.position.y =
					Room.TOP_EDGE - this.enemy.dimensions.y / 2;
				this.reset();
			}
		} else if (this.enemy.direction === Direction.Left) {
			this.enemy.position.x -= this.enemy.speed * dt;

			if (this.enemy.position.x < Room.LEFT_EDGE) {
				this.enemy.position.x = Room.LEFT_EDGE;
				this.reset();
			}
		}
	}
}
