const input = require('./input.js');
/*const input = [
    "Step C must be finished before step A can begin.",
    "Step C must be finished before step F can begin.",
    "Step A must be finished before step B can begin.",
    "Step A must be finished before step D can begin.",
    "Step B must be finished before step E can begin.",
    "Step D must be finished before step E can begin.",
    "Step F must be finished before step E can begin."
];*/

// Functions
function getToAndFrom(str, ind) {
    const m = str.match(/^Step (.) must be finished before step (.) can begin\.$/);
    return [m[1], m[2]];
}

function getEmptyStep() {
    return { prerequisite: [], follows: [], performed: false, picked: false };
}

function reduceToFromToMap(map, [from, to]) {
    if(!map[from]) map[from] = getEmptyStep();
    if(!map[to]) map[to] = getEmptyStep();

    map[from].follows.push(map[to]);
    map[to].prerequisite.push(map[from]);
    return map;
}

function getAvailableSteps(available, steps) {
    const newAvailable = Object.keys(steps).filter((key) => steps[key].prerequisite.length === 0 && !steps[key].performed && !steps[key].picked);
    newAvailable.forEach((key) => steps[key].picked = true);
    return available.concat(newAvailable).sort();
}

function performStep(done, steps, available) {
    const performing = available.shift();
    if(!performing) return;

    steps[performing].follows.forEach((step) => step.prerequisite.splice(step.prerequisite.indexOf(steps[performing]), 1));
    steps[performing].performed = true;

    done.push(performing);
}

function assignToWorker(worker, letter) {
    worker.workingOn = letter;
    worker.timeLeft = letter.toLowerCase().charCodeAt(0) - 96 +60;
}

let available = [];
const done = [];
const workers = ((amount) => {
    let result = [];
    for(let i = 0; i < amount; i++) result[i] = { workingOn: null, timeLeft: 0 };
    return result;
})(5);

// Do It!
const toAndFrom = input.map(getToAndFrom);
const stepMap = toAndFrom.reduce(reduceToFromToMap, {});
let second = -1;
do {
    second++;
    workers.forEach((worker) => worker.workingOn ? worker.timeLeft-- : null);
    workers.forEach((worker) => {
        if(worker.timeLeft === 0 && worker.workingOn) {
            done.push(worker.workingOn);
            stepMap[worker.workingOn].follows.forEach((step) => step.prerequisite.splice(step.prerequisite.indexOf(stepMap[worker.workingOn]), 1));
            stepMap[worker.workingOn].performed = true;
            worker.workingOn = null;
        }
    })
    available = getAvailableSteps(available, stepMap);
    workers.forEach((worker) => {
        if(!worker.workingOn) {
            const newWork = available.shift();
            if(newWork) {
                assignToWorker(worker, newWork);
            }
        }
    });
    console.log(workers.reduce((acc, work) => acc + work.workingOn + ' (' + work.timeLeft + ') ', second + ': '));
} while((available.length > 0 || workers.filter((worker) => worker.workingOn).length > 0));

console.log(done.join(''), second);