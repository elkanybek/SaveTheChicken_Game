import { getCollisionDirection, isAABBCollision } from "./CollisionHelpers.js";
import Vector from "./Vector.js";

export default class Hitbox {
	/**
	 * A rectangle that represents the area around a game
	 * entity or object that can collide with other hitboxes.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {string} colour
	 */
	constructor(x = 0, y = 0, width = 0, height = 0, colour = 'red') {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.colour = colour;
	}

	set(x, y, width, height) {
		this.position.x = x;
		this.position.y = y;
		this.dimensions.x = width;
		this.dimensions.y = height;
	}

	didCollide(target) {
		return isAABBCollision(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			target.position.x,
			target.position.y,
			target.dimensions.x,
			target.dimensions.y,
		);
	}

	getCollisionDirection(target) {
		return getCollisionDirection(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			target.position.x,
			target.position.y,
			target.dimensions.x,
			target.dimensions.y,
		);
	}

	render(context) {
		context.save();
		context.strokeStyle = this.colour;
		context.beginPath();
		context.rect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
		context.stroke();
		context.closePath();
		context.restore();
	}
}
