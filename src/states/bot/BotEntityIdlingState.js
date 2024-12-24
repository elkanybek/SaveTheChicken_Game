import { getRandomPositiveInteger } from '../../../lib/Random.js';
import State from '../../../lib/State.js';
import BotEntityStateName from '../../enums/BotEntityStateName.js';
import { timer } from '../../globals.js';

export default class BotEntityIdlingState extends State {
	static MOVE_DURATION_MIN = 2;
	static MOVE_DURATION_MAX = 6;

	/**
	 * In this state, the enemy does not move and
	 * starts moving after a random period of time.
	 *
	 * @param {Animation} animation
	 */
	constructor(entity, animation) {
		super();

		this.entity = entity;
		this.animation = animation;
	}

	enter() {
		this.entity.currentAnimation = this.animation[this.entity.direction];
		this.idleDuration = getRandomPositiveInteger(
			BotEntityIdlingState.MOVE_DURATION_MIN,
			BotEntityIdlingState.MOVE_DURATION_MAX
		);

		this.startTimer();
	}

	update(dt) {}

	async startTimer() {
		await timer.wait(this.idleDuration);

		if(this.entity.isHeld != true){
			this.entity.changeState(BotEntityStateName.Walking, {});
		}
	}
}
