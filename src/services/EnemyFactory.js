import EnemyType from "../enums/EnemyType.js";
import Skeleton from "../entities/Enemies/Skeleton.js";
import Slime from "../entities/Enemies/Slime.js";

/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class EnemyFactory {
	static createInstance(type, player) {
		switch (type) {
			case EnemyType.Skeleton:
				return new Skeleton(player);
			case EnemyType.Slime:
				return new Slime(player);
		}
	}
}
