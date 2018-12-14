const input = require('./input.js');
/*const input = [
    "1, 1",
    "1, 6",
    "8, 3",
    "3, 4",
    "5, 5",
    "8, 9"
];*/

// Functions
const getManhattanDistance = ([p1, p2], [q1, q2]) => Math.abs(p1-q1)+Math.abs(p2-q2);

function parseCoordinate(rawCoordinate, index) {
    let [x, y] = rawCoordinate.replace(/\s/, '').split(',');
    return {
        coords: [parseInt(x), parseInt(y)],
        nearest: 0,
        infinite: false,
        name: index
    }
}

function getKnownArea(points) {
    let bigX = 0;
    let bigY = 0;

    points.forEach((point) => {
        bigX = Math.max(bigX, point.coords[0]);
        bigY = Math.max(bigY, point.coords[1]);
    });

    return [bigX, bigY];
}

function traverseGrid(grid, points, width, height) {
    let closeRegion = 0;
    for(let i = 0; i <= width; i++) {
        for(let j = 0; j <= height; j++) {
            const closest = getClosestPoint(points, [i, j]);
            if(isWithinCloseRegion([i, j], points, 10000)) closeRegion++;
            if(!grid[i]) grid[i] = [];
            if(closest === null) grid[i][j] = '.';
            else {
                grid[i][j] = closest.name;
                closest.nearest++;
                if(i === 0 || j === 0 || i === width || j === height) {
                    closest.infinite = true;
                }
            }
        }
    }
    return closeRegion;
}

function getClosestPoint(points, [cx, cy]) {
    let closest = null;
    let distance = -1;
    let withThisDistance = 0;
    for(let k = 0; k < points.length; k++) {
        const currentDistance = getManhattanDistance(points[k].coords, [cx, cy]);
        if(currentDistance < distance || distance === -1) {
            closest = points[k];
            distance = currentDistance;
            withThisDistance = 1;
        } else if (currentDistance === distance) {
            withThisDistance++;
        }
    }

    if(withThisDistance > 1) return null
    else return closest;
}

function isWithinCloseRegion([cx, cy], points, limit) {
    let totalManhattan = points.reduce((acc, p) => acc + getManhattanDistance([cx, cy], p.coords), 0);
    if (totalManhattan < limit) return true;
    else return false;
}

function drawGrid(grid) {
    console.log(grid.reduce((oAcc, row) => {
        return oAcc + row.reduce((acc, point) => {
            return acc + point + ' ';
        }, '') + '\n';
    }, ''));
}

function getBiggestNonInfiniteArea(points) {
    const finitePoints = points.filter((val) => !val.infinite);
    let biggest = 0
    for(let i = 0; i < finitePoints.length; i++) {
        biggest = Math.max(biggest, finitePoints[i].nearest);
    }
    return biggest
}

// Setup
const points = input.map(parseCoordinate);
const [width, height] = getKnownArea(points);
const grid = [];

// Running
let closeRegion = traverseGrid(grid, points, width, height);
//drawGrid(grid);
let biggestPoint = getBiggestNonInfiniteArea(points);
console.log(biggestPoint, closeRegion);