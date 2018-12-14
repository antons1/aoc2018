const input = require('./input.js');
const _ = require('lodash');
//const input = 'dabAcCaCBAcCcaDA';

const inputArray = input.split('');
const uniqueUnits = _.uniq(input.toUpperCase().split(''));

function removeAndReduce(polymer, uniqueUnits) {
    const results = uniqueUnits.map((unit) => {
        const remInputArray = _.filter(inputArray, (un) => un != unit && un != unit.toLowerCase());
        const length = reducePolymer(remInputArray);
        return {unit, length};
    });

    console.log(results);
}

function reducePolymer(polymer) {
    let i = 0;
    while(true) {
        if(i >= polymer.length-1) break;
        if(compareUnits(polymer[i], polymer[i+1])) {
            //console.log('removing');
            polymer.splice(i, 2);
            
            if(i !== 0) i--;

            continue;
        }
        
        i++;
    }

    return polymer.length;
}

function compareUnits(a, b) {
    //console.log("comparing", a, b);
    if(a === b) return false;
    else if(a.toUpperCase() === b.toUpperCase()) return true;
    else return false;
}

removeAndReduce(inputArray, uniqueUnits);

//reducePolymer(inputArray);
//const reaction = inputArray.join('');

//console.log(inputArray.length);
//console.log(reaction);