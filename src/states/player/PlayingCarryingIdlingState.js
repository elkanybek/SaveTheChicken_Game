import Animation from '../../../lib/Animation.js';
import State from '../../../lib/State.js';
import Player from '../../entities/Player.js';
import Direction from '../../enums/Direction.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import { input } from '../../globals.js';
import Input from '../../../lib/Input.js';

export default class PlayerCarryingIdling extends State {
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
		this.player.sprites = this.player.carryingSprites;
		this.player.currentAnimation = this.animation[this.player.direction];

		this.player.throwCooldown = true;
		this.player.timer.addTask(() => {}, 0.1, 0.1, () => { this.player.throwCooldown = false})
	}

	update() {
		this.checkForMovement();
        this.checkForThrow();
	}

	checkForMovement() {
		if (input.isKeyPressed(Input.KEYS.S)) {
			this.player.direction = Direction.Down;
			this.player.changeState(PlayerStateName.Carrying);
		} else if (input.isKeyPressed(Input.KEYS.D)) {
			this.player.direction = Direction.Right;
			this.player.changeState(PlayerStateName.Carrying);
		} else if (input.isKeyPressed(Input.KEYS.W)) {
			this.player.direction = Direction.Up;
			this.player.changeState(PlayerStateName.Carrying);
		} else if (input.isKeyPressed(Input.KEYS.A)) {
			this.player.direction = Direction.Left;
			this.player.changeState(PlayerStateName.Carrying);
		}
	}

    checkForThrow(){
        if(input.isKeyPressed(Input.KEYS.ENTER) && !this.player.throwCooldown){
            //this.player.pot.timer.addTask(() => {}, 0.07, 0.07, () => {this.player.pot.updateHitBox = true;})
			this.player.chicken.isHeld = false;
            let multiplier = 1;
            if(this.player.direction == Direction.Up || this.player.direction == Direction.Left){
                multiplier = -1;
            }

            if(this.player.direction == Direction.Up || this.player.direction == Direction.Down){
                this.player.chicken.timer.tween(this.player.chicken.position, 
                    { y: this.player.chicken.position.y + 10 * multiplier }, 0.2);
            }
            else{
                this.player.chicken.timer.tween(this.player.chicken.position, 
                    { x: this.player.chicken.position.x + 10 * multiplier }, 0.2);
            }

            this.player.changeState(PlayerStateName.Idle)
			this.player.chicken.isHeld = false;
			this.player.chicken.stateMachine.currentState.startTimer();
        }
    }
}
