import Hitbox from "../../lib/Hitbox.js";
import Sprite from "../../lib/Sprite.js";
import Timer from "../../lib/Timer.js";
import ImageName from "../enums/ImageName.js";
import { context, DEBUG, images } from "../globals.js";
import GameObject from "./GameObject.js";
import Mushroom from "./Mushroom.js";
import Player from "../entities/Player.js";

export default class Carrot extends GameObject{
	static WIDTH = 16;
	static HEIGHT = 16;
	
    constructor(dimensions, position, room){
        super(dimensions, position);
		this.room = room;

		this.isConsumable = true;
		this.isSolid = true;
		this.wasConsumed = false;

		this.hitboxOffsets = new Hitbox(0, 0, 0, 0);
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y
		);

		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Objects2),
			Carrot.WIDTH,
			Carrot.HEIGHT
		);
		this.currentFrame = 25;
		this.timer = new Timer();

    }

    update(dt){
		super.update(dt);
    }

    render(offset = { x: 0, y: 0}){
		if(!this.wasConsumed){
			super.render(offset);
		
			if(DEBUG){
				this.hitbox.render(context);
			}
		}
    }

	onConsume(consumer) {
		if (consumer instanceof Player && !this.wasConsumed) {
            super.onConsume(consumer);
			this.room.player.health = Math.min(this.room.player.totalHealth, this.room.player.health + 2);
		}
	}
}