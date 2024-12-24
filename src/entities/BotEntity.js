import GameEntity from "./GameEntity.js"
import { timer, sounds } from "../globals.js";
import SoundName from "../enums/SoundName.js";

export default class BotEntity extends GameEntity{
    constructor(){
        super();
        this.damageCooldown = false;
    }

    update(dt){
        super.update(dt);
    }

    render(){
        super.render()
    }

    receiveDamage(damage){
        if(!this.damageCooldown){
			this.health -= damage;
		sounds.play(SoundName.HitEnemy);
		if (this.health <= 0) {
            this.isDead = true;
        }

		this.damageCooldown = true;

		timer.addTask(() => {}, 0.2, 0.2, () => { this.damageCooldown = false})
		}
    }
}