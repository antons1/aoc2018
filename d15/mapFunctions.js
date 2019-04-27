const uuid = require('uuid/v4'); 

const symbols = {
    WALL: '#',
    EMPTY: '.',
    GOBLIN: 'G',
    ELF: 'E'
}

function mapSymbolsToObjects(symbol, y, x) {
    switch(symbol) {
        case symbols.WALL:
        return {
            symbol,
            y,
            x
        };

        case symbols.EMPTY:
        return {
            symbol,
            y,
            x
        };

        case symbols.GOBLIN:
        return {
            symbol,
            uuid: uuid(),
            y,
            x
        };

        case symbols.ELF:
        return {
            symbol,
            uuid: uuid(),
            y,
            x
        };
    }
}

function addLinksToMap(m) {
    for(let y = 0; y < m.length; y++) {
        for(let x = 0; x < m[y].length; x++) {
            m[y][x].adj = {
                up: m[y-1] && m[y-1][x] ? m[y-1][x] : null,
                right: m[y][x+1] ? m[y][x+1] : null,
                down: m[y+1] && m[y+1][x] ? m[y+1][x] : null,
                left: m[y][x-1] ? m[y][x-1] : null
            }
        }
    }
}

function printMap(m) {
    for(let i = 0; i < m.length; i++) {
        let line = i + '\t';
        for(let j = 0; j < m[i].length; j++) {
            line += m[i][j].symbol;
        }
        console.log(line);
    }
}

function moveUnit(unit, nextStep, m) {
    let uy = unit.y;
    let ux = unit.x;
    let ny = nextStep.y;
    let nx = nextStep.x;

    m[uy][ux] = nextStep;
    m[ny][nx]= unit;
    
    unit.x = nx;
    unit.y = ny;
    nextStep.x = ux;
    nextStep.y = uy;
    
    /*m[uy][ux].adj = {
        up: m[uy-1] && m[uy-1][ux] ? m[uy-1][ux] : null,
        right: m[uy][ux+1] ? m[uy][ux+1] : null,
        down: m[uy+1] && m[uy+1][ux] ? m[uy+1][ux] : null,
        left: m[uy][ux-1] ? m[uy][ux-1] : null
    }

    m[ny][nx].adj = {
        up: m[ny-1] && m[ny-1][nx] ? m[ny-1][nx] : null,
        right: m[ny][nx+1] ? m[ny][nx+1] : null,
        down: m[ny+1] && m[ny+1][nx] ? m[ny+1][nx] : null,
        left: m[ny][nx-1] ? m[ny][nx-1] : null
    }*/
}

module.exports = {
    symbols,
    mapSymbolsToObjects,
    printMap,
    addLinksToMap,
    moveUnit
}