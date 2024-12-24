import { roundedRectangle } from './../../lib/Drawing.js';
import { context, timer } from "../globals.js";
import Colour from "../enums/Colour.js";

export default class ProgressBar{
    constructor(x, y, width, height, value, max, color = Colour.LightGreen){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
		this.max = max
		this.color = color;
    }

    render(){
        const healthBarMaxWidth = this.width;
		const healthBarHeight = 8; // Height of the bar
		const healthBarX = this.x; // Position relative to Pokémon
		const healthBarY = this.y; // Slightly below text

        // Draw background of health bar
		context.fillStyle = Colour.Black;

		roundedRectangle(
			context,
			this.x,
			this.y,
			this.width,
			this.height,
			1,
			false,
			true
		);

		//background
		context.fillStyle = 'white';
		roundedRectangle(
			context,
			this.x + 1,
			this.y + 1,
			this.width,
			this.height - 2,
			2,
			true,
			true
		);

		context.fillStyle = this.color;
		roundedRectangle(
			context,
			this.x + 1,
			this.y + 1,
			healthBarMaxWidth * (this.value / this.max),
			this.height - 2,
			2,
			true,
			true
		);

		context.fillStyle = Colour.Black;
    }

	updateValue(newValue){
		
		timer.tween(this, { value: newValue}, 0.5)

		timer.addTask(() => {}, 0.5, 0.5, () => { this.updateColor() });
	}

	updateColor(){
		let percentage = (this.value / this.max)
		if(percentage > 0.5){
			this.color = Colour.LightGreen
		}
		else if(percentage > 0.25){
			this.color = 'yellow'
		}
		else{
			this.color = 'red'
		}
	}

	updateWithoutColor(newValue){
		timer.tween(this, { value: newValue}, 0.5)
	}
}