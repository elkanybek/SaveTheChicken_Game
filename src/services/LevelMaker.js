import Slime from "../entities/Enemies/Slime.js";
import Chest from "../objects/Chest.js";
import Mushroom from "../objects/Mushroom.js";
import Carrot from "../objects/Carrot.js";
import Door from "../objects/Door.js";
import Wall from "../objects/Wall.js";
import Room from "../objects/Room.js";
import Vector from "../../lib/Vector.js";
import ObjectName from "../enums/ObjectName.js";
import EnemyFactory from "./EnemyFactory.js";
import EnemyType from "../enums/EnemyType.js";

export default class LevelMaker {
	static createLevel(room, level = 1) {
		switch (level) {
			case 1:
				return LevelMaker.levelOne(room);
			case 2:
				return LevelMaker.levelTwo(room);
			default:
				return LevelMaker.levelThree(room);
		}
	}

	static levelOne(room) {
		for (let i = 0; i < 6; i++) {
            room.entities.push(EnemyFactory.createInstance(EnemyType.Slime, room.player));
		}

        room.objects.push(
			new Chest(
				new Vector(Chest.WIDTH, Chest.HEIGHT),
				new Vector(Room.CENTER_X, Room.CENTER_Y),
				room, 
				ObjectName.Carrot
			)
		);

		room.objects.push(
			new Carrot(
				new Vector(Mushroom.WIDTH, Mushroom.HEIGHT),
				new Vector(Room.CENTER_X - 30, Room.CENTER_Y + 54),
				room,
				this.player
			)
		);

		room.objects.push(
			new Door(
				new Vector(Door.WIDTH, Door.HEIGHT),
				new Vector(Room.RIGHT_EDGE - 10, Room.CENTER_Y),
				room
			)
		)

        //adding a wall:
        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X, Room.TOP_EDGE),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X, Room.TOP_EDGE + Wall.HEIGHT * 1),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X, Room.TOP_EDGE + Wall.HEIGHT * 2),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X, Room.TOP_EDGE + Wall.HEIGHT * 8),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X, Room.TOP_EDGE + Wall.HEIGHT * 9),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X, Room.TOP_EDGE + Wall.HEIGHT * 10),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X, Room.TOP_EDGE + Wall.HEIGHT * 1),
                room
            )
        )
	}

	static levelTwo(room) {
		for (let i = 0; i < 5; i++) {
            room.entities.push(EnemyFactory.createInstance(EnemyType.Skeleton, room.player));
		}
        for (let i = 0; i < 3; i++) {
            room.entities.push(EnemyFactory.createInstance(EnemyType.Slime, room.player));
		}

        room.objects.push(
			new Carrot(
				new Vector(Carrot.WIDTH, Carrot.HEIGHT),
				new Vector(Room.CENTER_X + 30, Room.CENTER_Y -20),
				room,
				this.player
			)
		);

        room.objects.push(
			new Carrot(
				new Vector(Carrot.WIDTH, Carrot.HEIGHT),
				new Vector(Room.LEFT_EDGE + 4, Room.BOTTOM_EDGE - 7),
				room,
				this.player
			)
		);

        room.objects.push(
			new Door(
				new Vector(Door.WIDTH, Door.HEIGHT),
				new Vector(Room.RIGHT_EDGE - 10, Room.CENTER_Y),
				room
			)
		)

        room.objects.push(
			new Chest(
				new Vector(Chest.WIDTH, Chest.HEIGHT),
				new Vector(Room.RIGHT_EDGE, Room.TOP_EDGE + 15),
				room, 
				ObjectName.Mushroom
			)
		);

        //wall:

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 3, Room.TOP_EDGE * 1),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 3, Room.TOP_EDGE * 2),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 3, Room.TOP_EDGE * 3),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 3, Room.TOP_EDGE * 4),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 3, Room.TOP_EDGE * 7),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 3, Room.TOP_EDGE * 8),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 3, Room.TOP_EDGE * 9),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 4, Room.TOP_EDGE * 9),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 5, Room.TOP_EDGE * 9),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 6, Room.TOP_EDGE * 9),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 7, Room.TOP_EDGE * 9),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 8, Room.TOP_EDGE * 9),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 9, Room.TOP_EDGE * 9),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 10, Room.TOP_EDGE * 9),
                room
            )
        )

        room.objects.push(
            new Wall(
                new Vector(Wall.WIDTH, Wall.HEIGHT),
                new Vector(Room.CENTER_X + Wall.WIDTH * 11, Room.TOP_EDGE * 9),
                room
            )
        )
	}

	static levelThree(room) {
		for (let i = 0; i < 6; i++) {
            room.entities.push(EnemyFactory.createInstance(EnemyType.Skeleton, room.player));
		}
        for (let i = 0; i < 6; i++) {
            room.entities.push(EnemyFactory.createInstance(EnemyType.Slime, room.player));
		}

        room.objects.push(
			new Carrot(
				new Vector(Carrot.WIDTH, Carrot.HEIGHT),
				new Vector(Room.CENTER_X + 60, Room.CENTER_Y -20),
				room,
				this.player
			)
		);

        room.objects.push(
			new Carrot(
				new Vector(Carrot.WIDTH, Carrot.HEIGHT),
				new Vector(Room.LEFT_EDGE + 70, Room.BOTTOM_EDGE - 14),
				room,
				this.player
			)
		);

        room.objects.push(
			new Mushroom(
				new Vector(Mushroom.WIDTH, Mushroom.HEIGHT),
				new Vector(Room.RIGHT_EDGE - 10, Room.TOP_EDGE + 7),
				room,
				this.player
			)
		);

        room.objects.push(
			new Door(
				new Vector(Door.WIDTH, Door.HEIGHT),
				new Vector(Room.RIGHT_EDGE - 10, Room.CENTER_Y),
				room
			)
		)

        room.objects.push(
			new Chest(
				new Vector(Chest.WIDTH, Chest.HEIGHT),
				new Vector(Room.RIGHT_EDGE, Room.BOTTOM_EDGE - 15),
				room, 
				ObjectName.Mushroom
			)
		);
	}
}
