"use strict"
const fs = require('fs');
const uuidv1 = require('uuid/v4');

const rawInputString = fs.readFileSync('./input.txt', 'utf8');
const rawTracks = rawInputString.split('\n').map((row) => row.replace(/\r/g, '').split(''));

const trackTypes = {
    CROSS: '+',
    RIGHTDOWN: '/',
    LEFTDOWN: '\\',
    LEFTRIGHT: '-',
    UPDOWN: '|',
    UPCART: '^',
    RIGHTCART: '>',
    LEFTCART: '<',
    DOWNCART: 'v'
}

const turnTypes = {
    LEFT: 0,
    STRAIGHT: 1,
    RIGHT: 2
}

function isTurn(track) {
    return track.descriptor === trackTypes.CROSS || track.descriptor === trackTypes.RIGHTDOWN || track.descriptor === trackTypes.LEFTDOWN;
}

let cars = [];

function newCar(descriptor, track, cars, x, y) {
    const car = {
        direction: descriptor,
        track,
        turn: turnTypes.LEFT,
        x,
        y,
        uuid: uuidv1()
    }

    if(!cars[x]) cars[x] = [];
    cars[x][y] = car;
    track.cars.push(car);
}

function newTrack(descriptor, grid, x, y, cars) {
    const connected = { up: null, down: null, left: null, right: null };
    const track = {
        descriptor,
        connected,
        x,
        y,
        cars: [],
        uuid: uuidv1()
    }

    const left = grid[x][y-1] || null;
    const right = grid[x][y+1] || null;
    const up = grid[x-1] ? grid[x-1][y] : null;
    const down = grid[x+1] ? grid[x+1][y] : null;

    switch(descriptor) {
        case trackTypes.CROSS:
        if(connectedExists(left)) {
            left.connected.right = track
            track.connected.left = left;
        }
        if(connectedExists(up)) {
            up.connected.down = track;
            track.connected.up = up;
        }
        break;
        
        case trackTypes.LEFTDOWN:
        case trackTypes.RIGHTDOWN:
        if(connectedExists(left)) {
            left.connected.right = track
            track.connected.left = left;
        }
        if(connectedExists(up)) {
            up.connected.down = track;
            track.connected.up = up;
        }
        break;

        case trackTypes.RIGHTCART:
        case trackTypes.LEFTCART:
        newCar(descriptor, track, cars, x, y);
        track.descriptor = trackTypes.LEFTRIGHT;
        case trackTypes.LEFTRIGHT:
        if(connectedExists(left)) {
            left.connected.right = track
            track.connected.left = left;
        }
        break;
        
        case trackTypes.UPCART:
        case trackTypes.DOWNCART:
        newCar(descriptor, track, cars, x, y);
        track.descriptor = trackTypes.UPDOWN;
        case trackTypes.UPDOWN:
        if(connectedExists(up)) {
            up.connected.down = track;
            track.connected.up = up;
        }
        break;
    }

    if(descriptor !== ' ') grid[x][y] = track;
    else grid[x][y] = null;
}

function connectedExists(potentialTrack) {
    if(potentialTrack === null) return false;
    return typeof potentialTrack === 'object' ? true : false;
}

function performTick(carsInp) {
    const newCars = new Array(carsInp.length);
    for(let i = 0; i < carsInp.length; i++) {
        if(!carsInp[i]) carsInp[i] = [];
        for(let j = 0; j < carsInp[i].length; j++) {
            if(carsInp[i] && carsInp[i][j]) moveCar(carsInp[i][j], newCars);
        }
    }
    cars = newCars;
}

function alternativePerformTick(tracks) {
    for(let x = 0; x < tracks.length; x++) {
        for(let y = 0; y < tracks.length; y++) {
            if(tracks[x][y]) {
                console.log(tracks[x][y].descriptor, tracks[x][y].cars.length > 0 ? tracks[x][y].cars : 'emtpy')
                if(tracks[x][y].cars.length > 0) {
                    moveCar(tracks[x][y].cars[0], cars);
                }
            }
        }
    }
}

function moveCar(car, newCars) {
    let next = getNextTrack(car);
    console.log("Moving", car.uuid, car.direction, car.x, car.y, car.turn);
    if(car.track.descriptor === trackTypes.CROSS) {
        console.log("Cross");
        next = getNextInCross(car, car.track);
        car.turn++;
        if(car.turn >= Object.keys(turnTypes).length) car.turn = 0;
    } else if(isTurn(car.track)) {
        console.log("Turn");
        // Turn logic
        next = getNextAfterTurn(car, car.track);
    } else console.log("Straight");
    // Straight logic
    slideCar(car, next, newCars);
}

function getNextInCross(car, next) {
    if(car.turn === turnTypes.LEFT) {
        if(car.direction === trackTypes.UPCART) {
            car.direction = trackTypes.LEFTCART;
            return next.connected.left;
        }
        else if(car.direction === trackTypes.DOWNCART) {
            car.direction = trackTypes.RIGHTCART;
            return next.connected.right;
        }
        else if(car.direction === trackTypes.LEFTCART) {
            car.direction = trackTypes.DOWNCART;
            return next.connected.down;
        }
        else if(car.direction === trackTypes.RIGHTCART) {
            car.direction = trackTypes.UPCART;
            return next.connected.up;
        }
    } else if(car.turn === turnTypes.STRAIGHT) {
        if(car.direction === trackTypes.UPCART) {
            car.direction = trackTypes.UPCART;
            return next.connected.up;
        }
        else if(car.direction === trackTypes.DOWNCART) {
            car.direction = trackTypes.DOWNCART;
            return next.connected.down;
        }
        else if(car.direction === trackTypes.LEFTCART) {
            car.direction = trackTypes.LEFTCART;
            return next.connected.left;
        }
        else if(car.direction === trackTypes.RIGHTCART) {
            car.direction = trackTypes.RIGHTCART;
            return next.connected.right;
        }
    } else if(car.turn === turnTypes.RIGHT) {
        if(car.direction === trackTypes.UPCART) {
            car.direction = trackTypes.RIGHTCART;
            return next.connected.right;
        }
        else if(car.direction === trackTypes.DOWNCART) {
            car.direction = trackTypes.LEFTCART;
            return next.connected.left;
        }
        else if(car.direction === trackTypes.LEFTCART) {
            car.direction = trackTypes.UPCART;
            return next.connected.up;
        }
        else if(car.direction === trackTypes.RIGHTCART) {
            car.direction = trackTypes.DOWNCART;
            return next.connected.down;
        }
    }
}

function slideCar(car, next, newCars) {
    car.track.cars.splice(car.track.cars.indexOf(car), 1);
    //console.log(car);
    //console.log(car.track);
    car.track = next;
    //console.log(next);
    const originalx = car.x;
    const originaly = car.y;
    car.x = next.x;
    car.y = next.y;
    if(!newCars[next.x]) newCars[next.x] = [];
    newCars[next.x][next.y] = car;
    next.cars.push(car);
    if(next.cars.length > 1) {
        console.log("CRASH!!!");
        if(newCars[next.x]) newCars[next.x][next.y] = null;
        if(newCars[originalx]) newCars[originalx][originaly] = null;
        if(cars[next.x]) cars[next.x][next.y] = null;
        if(cars[originalx]) cars[originalx][originaly] = null;
        next.cars = [];
        console.log(`Crash at ${car.y},${car.x}`);
    }
}

function getNextAfterTurn(car, next) {
    if(next.descriptor === trackTypes.RIGHTDOWN) {
        // -> / <-
        if(car.direction === trackTypes.UPCART) {
            car.direction = trackTypes.RIGHTCART;
            return next.connected.right;
        }
        else if(car.direction === trackTypes.DOWNCART) {
            car.direction = trackTypes.LEFTCART;
            return next.connected.left;
        }
        else if(car.direction === trackTypes.LEFTCART) {
            car.direction = trackTypes.DOWNCART;
            return next.connected.down;
        }
        else if(car.direction === trackTypes.RIGHTCART) {
            car.direction = trackTypes.UPCART;
            return next.connected.up;
        }
    } else if(next.descriptor === trackTypes.LEFTDOWN) {
        // -> \ <-
        if(car.direction === trackTypes.UPCART) {
            car.direction = trackTypes.LEFTCART;
            return next.connected.left;
        }
        else if(car.direction === trackTypes.DOWNCART) {
            car.direction = trackTypes.RIGHTCART;
            return next.connected.right;
        }
        else if(car.direction === trackTypes.LEFTCART) {
            car.direction = trackTypes.UPCART;
            return next.connected.up;
        }
        else if(car.direction === trackTypes.RIGHTCART) {
            car.direction = trackTypes.DOWNCART;
            return next.connected.down;
        }
    }
}

function getNextTrack(car) {
    switch(car.direction) {
        case trackTypes.UPCART:
        return car.track.connected.up;

        case trackTypes.DOWNCART:
        return car.track.connected.down;

        case trackTypes.LEFTCART:
        return car.track.connected.left;

        case trackTypes.RIGHTCART:
        return car.track.connected.right;

        default:
        console.log("HUH?!?!?");
    }
}

for(let i = 0; i < rawTracks.length; i++) {
    for(let j = 0; j < rawTracks[i].length; j++) {
        newTrack(rawTracks[i][j], rawTracks, i, j, cars);
    }
}

//printMap(rawTracks);
for(let i = 0; i < 1000000; i++) {
    let amountOfCarsLeft = cars.reduce((tot, carLine) => {
        tot += carLine.reduce((t, car) => {
            if(car !== null && typeof car !== 'undefined') t++;
            return t;
        }, 0);
        return tot;
    }, 0);
    console.log(amountOfCarsLeft);
    if(amountOfCarsLeft <= 1) {
        performTick(cars);
        console.log(`Only 1 car left. Ending simulation`);
        break;
    }
    console.log(i);
    //printMap(rawTracks);
    try{
        performTick(cars);
    } catch(err) {
        console.log(err);
        break;
    }
}
printMap(rawTracks);

function printMap(rawTracks) {
    for(let i = 0; i < rawTracks.length; i++) {
        let line = i + '\t';
        for(let j = 0; j < rawTracks[i].length; j++) {
            if(rawTracks[i][j]) {
                if(rawTracks[i][j].cars.length > 1) {
                    line += 'X';
                } else if (rawTracks[i][j].cars.length > 0) {
                    line += rawTracks[i][j].cars[0].direction;
                } else {
                    line += rawTracks[i][j].descriptor;
                }
            } else line += ' ';
        }
        console.log(line);
    }
}