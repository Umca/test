export class WinLinesLogic {

	static minAmount = 3;

	static _removeUnfullLines(map) {
		for (let s in map) {
			let linesPerSymbol = map[s];
			if (linesPerSymbol[0].length < WinLinesLogic.minAmount) {
				delete map[s];
			}
		}
	}

	static _copyPrevLines(arr, idx, i, isUnique) {
		let moreLines = [];
		arr
		.filter(l => l.isUnique)
		.forEach(l => {
			let copy = l.slice(0, l.length - 1);
			copy.push({x: idx, y: i});
			copy.isUnique = isUnique;
			moreLines.push(copy);
		});
		return moreLines;
	}

	static _collectWinLines(map, idx, screen) {
		if(idx >= screen.length) return;

		let reel = screen[idx];
		for (let i = 0; i < reel.length; i++) {
			let s = reel[i];
			if (!map[s]) {
				continue;
			} else {
				let r = map[s][map[s].length - 1];
				let lastAdded = r[r.length - 1];
				let t = idx - lastAdded.x;
				if(t === 1) {
					map[s].forEach(l => l.push({x: idx, y: i}));
				} else if (t === 0){
					let moreLines = WinLinesLogic._copyPrevLines(map[s], idx, i, idx < screen.length - 1);
					map[s] = [...map[s], ...moreLines];
				} else {
					map[s] = map[s].filter(line => line.length >= WinLinesLogic.minAmount);
					if (!map[s].length) {
						delete map[s];
					}
				}
			}
		}
		WinLinesLogic._collectWinLines(map, ++idx, screen);
	}

	static getWinLines(screen) {
		let map = {};
		let idx  = 0;

		let reel = screen[idx];
		for(let i = 0; i < reel.length; i++) {
			let s = reel[i];
			if(s === null) {
				continue;
			}
			if(!map[s]) {
				map[s] = [];
			}
			let l = [];
			l.isUnique = true;
			l.push({x: idx, y: i});
			map[s].push(l);
		}
		WinLinesLogic._collectWinLines(map, ++idx, screen);
		WinLinesLogic._removeUnfullLines(map);
		return map;
	}

	static filterLines(arr) {
		let res = [...arr[0]];

		for (let i = 1; i < arr.length; ++i) {
			let l = arr[i];
			l.forEach(p => {
				if(res.findIndex(pp => {
					return pp.x === p.x && pp.y === p.y
				}) === -1) {
					res.push(p);
				}
			})
		}

		return res;
	}

	static getUniqueWinSymbols(lines) {
		const symbols = [];
		for(let key in lines) {
			symbols.push(...WinLinesLogic.filterLines(lines[key]));
		}
		return symbols;
	}
}
