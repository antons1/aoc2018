input = require('./input.js');
const pdbg = false;

/*input = [
    "#..#.#..##......###...###",
    [
        "...## => #",
        "..#.. => #",
        ".#... => #",
        ".#.#. => #",
        ".#.## => #",
        ".##.. => #",
        ".#### => #",
        "#.#.# => #",
        "#.### => #",
        "##.#. => #",
        "##.## => #",
        "###.. => #",
        "###.# => #",
        "####. => #"
    ]
]*/

const initialState = ("....." + input[0] + ".....").split('');
const instructions = input[1].map((str, ind) => {
    const spaceless = str.replace(/\s/g, '');
    const splitUp = spaceless.split('=>');
    return { pattern: splitUp[0], result: splitUp[1] }
});

const generations = {
    initialState,
    nextGen: [],
    generations: [],
    currentGen: [],
    offset: -5
}

generations.generations.push(initialState);
generations.currentGen = initialState;

for(let gen = 0; gen < 192; gen++) {
    generations.nextGen = new Array(generations.currentGen.length).fill('.');

    for(let pot = 0; pot < generations.currentGen.length; pot++) {
        for(let i = 0; i < instructions.length; i++) {
            if(instructions[i].pattern === generations.currentGen.slice(pot, pot+5).join('')) {
                generations.nextGen[pot+2] = instructions[i].result;
                break;
            } else {
                generations.nextGen[pot+2] = generations.nextGen[pot+2] === "#" ? "#" : ".";
            }
        }
    }

    const originalOffset = generations.offset;

    const firstPlant = generations.nextGen.indexOf("#");
    if(firstPlant > 5) {
        for(let i = 0; i < firstPlant - 5; i++) {
            generations.nextGen.shift();
            generations.offset++;
        }
    }
    const lastPlant = generations.nextGen.lastIndexOf("#");
    if(generations.nextGen.length - lastPlant > 5) {
        for(let i = generations.nextGen.length; i > lastPlant+5; i--) {
            generations.nextGen.pop();
        }
    }
    //if(gen%10000 === 0)
        console.log(gen, generations.currentGen.join(''), ((gen/97)*100), "%", generations.nextGen.reduce((total, pot, ind) => {
            if(pot === "#") total += ind+originalOffset;
            return total;
        }, 0) - generations.currentGen.reduce((total, pot, ind) => {
            if(pot === "#") total += ind+generations.offset;
            return total;
        }, 0));
    generations.currentGen = generations.nextGen;
}


function debug(...msgs) {
    if(pdbg) console.log(msgs.reduce((total, msg) => total + " " + msg.toString()));
}

console.log(generations.currentGen.reduce((total, pot, ind) => {
    if(pot === "#") total += ind//+generations.offset;
    return total;
}, 0), generations.offset, generations.currentGen.reduce((total, pot) => {
    if(pot === "#") total++;
    return total;
}, 0), generations.currentGen.reduce((total, pot, ind) => {
    if(pot === "#") total += ind+generations.offset;
    return total;
}, 0));

console.log(49999999912, 49999999912*32, (49999999912*32)+3021);