import EventName from '../enums/EventName.js';
import Player from '../entities/Player.js';
import Direction from '../enums/Direction.js';
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	debug,
	timer,
	stateMachine
} from '../globals.js';
import Room from './Room.js';
import Tile from './Tile.js';
import Vector from '../../lib/Vector.js';
import LevelMaker from '../services/LevelMaker.js';
import Chicken from '../entities/Animals/Chicken.js';
import GameStateName from '../enums/GameStateName.js';

export default class Dungeon {
	/**
	 * Contains the rooms and player for the game.
	 * Takes care of animating new rooms into view when
	 * the player walks through doors.
	 *
	 * @param {Player} player
	 */
	constructor(player, mapDefinitions) {
		this.player = player;

		this.mapDefinitions = mapDefinitions

		this.currentRoomIndex = 0;

		this.rooms = this.initializeRooms(player, mapDefinitions);

		this.currentRoom = this.rooms[this.currentRoomIndex];
		this.rooms[this.currentRoomIndex].enter();

		// Room we're moving the camera to during a shift and becomes active room afterwards.
		this.nextRoom = null;

		// Use the camera values when shifting screens with translate().
		this.camera = new Vector();
		this.isShifting = false;

		canvas.addEventListener(EventName.ChangeRooms, () => {
			let health = this.currentRoom.player.health;
			this.currentRoomIndex++;
			
			if(this.currentRoomIndex >= this.rooms.length){
				stateMachine.change(GameStateName.Transition, {
					fromState: this,
					toState: stateMachine.states[GameStateName.Victory],
				});
			}
			else{
				this.currentRoom = this.rooms[this.currentRoomIndex]
				this.player.reset();
				this.currentRoom.enter();
				this.currentRoom.player.health = health;
			}
		}
		);

		debug.watch('Player', {
			position: () =>
				`Position: (${this.player.position.x.toFixed(
					0
				)}, ${this.player.position.y.toFixed(0)})`,
			state: () => `State: ${this.player.stateMachine.currentState.name}`,
		});
	}

	update(dt) {
		this.currentRoom.update(dt);
		this.nextRoom?.update(dt);

		/**
		 * Still update the player animation if we're shifting rooms.
		 * This makes it look like the player is walking into the next
		 * room instead of sliding into it.
		 */
		if (this.isShifting) {
			this.player.currentAnimation.update(dt);
		}
	}

	render() {
		context.save();

		// Translate the camera if we're actively shifting.
		if (this.isShifting) {
			context.translate(
				-Math.floor(this.camera.x),
				-Math.floor(this.camera.y)
			);
		}

		this.currentRoom.render();
		this.nextRoom?.render();

		context.restore();
	}

	/**
	 * Prepares the rooms, camera, and player to all be shifted.
	 *
	 * @param {Vector} nextRoomPosition
	 */
	beginShifting(nextRoomPosition) {
		this.isShifting = true;
		this.currentRoom.isShifting = true;

		const newPlayerPosition =
			this.prepareRoomAndPlayerForShift(nextRoomPosition);

		this.tweenRoomAndPlayer(nextRoomPosition, newPlayerPosition);
	}

	prepareRoomAndPlayerForShift(nextRoomPosition) {
		this.currentRoomIndex++;
		this.nextRoom = this.rooms[this.currentRoomIndex]

		this.nextRoom.openDoors();
		this.nextRoom.adjacentOffset.set(
			nextRoomPosition.x,
			nextRoomPosition.y
		);

		return this.getNewPlayerPosition(nextRoomPosition);
	}

	getNewPlayerPosition(nextRoomPosition) {
		let newPlayerPosition = new Vector(
			this.player.position.x,
			this.player.position.y
		);

		if (nextRoomPosition.x > 0) {
			newPlayerPosition.x =
				CANVAS_WIDTH + (Room.RENDER_OFFSET_X + Tile.TILE_SIZE);
		} else if (nextRoomPosition.x < 0) {
			newPlayerPosition.x =
				-CANVAS_WIDTH +
				(Room.RENDER_OFFSET_X +
					Room.WIDTH * Tile.TILE_SIZE -
					Tile.TILE_SIZE -
					this.player.dimensions.x);
		} else if (nextRoomPosition.y > 0) {
			newPlayerPosition.y =
				CANVAS_HEIGHT +
				(Room.RENDER_OFFSET_Y + this.player.dimensions.y / 2);
		} else {
			newPlayerPosition.y =
				-CANVAS_HEIGHT +
				Room.RENDER_OFFSET_Y +
				Room.HEIGHT * Tile.TILE_SIZE -
				Tile.TILE_SIZE -
				this.player.dimensions.y;
		}

		return newPlayerPosition;
	}

	/**
	 * Tween the camera in whichever direction the new room is in, as
	 * well as the player to be at the opposite door in the next room.
	 */
	async tweenRoomAndPlayer(nextRoomPosition, newPlayerPosition) {
		await timer.tweenAsync(
			this.camera,
			{ x: nextRoomPosition.x, y: nextRoomPosition.y },
			1
		);

		await timer.tweenAsync(
			this.player.position,
			{ x: newPlayerPosition.x, y: newPlayerPosition.y },
			1
		);

		this.finishShifting(nextRoomPosition);
	}

	/**
	 * Once the camera is done panning to the next room, reset
	 * the player's parameters to align with the new room.
	 *
	 * @param {Vector} nextRoomPosition
	 */
	finishShifting(nextRoomPosition) {
		this.isShifting = false;
		this.camera.set(0, 0);
		this.resetRooms();
		this.resetPlayer(nextRoomPosition);
		this.currentRoom.closeDoors();
	}

	resetRooms() {
		if (!this.nextRoom) {
			return;
		}

		this.currentRoom.isShifting = false;
		this.nextRoom.isShifting = false;
		this.currentRoom = this.nextRoom;
		this.nextRoom = null;
		this.currentRoom.adjacentOffset.set(0, 0);
	}

	resetPlayer(newRoomPosition) {
		if (newRoomPosition.x < 0) {
			this.player.position.x =
				Room.RENDER_OFFSET_X +
				Room.WIDTH * Tile.TILE_SIZE -
				Tile.TILE_SIZE -
				this.player.dimensions.x;
			this.player.direction = Direction.Left;
		} else if (newRoomPosition.x > 0) {
			this.player.position.x = Room.RENDER_OFFSET_X + Tile.TILE_SIZE;
			this.player.direction = Direction.Right;
		} else if (newRoomPosition.y < 0) {
			this.player.position.y =
				Room.RENDER_OFFSET_Y +
				Room.HEIGHT * Tile.TILE_SIZE -
				Tile.TILE_SIZE -
				this.player.dimensions.y;
			this.player.direction = Direction.Up;
		} else {
			this.player.position.y =
				Room.RENDER_OFFSET_Y + this.player.dimensions.y / 2;
			this.player.direction = Direction.Down;
		}
	}

	initializeRooms(player, mapDefinitions){
		let rooms = [];

		for(let i = 0; i < mapDefinitions.length; i++){
			let room = new Room(player, mapDefinitions[i]);
			LevelMaker.createLevel(room, i + 1)
			rooms.push(room)
		}

		return rooms;
	}
}
