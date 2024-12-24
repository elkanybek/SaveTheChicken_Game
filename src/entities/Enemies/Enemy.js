import { getRandomPositiveInteger } from '../../../lib/Random.js';
import StateMachine from '../../../lib/StateMachine.js';
import EnemyStateName from '../../enums/EnemyStateName.js';
import Room from '../../objects/Room.js';
import Tile from '../../objects/Tile.js';
import GameEntity from '../GameEntity.js';

export default class Enemy extends GameEntity {
	static WIDTH = 16;
	static HEIGHT = 16;

	/**
	 * The enemy characters in the game that randomly
	 * walk around the room and can damage the player.
	 */
	constructor(sprites, room, type) {
		super();

		this.sprites = sprites;
		this.position.x = getRandomPositiveInteger(
			Room.LEFT_EDGE,
			Room.RIGHT_EDGE - Tile.TILE_SIZE
		);
		this.position.y = getRandomPositiveInteger(
			Room.TOP_EDGE,
			Room.BOTTOM_EDGE - Tile.TILE_SIZE
		);
		this.dimensions.x = Enemy.WIDTH;
		this.dimensions.y = Enemy.HEIGHT;
		this.room = room;
        this.type = type;

		this.damageCooldown = false;
	}

	receiveDamage(damage) {
		
	}

	initializeStateMachine(animations) {
		const stateMachine = new StateMachine();

		stateMachine.add(
			EnemyStateName.Idle,
			new EnemyIdlingState(this, animations[EnemyStateName.Idle])
		);
		stateMachine.add(
			EnemyStateName.Walking,
			new EnemyWalkingState(this, animations[EnemyStateName.Walking])
		);

		stateMachine.change(EnemyStateName.Walking);

		return stateMachine;
	}
}
