import Sprite from "../../lib/Sprite.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Tile from "../objects/Tile.js";

export default class UserInterface {
	static FULL_HEART = 4;
	static HALF_HEART = 2;
	static EMPTY_HEART = 0;
	static HEART_WIDTH = Tile.TILE_SIZE;
	static HEART_HEIGHT = Tile.TILE_SIZE;

	/**
	 * Displays the number of hearts in the top-left corner.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		this.player = player;
		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Hearts),
			UserInterface.HEART_WIDTH,
			UserInterface.HEART_HEIGHT
		);
	}

	render() {
		// Draw player hearts on the top of the screen.
		let healthLeft = this.player.health;
		let heartFrame = 0;

		for (let i = 0; i < this.player.totalHealth / 2; i++) {
			if (healthLeft > 1) {
				heartFrame = UserInterface.FULL_HEART;
			}
			else if (healthLeft === 1) {
				heartFrame = UserInterface.HALF_HEART;
			}
			else {
				heartFrame = UserInterface.EMPTY_HEART;
			}

			this.sprites[heartFrame].render(i * Tile.TILE_SIZE, 0);

			healthLeft -= 2;
		}
	}
}
