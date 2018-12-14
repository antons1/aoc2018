const readline = require('readline-sync');
/*const input = [
    "position=< 9,  1> velocity=< 0,  2>",
    "position=< 7,  0> velocity=<-1,  0>",
    "position=< 3, -2> velocity=<-1,  1>",
    "position=< 6, 10> velocity=<-2, -1>",
    "position=< 2, -4> velocity=< 2,  2>",
    "position=<-6, 10> velocity=< 2, -2>",
    "position=< 1,  8> velocity=< 1, -1>",
    "position=< 1,  7> velocity=< 1,  0>",
    "position=<-3, 11> velocity=< 1, -2>",
    "position=< 7,  6> velocity=<-1, -1>",
    "position=<-2,  3> velocity=< 1,  0>",
    "position=<-4,  3> velocity=< 2,  0>",
    "position=<10, -3> velocity=<-1,  1>",
    "position=< 5, 11> velocity=< 1, -2>",
    "position=< 4,  7> velocity=< 0, -1>",
    "position=< 8, -2> velocity=< 0,  1>",
    "position=<15,  0> velocity=<-2,  0>",
    "position=< 1,  6> velocity=< 1,  0>",
    "position=< 8,  9> velocity=< 0, -1>",
    "position=< 3,  3> velocity=<-1,  1>",
    "position=< 0,  5> velocity=< 0, -1>",
    "position=<-2,  2> velocity=< 2,  0>",
    "position=< 5, -2> velocity=< 1,  2>",
    "position=< 1,  4> velocity=< 2,  1>",
    "position=<-2,  7> velocity=< 2, -2>",
    "position=< 3,  6> velocity=<-1, -1>",
    "position=< 5,  0> velocity=< 1,  0>",
    "position=<-6,  0> velocity=< 2,  0>",
    "position=< 5,  9> velocity=< 1, -2>",
    "position=<14,  7> velocity=<-2,  0>",
    "position=<-3,  6> velocity=< 2, -1>",
]*/

const input = require('./input.js');

function parsePoint(point, index) {
    [l, initY, initX, speedY, speedX] = point.match(/position=<([\s-\d]\d*),+\s([\s-\d]\d*)> velocity=<([\s-\d]\d*),+\s([\s-\d]\d*)>/)
    return { 
        current: { x: parseInt(initX), y: parseInt(initY) }, 
        speed: { x: parseInt(speedX), y: parseInt(speedY) }
    }
}


function buildCoordinateSystem(points) {
    const minMax = points.reduce(getMinMax, { x: { min: 0, max: 0 }, y: { min: 0, max: 0}});
    const coords = new Array(Math.abs(minMax.x.min) + minMax.x.max + 1);
    for(let i = 0; i < coords.length; i++) {
        coords[i] = new Array(Math.abs(minMax.y.min) + minMax.y.max + 1);
    }
    
    for(let i = 0; i < points.length; i++) {
        const x = points[i].current.x + Math.abs(minMax.x.min);
        const y = points[i].current.y + Math.abs(minMax.y.min);
        coords[x][y] = '#'
    }
    
    return coords;
}

function getMinMax(total, current) {
    total.x.min = Math.min(total.x.min, current.current.x);
    total.x.max = Math.max(total.x.max, current.current.x);
    total.y.min = Math.min(total.y.min, current.current.y);
    total.y.max = Math.max(total.y.max, current.current.y);
    
    return total;
}

function getFilledArea(coordinateSystem) {
    let firstX = -1;
    let firstY = -1;
    let lastX = -1;
    let lastY = -1;

    for(let i = 0; i < coordinateSystem.length; i++) {
        for(let j = 0; j < coordinateSystem[i].length; j++) {
            if(coordinateSystem[i][j] !== null && firstX === -1) {
                firstX = i;
                firstY = j;
            }
            
            lastX = i;
            lastY = j;
        }
    }

    firstX += 10;
    firstY += 10;
    lastX += 10;
    lastY += 10;

    return { firstX, firstY, lastX, lastY };
}

function printSection(coords, { firstX, firstY, lastX, lastY }) {
    for(let i = firstX; i < lastX; i++) {
        let line = '';
        for(let j = firstY; j < lastY; j++) {
            coords[i][j] === '#' ? line += "#" : line += ".";
        }
        console.log(line);
    }
}

function movePoints(points) {
    points.forEach((point) => {
        point.current.x += point.speed.x;
        point.current.y += point.speed.y;
    });
}

const points = input.map(parsePoint);

let shouldContinue = true;
let second = 0;
while(shouldContinue) {
    console.log("Second", second);
    let minMax = points.reduce(getMinMax, { x: { min: 0, max: 0 }, y: { min: 0, max: 0}});
    let answer;
    if(Math.abs(minMax.x.min) + minMax.x.max < 200) {
        console.log(minMax);
        answer = readline.question("Print?");
        if(answer === 'y') {
            coordinateSystem = buildCoordinateSystem(points);
            printSection(coordinateSystem, getFilledArea(coordinateSystem));
        }
    }
    movePoints(points);
    second++;
    if(Math.abs(minMax.x.min) + minMax.x.max < 200) {
        answer = readline.question("Continue?");
        if(answer === "n") break;
        else continue;
    }
}