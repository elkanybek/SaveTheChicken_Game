export default class Tile {
	static TILE_SIZE = 16;
	/**
	 * Represents one tile in a Layer and on the screen.
	 *
	 * @param {number} id
	 * @param {array} sprites
	 */
	constructor(id, sprites) {
		this.sprites = sprites;
		this.id = id;
	}

	render(x, y) {
		this.sprites[this.id].render(x * Tile.TILE_SIZE, y * Tile.TILE_SIZE);
	}
}
