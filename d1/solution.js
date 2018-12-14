const input = require('./input.js');

const freqs = [];
let foundDup = false;

freqs['+0'] = 1;

function checkNumber(val) {
    const index = `${val < 0 ? '-' : '+'}${val}`
    freqs[index] ? freqs[index]++ : freqs[index] = 1;
    //console.log(freqs);
    if(freqs[index] === 2 && !foundDup) console.log(index);
    if(freqs[index] === 2) return true;
    else return false;
}

let init = 0

for(let i = 0; !foundDup; i++) {
    init += input[i];
    foundDup = checkNumber(init);
    if(i === input.length-1) i = -1;
}