const input = require('./input.js');

const initialState = ("....." + input[0] + ".....").split('');
const instructions = input[1].reduce((total, str, ind) => {
    const spaceless = str.replace(/\s/g, '');
    const splitUp = spaceless.split('=>');
    total[splitUp[0]] = splitUp[1];
    return total;
}, {});

let currentGeneration = initialState;
let nextGeneration = [];
let zeroLocation = -5;
let oldZeroLocation, rawIndexSum, offsetIndexSum, oldOffsetIndexSum;
console.log(currentGeneration.join(''))

for(let gen = 0; gen < 200; gen++) {
    nextGeneration = new Array(currentGeneration.lastIndexOf("#") + 10).fill('.');
    for(let pot = 2; pot < currentGeneration.length-2; pot++) {
        const ind = currentGeneration.join('').substr(pot-2, 5);
        //console.log(ind, "=>", instructions[ind]);
        nextGeneration[pot] = instructions[ind] ? instructions[ind] : '.';
    }

    let firstPlant = nextGeneration.indexOf("#");
    oldZeroLocation = zeroLocation;
    if(firstPlant > 5) {
        nextGeneration.splice(0, firstPlant-5);
        zeroLocation += firstPlant-5;
    } else if(firstPlant < 5) {
        nextGeneration.splice(0, 0, new Array(Math.abs(firstPlant-5)).fill('.'));
        zeroLocation += firstPlant-5;
    }

    rawIndexSum = nextGeneration.reduce(sumFlowerIndexes, 0);
    offsetIndexSum = nextGeneration.reduce((sum, pot, index) => sumFlowerIndexes(sum, pot, index + zeroLocation), 0.0);
    oldOffsetIndexSum = currentGeneration.reduce((sum, pot, index) => sumFlowerIndexes(sum, pot, index + oldZeroLocation), 0.0);
    console.log(gen, zeroLocation, rawIndexSum, offsetIndexSum, offsetIndexSum-oldOffsetIndexSum, nextGeneration.join(''));
    currentGeneration = nextGeneration;
    const targetGeneration = 50000000000;
    const generationsLeft = targetGeneration - gen;
    const afterTarget = (generationsLeft * ((offsetIndexSum - oldOffsetIndexSum))) + oldOffsetIndexSum;
    console.log(targetGeneration, generationsLeft, afterTarget);
}

function sumFlowerIndexes(sum, pot, index) {
    if(pot === '#') sum += index;
    return sum;
}

