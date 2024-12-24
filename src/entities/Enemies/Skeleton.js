import BotEntity from "../BotEntity.js";
import Room from "../../objects/Room.js";
import ImageName from "../../enums/ImageName.js";
import Sprite from "../../../lib/Sprite.js";
import { images, context, DEBUG, timer } from "../../globals.js";
import Hitbox from "../../../lib/Hitbox.js";
import Animation from "../../../lib/Animation.js";
import Player from "../Player.js";
import StateMachine from "../../../lib/StateMachine.js";
import BotEntityStateName from "../../enums/BotEntityStateName.js";
import BotEntityIdlingState from "../../states/bot/BotEntityIdlingState.js";
import BotEntityWalkingState from "../../states/bot/BotEntityWalkingState.js";
import Direction from "../../enums/Direction.js";
import { getRandomPositiveInteger } from "../../../lib/Random.js";
import ProgressBar from "../../ui/ProgressBar.js";

export default class Skeleton extends BotEntity {
    static WIDTH = 16;
    static HEIGHT = 16;
    static SPRITE_WIDTH = 32;
    static SPRITE_LENGTH = 32;
    static MAX_SPEED = 100;
    static MAX_HEALTH = 3;

    constructor(player) {
        super();
        this.player = player;
        this.isDead = false;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Skeleton),
            Skeleton.SPRITE_WIDTH,
            Skeleton.SPRITE_LENGTH
        );

		this.positionOffset = { x: 0, y: 0 };
		this.hitboxOffsets = new Hitbox(
			7,
			Skeleton.HEIGHT + 2,
			0,
			-Skeleton.HEIGHT + 6
		);
		this.position.x = Room.RIGHT_EDGE - 15;
		this.position.y = (Room.CENTER_Y - Player.HEIGHT / 2);
		this.dimensions.x = Skeleton.WIDTH;
		this.dimensions.y = Skeleton.HEIGHT;
        this.speed = 30;
        this.health = Skeleton.MAX_HEALTH;

		const animations = {
			[BotEntityStateName.Idle]: {
				[Direction.Up]: new Animation([0, 1, 2, 3, 5], 1),
				[Direction.Down]: new Animation([0, 1, 2, 3, 5], 1),
				[Direction.Left]: new Animation([0, 1, 2, 3, 5],1, { flip: true }),
				[Direction.Right]: new Animation([0, 1, 2, 3, 5], 1),
			},
			[BotEntityStateName.Walking]: {
				[Direction.Up]: new Animation([12, 13, 14, 15, 16, 17], 0.15),
				[Direction.Down]: new Animation([18, 19, 20, 21, 22, 23], 0.15),
				[Direction.Left]: new Animation([24, 25, 26, 27, 28, 29], 0.15, { flip: true }),
				[Direction.Right]: new Animation([24, 25, 26, 27, 28, 29], 0.15),
			},
			[BotEntityStateName.Death]: {
				[Direction.Up]: new Animation([36, 37, 38, 39], 1),
				[Direction.Down]: new Animation([36, 37, 38, 39], 1),
				[Direction.Left]: new Animation([36, 37, 38, 39], 1, { flip: true }),
				[Direction.Right]: new Animation([36, 37, 38, 39], 1),
			}
		};
		

		this.stateMachine = this.initializeStateMachine(animations);

        this.direction = this.getRandomDirection();

		this.healthBar = new ProgressBar(this.position.x, this.position.y + 27, this.dimensions.x * 2, 5, this.health, this.health);
		this.showHealthBar = false;
    }

    getRandomDirection() {
		return getRandomPositiveInteger(0, 3);
    }

	update(dt) {
		super.update(dt)
	
		if (Math.random() < 0.005) {
			this.direction = this.getRandomDirection();
		}
	
		this.currentAnimation.update(dt);

		this.updateHealthBar();
	}

	render() {
		context.save();

		context.globalAlpha = this.alpha;

		super.render(this.positionOffset);	//

		context.restore();

		if(this.showHealthBar){
			this.healthBar.render();
		}
	}

	renderSpriteWithFlip(spriteSheet, animation, x, y, width, height) {
		const frame = animation.getCurrentFrame();
		const flip = animation.flip;
	
		context.save();
	
		if (flip) {
			// Flip horizontally
			context.scale(-1, 1);
			x = -x - width;
		}
	
		context.drawImage(
			spriteSheet,
			frame * width, 0,
			width, height,
			x, y,
			width, height
		);
	
		context.restore();
	}
	
    receiveDamage(damage) {
        super.receiveDamage(damage)

		this.showHealthBar = true;
		timer.addTask(() => {}, 2.5, 2.5, () => { this.showHealthBar = false})
    }

	initializeStateMachine(animations) {
		const stateMachine = new StateMachine();

		stateMachine.add(
			BotEntityStateName.Idle,
			new BotEntityIdlingState(this, animations[BotEntityStateName.Idle])
		);
		stateMachine.add(
			BotEntityStateName.Walking,
			new BotEntityWalkingState(this, animations[BotEntityStateName.Walking])
		);

		stateMachine.change(BotEntityStateName.Idle, {});

		return stateMachine;
	}

	updateHealthBar(){
		this.healthBar.x = this.position.x;
		this.healthBar.y = this.position.y + 27;
		if(this.health != this.healthBar.value){
			this.healthBar.updateValue(this.health);
		}
	}
}