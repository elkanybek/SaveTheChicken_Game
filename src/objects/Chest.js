import Hitbox from "../../lib/Hitbox.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Timer from "../../lib/Timer.js";
import Animation from "../../lib/Animation.js";
import GameObject from "./GameObject.js";
import { images, debug, DEBUG, context, timer, sounds } from "../globals.js";
import Carrot from "./Carrot.js";
import Vector from "../../lib/Vector.js";
import ObjectName from "../enums/ObjectName.js";
import Mushroom from "./Mushroom.js";
import SoundName from "../enums/SoundName.js";

export default class Chest extends GameObject{
    static WIDTH = 16;
	static HEIGHT = 16;
    constructor(dimensions, position, room, objectName){
        super(dimensions, position)
        this.room = room;
        this.objectName = objectName;
        this.isOpened = false;

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
			Chest.WIDTH,
			Chest.HEIGHT
		);

        this.currentFrame = 12;
        this.room = room
        this.timer = new Timer();
        this.openAnimation = new Animation([12, 13, 14], 0.1);
        this.isOpening = false;
        this.isEmpty = false;
    }

    update(dt){
        super.update(dt);

        if(this.isOpening){
            //this.openAnimation.refresh();
            this.openAnimation.update(dt)
            this.currentFrame = this.openAnimation.getCurrentFrame();
            if(this.openAnimation.timesPlayed == 1){
                this.isOpening = false;
            }
        }
    }

    render(offset = { x: 0, y: 0}){
        super.render(offset);

        if(DEBUG){
            this.hitbox.render(context);
        }
    }

    open(){
        if(!this.isOpening && !this.isEmpty){
            sounds.play(SoundName.Chest);
            this.isOpening = true;
            let object;

            if(this.objectName == ObjectName.Carrot){
                object = new Carrot(
                    new Vector(Carrot.WIDTH, Carrot.HEIGHT),
                    new Vector(this.position.x, this.position.y - 20),
                    this.room 
                );
            }
            else{
                object = new Mushroom(new Vector(Carrot.WIDTH, Carrot.HEIGHT),
                new Vector(this.position.x, this.position.y - 20),
                this.room 
            );
            }

            timer.addTask(() => {}, 0.3, 0.3, () => {this.room.objects.push(object);})

            this.isEmpty = true;
        }
    }
}