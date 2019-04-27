const fs = require('fs');
const { symbols, mapSymbolsToObjects, printMap, addLinksToMap, moveUnit } = require('./mapFunctions.js');

const input = fs.readFileSync('testinput1.txt', 'utf8')
                .split('\n')
                .map((line, y) =>
                    line.replace('\r', '')
                        .split('')
                        .map((part, x) =>
                            mapSymbolsToObjects(part, y, x)));

function buildActionList(m) {
    const actionList = [];
    for(let i = 0; i < m.length; i++) {
        for(let j = 0; j < m[i].length; j++) {
            if(m[i][j].symbol === symbols.ELF || m[i][j].symbol === symbols.GOBLIN) actionList.push(m[i][j]);
        }
    }
    return actionList;
}

function getEnemies(units, unitType) {
    return units.reduce((tot, unit) => {
        if(unit.symbol !== unitType) tot.push(unit);
        return tot;
    },[])
}

function findAllAdjacentPositions(enemies, m, symbols) {
    return enemies.reduce((total, enemy) => {
        [[enemy.x-1, enemy.y], [enemy.x+1, enemy.y], [enemy.x, enemy.y-1], [enemy.x, enemy.y+1]].forEach(([x, y]) => {
            if(m[y][x] && m[y][x].symbol === symbols.EMPTY) total.push(m[x][y]);
        });
        return total;
    }, [])
}

function findAdjacentEnemies(unit, m, x, y, symbols) {
    return [[y-1, x], [y, x-1], [y, x+1], [y+1, x]].reduce((total, [y, x]) => {
        if(m[y][x] && isUnit(m[y][x], symbols) && m[y][x].symbol !== unit.symbol) total.push(m[y][x]);
        return total;
    }, [])
}

function isUnit(unit, symbols) {
    return unit.symbol === symbols.ELF || unit.symbol === symbols.GOBLIN;
}

function findShortestPath(m, source, targets) {
    const Q = [];
    for(let y = 0; y < m.length; y++) {
        for(let x = 0; x < m[y].length; x++) {
            Q.push(m[y][x]);
            m[y][x].dist = y === source.y && x === source.x ? 0 : Infinity;
            m[y][x].prev = undefined;
        }
    }

    Q.sort((a, b) => a.dist - b.dist);
    
    while(Q.length > 0) {
        const u = Q.shift();
        
        Object.keys(u.adj).forEach((a) => {
            let v = u.adj[a];
            if(!v) return;
            let weight = Infinity;
            if(a === 'up') weight = 1;
            else if(a === 'left') weight = 2;
            else if(a === 'right') weight = 3;
            else if(a === 'down') weight = 4;
            let dist = u.dist + weight;
            if(v.symbol === '.' && dist < v.dist) {
                v.dist = dist;
                v.prev = u;
            }
        });
        Q.sort((a, b) => a.dist - b.dist);
    }

    return m;
}

function findNextStep(origin, current) {
    if(origin.y === 6 && origin.x === 6) {
        console.log([current.x, current.y, current.dist, current.symbol, current.prev]);
    }
    if(current.prev === origin) return current;
    else return findNextStep(origin, current.prev);
}

function doTurn(unit, units, m, symbols) {
    addLinksToMap(m);
    findShortestPath(m, unit, []);
    const enemies = getEnemies(units, unit.symbol);
    const adjacentPositions = findAllAdjacentPositions(enemies, m, symbols);
    const adjacentEnemies = findAdjacentEnemies(unit, m, unit.x, unit.y, symbols);
    if(adjacentEnemies.length > 0) {
        console.log(unit.uuid, unit.symbol, "is attacking");
        adjacentEnemies.sort((a, b) => {
            if(a.dist !== b.dist) return a.dist - b.dist;
            else if(a.y !== b.y) return a.y - b.y;
            else if(a.x !== b.x) return a.x - b.x;
            else return 0;
        });
        //Perform attack
        return;
    } else if(adjacentPositions.length > 0) {
        //Try to move
        adjacentPositions.sort((a, b) => {
            if(a.dist !== b.dist) return a.dist - b.dist;
            else if(a.y !== b.y) return a.y - b.y;
            else if(a.x !== b.x) return a.x - b.x;
            else return 0;
        });
        console.log(unit.x, unit.y);
        const nextStep = findNextStep(unit, adjacentPositions[0]);
        console.log("Moving", unit.uuid, unit.symbol, "from", unit.x, unit.y, "to", nextStep.x, nextStep.y);
        moveUnit(unit, nextStep, m);
        return;
    } else {
        console.log(unit.uuid, unit.symbol, "can neither attack nor move", unit.x, unit.y);
        return;
    }
}

printMap(input);
function doRound(input, symbols) {
    const actionList = buildActionList(input);
    actionList.forEach((unit) => doTurn(unit, actionList, input, symbols));
    printMap(input);
}

doRound(input, symbols);
doRound(input, symbols);
doRound(input, symbols);
doRound(input, symbols);