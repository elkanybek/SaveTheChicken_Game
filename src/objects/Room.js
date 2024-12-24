import Sprite from '../../lib/Sprite.js';
import Vector from '../../lib/Vector.js';
import Player from '../entities/Player.js';
import Direction from '../enums/Direction.js';
import ImageName from '../enums/ImageName.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from '../globals.js';
import Door from './Door.js';
import Tile from './Tile.js';
import Chicken from '../entities/Animals/Chicken.js';
import Chest from './Chest.js';
import BotEntity from '../entities/BotEntity.js';

export default class Room {
	static WIDTH = 24;
	static HEIGHT = 13;
	static RENDER_OFFSET_X = (CANVAS_WIDTH - Room.WIDTH * Tile.TILE_SIZE) / 2;
	static RENDER_OFFSET_Y = (CANVAS_HEIGHT - Room.HEIGHT * Tile.TILE_SIZE) / 2;

	static TOP_EDGE = Room.RENDER_OFFSET_Y + Tile.TILE_SIZE;
	static BOTTOM_EDGE =
		CANVAS_HEIGHT - Room.RENDER_OFFSET_Y - Tile.TILE_SIZE - 5;
	static LEFT_EDGE = Room.RENDER_OFFSET_X + Tile.TILE_SIZE - 5;
	static RIGHT_EDGE = CANVAS_WIDTH - Tile.TILE_SIZE * 2 + 5;
	static CENTER_X = Math.floor(
		Room.LEFT_EDGE + (Room.RIGHT_EDGE - Room.LEFT_EDGE) / 2
	);
	static CENTER_Y = Math.floor(
		Room.TOP_EDGE + (Room.BOTTOM_EDGE - Room.TOP_EDGE) / 2
	);

	//Those values down below needs to change
	static TILE_TOP_LEFT_CORNER = 3;
	static TILE_TOP_RIGHT_CORNER = 4;
	static TILE_BOTTOM_LEFT_CORNER = 22;
	static TILE_BOTTOM_RIGHT_CORNER = 23;
	static TILE_EMPTY = 18;
	static TILE_TOP_WALLS = [57, 58, 59];
	static TILE_BOTTOM_WALLS = [78, 79, 80];
	static TILE_LEFT_WALLS = [76, 95, 114];
	static TILE_RIGHT_WALLS = [77, 96, 115];
	static TILE_FLOORS = [
		6, 7, 8, 9, 10, 11, 12, 25, 26, 27, 28, 29, 30, 31, 44, 45, 46, 47, 48,
		49, 50, 63, 64, 65, 66, 67, 68, 69, 87, 88, 106, 107,
	];

	/**
	 * Represents one individual section of the dungeon complete
	 * with its own set of enemies and a switch that can open the doors.
	 *
	 * @param {Player} player
	 */
	constructor(player, mapDefinition, isShifting = false) {
		this.player = player;
		this.chicken = new Chicken(player);
		this.player.chicken = this.chicken;
		this.slimes = [];

		this.dimensions = new Vector(Room.WIDTH, Room.HEIGHT);
		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Tiles),
			Tile.TILE_SIZE,
			Tile.TILE_SIZE
		);
		this.tiles = Room.generateTiles(mapDefinition, this.sprites);
		this.entities = [];
		this.objects = [];
		this.doorways = [];
		this.renderQueue = this.buildRenderQueue();

		// Used for drawing when this room is the next room, adjacent to the active.
		this.adjacentOffset = new Vector();

		this.isShifting = isShifting;
		this.entities.push(this.player);
		this.entities.push(this.chicken)
	}

	update(dt) {
		this.renderQueue = this.buildRenderQueue();
		this.cleanUpEntities();
		this.updateEntities(dt);
		this.updateObjects(dt);
	}

	render() {
		this.renderTiles();

		this.renderQueue.forEach((elementToRender) => {
			elementToRender.render(this.adjacentOffset);
		});
	}

	enter() {
		this.player.chicken = this.chicken;
	}

	static generateTiles(layerData, sprites) {
		const tiles = [];

		layerData.layers[0].data.forEach((tileId) => {
			// map.json indexes tiles starting from 1 and not 0, so we must adjust it.
			tileId--;

			// -1 means there should be no tile at this location.
			const tile = tileId === -1 ? null : new Tile(tileId, sprites);

			tiles.push(tile);
		});

		return tiles;
	}

	/**
	 * Order the entities by their renderPriority fields. If the renderPriority
	 * is the same, then sort the entities by their bottom positions. This will
	 * put them in an order such that entities higher on the screen will appear
	 * behind entities that are lower down.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	 *
	 * The spread operator (...) returns all the elements of an array separately
	 * so that you can pass them into functions or create new arrays. What we're
	 * doing below is combining both the entities and objects arrays into one.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
	 */
	buildRenderQueue() {
		return [...this.entities, ...this.objects].sort((a, b) => {
			let order = 0;
			const bottomA = a.hitbox.position.y + a.hitbox.dimensions.y;
			const bottomB = b.hitbox.position.y + b.hitbox.dimensions.y;

			if (a.renderPriority < b.renderPriority) {
				order = -1;
			} else if (a.renderPriority > b.renderPriority) {
				order = 1;
			} else if (bottomA < bottomB) {
				order = -1;
			} else {
				order = 1;
			}

			return order;
		});
	}

	cleanUpEntities() {
		this.entities = this.entities.filter((entity) => !entity.isDead);
	}

	updateEntities(dt) {
		this.entities.forEach((entity) => {
			if (entity.health <= 0) {
				entity.isDead = true;
			}

			// Disallow the player to control the character while shifting.
			if (
				!this.isShifting ||
				(this.isShifting && entity !== this.player)
			) {
				entity.update(dt);
			}

			this.objects.forEach((object) => {
				if (object.didCollideWithEntity(entity.hitbox)) {
					if (object.isCollidable) {
						object.onCollision(entity);
					}
					else if (object.isConsumable) {
						object.onConsume(entity);
					}
				}

				if(object instanceof Chest && this.player.didCollideWithEntity(object.hitbox)){
					this.player.checkForOpenChest(object);
				}
			});

			// Since the player is technically always colliding with itself, skip it.
			if (entity === this.player) {
				return;
			}

			if (entity.didCollideWithEntity(this.player.swordHitbox)) {
				entity.receiveDamage(this.player.damage);
			}

			if (!(entity instanceof Chicken) && entity.didCollideWithEntity(this.chicken.hitbox)) {
				this.chicken.receiveDamage(entity.damage, entity);
			}

			if (
				!entity.isDead &&
				this.player.didCollideWithEntity(entity.hitbox) &&
				!this.player.isInvulnerable
			) {
				this.player.receiveDamage(entity.damage, entity);
				this.player.becomeInvulnerable(entity);
			}
		});
	}

	updateObjects(dt) {
		this.objects.forEach((object) => {
			object.update(dt);
		});
	}

	renderTiles() {

		for (let y = 0; y < Room.HEIGHT; y++) {
			for (let x = 0; x < Room.WIDTH; x++) {
				const tile = this.getTile(x, y);
				if (tile) {
					tile.render(x + (Room.RENDER_OFFSET_X / Tile.TILE_SIZE), y + (Room.RENDER_OFFSET_Y / Tile.TILE_SIZE))
				}
			}
		}
	}

	getTile(x, y) {
		return this.tiles[x + y * Room.WIDTH];
	}

	/**
	 * Uses the constants defined at the top of the class and determines which
	 * sprites to use for the walls and floor. Since there are several potential
	 * tiles to use for a piece of wall or floor, we can have a slightly different
	 * look each time we create a new room.
	 *
	 * @returns An array containing the walls and floors of the room, randomizing the tiles for visual variety.
	 */
	generateWallsAndFloors() {
		const tiles = new Array();

		for (let y = 0; y < this.dimensions.y; y++) {
			tiles.push([]);

			for (let x = 0; x < this.dimensions.x; x++) {
				let tileId = Room.TILE_EMPTY;

				if (x === 0 && y === 0) {
					tileId = Room.TILE_TOP_LEFT_CORNER;
				} else if (x === 0 && y === this.dimensions.y - 1) {
					tileId = Room.TILE_BOTTOM_LEFT_CORNER;
				} else if (x === this.dimensions.x - 1 && y === 0) {
					tileId = Room.TILE_TOP_RIGHT_CORNER;
				} else if (
					x === this.dimensions.x - 1 &&
					y === this.dimensions.y - 1
				) {
					tileId = Room.TILE_BOTTOM_RIGHT_CORNER;
				}
				// Random left-hand walls, right walls, top, bottom, and floors.
				else if (x === 0) {
					if (
						y === Math.floor(this.dimensions.y / 2) ||
						y === Math.floor(this.dimensions.y / 2) + 1
					) {
						tileId = Room.TILE_EMPTY;
					} else {
						tileId =
							Room.TILE_LEFT_WALLS[
							Math.floor(
								Math.random() * Room.TILE_LEFT_WALLS.length
							)
							];
					}
				} else if (x === this.dimensions.x - 1) {
					if (
						y === Math.floor(this.dimensions.y / 2) ||
						y === Math.floor(this.dimensions.y / 2) + 1
					) {
						tileId = Room.TILE_EMPTY;
					} else {
						tileId =
							Room.TILE_RIGHT_WALLS[
							Math.floor(
								Math.random() * Room.TILE_RIGHT_WALLS.length
							)
							];
					}
				} else if (y === 0) {
					if (
						x === this.dimensions.x / 2 ||
						x === this.dimensions.x / 2 - 1
					) {
						tileId = Room.TILE_EMPTY;
					} else {
						tileId =
							Room.TILE_TOP_WALLS[
							Math.floor(
								Math.random() * Room.TILE_TOP_WALLS.length
							)
							];
					}
				} else if (y === this.dimensions.y - 1) {
					if (
						x === this.dimensions.x / 2 ||
						x === this.dimensions.x / 2 - 1
					) {
						tileId = Room.TILE_EMPTY;
					} else {
						tileId =
							Room.TILE_BOTTOM_WALLS[
							Math.floor(
								Math.random() *
								Room.TILE_BOTTOM_WALLS.length
							)
							];
					}
				} else {
					tileId =
						Room.TILE_FLOORS[
						Math.floor(Math.random() * Room.TILE_FLOORS.length)
						];
				}

				tiles[y].push(
					new Tile(
						x,
						y,
						Room.RENDER_OFFSET_X,
						Room.RENDER_OFFSET_Y,
						this.sprites[tileId]
					)
				);
			}
		}

		return tiles;
	}

	/**
	 * @returns An array of enemies for the player to fight.
	 */
	generateEntities() {
		const entities = new Array();
		return entities;
	}

	/**
	 * @returns An array of the four directional doors.
	 */
	generateDoorways() {
		const doorways = [];

		doorways.push(
			new Door(
				Door.getDimensionsFromDirection(Direction.Left),
				Door.getPositionFromDirection(Direction.Left),
				Direction.Left,
				this
			)
		);
		doorways.push(
			new Door(
				Door.getDimensionsFromDirection(Direction.Right),
				Door.getPositionFromDirection(Direction.Right),
				Direction.Right,
				this
			)
		);

		return doorways;
	}

	openDoors() {
		this.doorways.forEach((doorway) => {
			doorway.open();
		});
	}

	closeDoors() {
		this.doorways.forEach((doorway) => {
			doorway.close();
		});
	}

	hasEnemies(){
		let botCount = 0
		this.entities.forEach((entity) => {
			if(entity instanceof BotEntity){
				botCount++
			}
		});
		return botCount >= 2;
	}
}
