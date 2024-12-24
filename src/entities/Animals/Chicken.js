import BotEntity from "../BotEntity.js";
import Room from "../../objects/Room.js";
import ImageName from "../../enums/ImageName.js";
import Sprite from "../../../lib/Sprite.js";
import { images, context, DEBUG } from "../../globals.js";
import Hitbox from "../../../lib/Hitbox.js";
import Animation from "../../../lib/Animation.js";
import Player from "../Player.js";
import StateMachine from "../../../lib/StateMachine.js";
import BotEntityStateName from "../../enums/BotEntityStateName.js";
import BotEntityIdlingState from "../../states/bot/BotEntityIdlingState.js";
import BotEntityWalkingState from "../../states/bot/BotEntityWalkingState.js";
import Direction from "../../enums/Direction.js";
import Timer from "../../../lib/Timer.js";
import { getRandomPositiveInteger } from "../../../lib/Random.js";
import Skeleton from "../Enemies/Skeleton.js";
import Slime from "../Enemies/Slime.js";

export default class Chicken extends BotEntity {
    static WIDTH = 16;
    static HEIGHT = 16;
    static SPRITE_WIDTH = 32;
    static SPRITE_LENGTH = 32;
    static MAX_SPEED = 100;
    static MAX_HEALTH = 1;

    constructor(player) {
        super();
        this.player = player;
        this.isDead = false;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Chicken),
            Chicken.SPRITE_WIDTH,
            Chicken.SPRITE_LENGTH
        );

		this.positionOffset = { x: 0, y: 0 };
		this.hitboxOffsets = new Hitbox(
			7,
			Chicken.HEIGHT + 2,
			0,
			-Chicken.HEIGHT + 6
		);
		this.position.x = Room.LEFT_EDGE + 15;
		this.position.y = (Room.CENTER_Y - Player.HEIGHT / 2) - 40;
		this.dimensions.x = Chicken.WIDTH;
		this.dimensions.y = Chicken.HEIGHT;
        this.speed = 30;
        this.health = Chicken.MAX_HEALTH;

		const animations = {
			[BotEntityStateName.Idle]: {
				[Direction.Up]: new Animation([0], 1),
				[Direction.Down]: new Animation([0], 1),
				[Direction.Left]: new Animation([0], 1),
				[Direction.Right]: new Animation([0], 1),
			},
			[BotEntityStateName.Walking]: {
				[Direction.Up]: new Animation([1, 2, 3], 0.15),
				[Direction.Down]: new Animation([1, 2, 3], 0.15),
				[Direction.Left]: new Animation([1, 2, 3], 0.15),
				[Direction.Right]: new Animation([1, 2, 3], 0.15),
			}
		};

		this.stateMachine = this.initializeStateMachine(animations);

        this.direction = this.getRandomDirection();

		this.timer = new Timer();
		this.isHeld = false;
    }

    getRandomDirection() {
		return getRandomPositiveInteger(0, 3);
    }

	update(dt) {
		super.update(dt)
	
		if (Math.random() < 0.005) {
			this.direction = this.getRandomDirection();
		}

		if(this.isHeld){
            this.position.x = this.player.position.x;
            this.position.y = this.player.position.y - 15;
        }
	
		this.currentAnimation.update(dt);
		this.timer.update(dt)
	}

	render() {
		context.save();

		context.globalAlpha = this.alpha;

		super.render(this.positionOffset);

		context.restore();
	}
	
    receiveDamage(damage, enemy) {
		if((enemy instanceof Slime || enemy instanceof Skeleton) && !this.isHeld){
			this.health -= damage;
			if (this.health <= 0) {
				this.isDead = true;
			}
		}
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

	initializeLift(player){
        this.updateHitBox = false;
        this.hitbox.dimensions.x = 0;
        this.hitbox.dimensions.y = 0;
        this.isHeld = true;
        this.player = player;

		this.stateMachine.change(BotEntityStateName.Idle, {});
    }
}
