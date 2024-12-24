import Vector from "../../lib/Vector.js";
import EventName from "../enums/EventName.js";
import GameObject from "./GameObject.js";
import Room from "./Room.js";
import Tile from "./Tile.js";
import { canvas, sounds, images, debug, DEBUG, context } from "../globals.js";
import SoundName from "../enums/SoundName.js";
import ImageName from "../enums/ImageName.js";
import Sprite from "../../lib/Sprite.js";
import Hitbox from "../../lib/Hitbox.js";
import Player from "../entities/Player.js";

export default class Door extends GameObject {
	static WIDTH = 16;
	static HEIGHT = 32;

	static CHANGE_ROOMS = new Event(EventName.ChangeRooms);

	/**
	 * One of four doors that appears on each side of a room.
	 * The player can walk through this door when open to go
	 * to an adjacent room.
	 *
	 * @param {Room} room
	 */
	constructor(dimensions, position, room) {
		super(dimensions, position);

		this.room = room;
		this.isOpen = true;
		this.renderPriority = -1;
		this.hitboxOffsets = new Hitbox(0, 0, 0, 0);
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y
		);
		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Objects),
			Door.WIDTH,
			Door.HEIGHT
		);

		this.currentFrame = 9;

		this.isCollidable = true;
		this.isSolid = true;
	}

	update() {
		/**
		 * To achieve the effect of the player walking underneath the arch
		 * of the door, we have to render the player before the door.
		 * Otherwise, we want the player to be above the door or else it will
		 * appear as if they are walking behind the door if they get too close.
		 */
		this.renderPriority = this.room.isShifting ? 1 : -1;
	}

	render(offset) {
		super.render(offset);

		if(DEBUG){
			this.hitbox.render(context);
		}
	}

	open() {
		if (!this.isOpen) {
			this.isOpen = true;
			this.sprites = this.openSprites;
			sounds.play(SoundName.Door);
		}
	}

	close() {
		if (this.isOpen) {
			this.isOpen = false;
			this.sprites = this.closeSprites;
			sounds.play(SoundName.Door);
		}
	}

	/**
	 * Trigger a camera translation and adjustment of rooms whenever
	 * the player triggers a shift via a doorway collision.
	 */
	onCollision(collider) {
		super.onCollision(collider);

		if (!(collider instanceof Player) || this.room.hasEnemies()) {
			return;
		}

		if(collider.chicken.isHeld){
			canvas.dispatchEvent(Door.CHANGE_ROOMS);
			sounds.play(SoundName.Door);
		}
	}

	didPlayerCollide() {
		return this.didCollideWithEntity(this.room.player.hitbox)
			&& !this.room.isShifting
			&& this.isOpen;
	}
}
