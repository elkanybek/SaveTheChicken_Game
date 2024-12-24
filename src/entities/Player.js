import GameEntity from './GameEntity.js';
import { context, images, sounds, timer, debug, DEBUG, input } from '../globals.js';
import StateMachine from '../../lib/StateMachine.js';
import PlayerWalkingState from './../states/player/PlayerWalkingState.js';
import PlayerSwordSwingingState from './../states/player/PlayerSwordSwingingState.js';
import PlayerIdlingState from '../states/player/PlayerIdlingState.js';
import PlayerLiftingState from '../states/player/PlayerLiftingState.js';
import PlayerCarryingIdlingState from '../states/player/PlayingCarryingIdlingState.js';
import PlayerCarryingState from '../states/player/PlayerCarryingState.js';
import PlayerThrowingState from '../states/player/PlayerThrowingState.js';
import Hitbox from '../../lib/Hitbox.js';
import ImageName from '../enums/ImageName.js';
import Sprite from '../../lib/Sprite.js';
import Room from '../objects/Room.js';
import Direction from '../enums/Direction.js';
import SoundName from '../enums/SoundName.js';
import PlayerStateName from '../enums/PlayerStateName.js';
import Skeleton from './Enemies/Skeleton.js';
import Slime from './Enemies/Slime.js';
import Timer from '../../lib/Timer.js';
import Input from '../../lib/Input.js';
import ProgressBar from '../ui/ProgressBar.js';

export default class Player extends GameEntity {
	static WIDTH = 16;
	static HEIGHT = 22;
	static MAIN_SPRITE_WIDTH = 32;
	static MAIN_SPRITE_HEIGHT = 32;
	static SWORD_SWINGING_SPRITE_WIDTH = 32;
	static SWORD_SWINGING_SPRITE_HEIGHT = 32;
	static LIFTING_SPRITE_WIDTH = 16;
	static LIFTING_SPRITE_HEIGHT = 32;
	static CARRYING_SPRITE_WIDTH = 32;
	static CARRYING_SPRITE_HEIGHT = 32;
	static INVULNERABLE_DURATION = 1.5;
	static INVULNERABLE_FLASH_INTERVAL = 0.1;
	static MAX_SPEED = 100;
	static MAX_HEALTH = 6;

	/**
	 * The hero character the player controls in the map.
	 * Has the ability to swing a sword to kill enemies
	 * and will collide into objects that are collidable.
	 */
	constructor() {
		super({ health: Player.MAX_HEALTH, totalHealth: Player.MAX_HEALTH});

		this.chicken = null
		this.mainSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Player),
			Player.MAIN_SPRITE_WIDTH,
			Player.MAIN_SPRITE_HEIGHT
		);

		this.carryingSprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.PlayerCarry),
			Player.CARRYING_SPRITE_WIDTH,
			Player.CARRYING_SPRITE_HEIGHT
		)

		this.sprites = this.mainSprites;

		/**
		 * Since the regular sprite and sword-swinging sprite are different dimensions,
		 * we need a position offset to make it look like one smooth animation when rendering.
		 */
		this.positionOffset = { x: 0, y: 0 };

		/**
		 * Start the sword's hitbox as nothing for now. Later, in the
		 * PlayerSwordSwingingState, we'll define the actual dimensions.
		 */
		this.swordHitbox = new Hitbox(0, 0, 0, 0, 'blue');

		/**
		 * We don't want the hitbox for the player to be the size of the
		 * whole sprite. Instead, we want a much smaller area relative to
		 * the player's dimensions and position to be used to detect collisions.
		 */
		this.hitboxOffsets = new Hitbox(
			10,
			Player.HEIGHT - 3,
			-6,
			-Player.HEIGHT + 6
		);
		this.position.x = Room.LEFT_EDGE + 15;
		this.position.y = Room.CENTER_Y - Player.HEIGHT / 2;
		this.dimensions.x = Player.WIDTH;
		this.dimensions.y = Player.HEIGHT;
		this.speed = Player.MAX_SPEED;
		this.isInvulnerable = false;
		this.alpha = 1;
		this.invulnerabilityTimer = null;
		this.stateMachine = this.initializeStateMachine();
		this.canLift = false;
		this.throwCooldown = false;
		this.timer = new Timer();
		this.healthBar = new ProgressBar(this.position.x, this.position.y + 27, this.dimensions.x * 2, 5, this.health, this.health);
	}

	render() {
		context.save();

		context.globalAlpha = this.alpha;

		super.render(this.positionOffset);

		context.restore();

		if (DEBUG) {
			this.swordHitbox.render(context);
		}

		this.healthBar.render();
	}

	update(dt){
		super.update(dt);
		this.timer.update(dt);
		this.updateHealthBar();
	}

	reset() {
		this.position.x = Room.LEFT_EDGE + 15;
		this.position.y = Room.CENTER_Y - Player.HEIGHT / 2;
		this.health = Player.MAX_HEALTH;
		this.isDead = false;
		this.isInvulnerable = false;
		this.alpha = 1;
		this.invulnerabilityTimer?.clear();
		this.direction = Direction.Down;
		this.stateMachine.change(PlayerStateName.Idle); 
	}

	initializeStateMachine() {
		const stateMachine = new StateMachine();

		stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		stateMachine.add(
			PlayerStateName.SwordSwinging,
			new PlayerSwordSwingingState(this)
		);
		stateMachine.add(PlayerStateName.Lifting, new PlayerLiftingState(this))
		stateMachine.add(PlayerStateName.CarryingIdling, new PlayerCarryingIdlingState(this))
		stateMachine.add(PlayerStateName.Carrying, new PlayerCarryingState(this))
		stateMachine.add(PlayerStateName.Throwing, new PlayerThrowingState(this))
		stateMachine.add(PlayerStateName.Idle, new PlayerIdlingState(this));

		stateMachine.change(PlayerStateName.Idle);

		return stateMachine;
	}

	receiveDamage(damage, enemy) {
		if (enemy instanceof Slime || enemy instanceof Skeleton) {
			this.health -= damage;
			sounds.play(SoundName.HitPlayer);
		}
	}

	becomeInvulnerable(enemy) {
		if(enemy instanceof Slime || enemy instanceof Skeleton){
			this.isInvulnerable = true;
			this.invulnerabilityTimer = this.startInvulnerabilityTimer();
		}
	}

	startInvulnerabilityTimer() {
		const action = () => {
			this.alpha = this.alpha === 1 ? 0.5 : 1;
		};
		const interval = Player.INVULNERABLE_FLASH_INTERVAL;
		const duration = Player.INVULNERABLE_DURATION;
		const callback = () => {
			this.alpha = 1;
			this.isInvulnerable = false;
		};

		return timer.addTask(action, interval, duration, callback);
	}

	checkForOpenChest(chest){
		if(input.isKeyPressed(Input.KEYS.ENTER)){
			chest.open();
		}
	}

	updateHealthBar(){
		this.healthBar.x = this.position.x;
		this.healthBar.y = this.position.y + 27;
		if(this.health != this.healthBar.value){
			this.healthBar.updateValue(this.health);
		}
	}
}
