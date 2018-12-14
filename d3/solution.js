const input = require('./input.js');

/*const input = [
    "#1 @ 1,3: 4x4",
    "#2 @ 3,1: 4x4",
    "#3 @ 5,5: 2x2"
];*/

const claims = []
const fabric = []

let fWidth = 0;
let fHeight = 0;

let conflicts = 0;
const complete = {};

function parseClaims(claim) {
    let parsed = claim.match(/^#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+)$/);
    let index = parseInt(parsed[1])
    claims[index] = {
        fromLeft: parseInt(parsed[2]),
        fromTop: parseInt(parsed[3]),
        width: parseInt(parsed[4]),
        height: parseInt(parsed[5])
    };

    if(claims[index].fromLeft + claims[index].width + 1 > fWidth) fWidth = claims[index].fromLeft + claims[index].width + 1;
    if(claims[index].fromTop + claims[index].height + 1 > fHeight) fHeight = claims[index].fromTop + claims[index].height + 1;
}

function constructFabric() {
    for(let i = 0; i < fWidth; i++) {
        fabric[i] = []
        for(let j = 0; j < fHeight; j++) {
            fabric[i].push(".");
        }
    }
}

function printFabric() {
    for(let i = 0; i < fabric.length; i++) {
        let line = ""
        for(let j = 0; j < fabric[i].length; j++) {
            line += typeof fabric[i][j] === 'number' ? "#" : fabric[i][j];
        }
        console.log(line);
    }
}

function handleClaim(claim, index) {
    let conflict = false;
    for(let i = claim.fromTop; i < claim.fromTop + claim.height; i++) {
        for(let j = claim.fromLeft; j < claim.fromLeft + claim.width; j++) {
            if(fabric[i][j] === ".") fabric[i][j] = index;
            else if(typeof fabric[i][j] === 'number') {
                delete complete[fabric[i][j] + ""];
                fabric[i][j] = "X";
                conflicts++;
                conflict = true;
            } else if(fabric[i][j] === "X") conflict = true;
        }
    }
    if(!conflict) complete[index + ""] = true;
}

// Setup
input.forEach(parseClaims);
constructFabric();

// Running
claims.forEach(handleClaim);

// Result
//printFabric();
console.log("Conclicts:", conflicts);
console.log("Complete: ", complete);