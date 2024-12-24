import Hitbox from "../../lib/Hitbox.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import GameObject from "./GameObject.js";
import { images, debug, DEBUG, context, timer } from "../globals.js";

export default class Wall extends GameObject{
    static WIDTH = 16;
	static HEIGHT = 16;
    constructor(dimensions, position, room, objectName){
        super(dimensions, position)
        this.room = room;

        this.hitboxOffsets = new Hitbox(0, 0, 0, 0);
        this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y
		);
        this.isCollidable = true;
		this.isSolid = true;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Objects),
			Wall.WIDTH,
			Wall.HEIGHT
		);

        this.currentFrame = 117;
        this.room = room
    }

    update(dt){
        super.update(dt);
    }

    render(offset = { x: 0, y: 0}){
        super.render(offset);

        if(DEBUG){
            this.hitbox.render(context);
        }
    }
}