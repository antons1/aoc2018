const serialNumber = 6548;

function calculatePowerLevel(x, y, serial) {
    let id = x + 10;
    let powerLevelStart = id * y;
    let addedSerial = powerLevelStart + serial;
    let multiplied = addedSerial * id;
    let word = multiplied.toString().split('');
    if(word.length < 3) return 0;
    let centDigitLetter = word.slice(-3, -2);
    let centDigit = parseInt(centDigitLetter[0]);
    return centDigit - 5;
}

const grid = [];
let highest = Number.MIN_SAFE_INTEGER;
let xy = { x: 0, y: 0 };
let size = 0;

function findSquareValue(x, y, grid, size) {
    let sum = 0;
    for(let i = x; i < x+size; i++) {
        for(let j = y; j < y+size; j++) {
            sum += grid[i][j];
        }
    }
    return { sum, coords: { x, y }, sz: size };
}

for(let i = 0; i < 300; i++) {
    grid[i]= [];
    for(j = 0; j < 300; j++) {
        grid[i][j] = calculatePowerLevel(i, j, serialNumber);
        for(let k = 0; k < 300; k++) {
            if(i > k && j > k) {
                let { sum, coords, sz } = findSquareValue(i-k, j-k, grid, k);
                highest = Math.max(highest, sum);
                if(highest === sum) {
                    xy = coords;
                    size = sz;
                }
            }
        }
    }
}

console.log(highest, xy, size);