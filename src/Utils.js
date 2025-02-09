export class Utils {
	
	static lerp(a1, a2, t) {
		return a1 * (1 - t) + a2 * t;
	}

	static easeBackout(amount) {
		return (t) => --t * t * ((amount + 1) * t + amount) + 1;
	}

	static easeNone(amount) {
		return amount;
	}

	static getRandom(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

}