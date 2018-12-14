const input = require('./input.js');

    /*['abcdef', 'bababc', 'abbcde', 'abcccd', 'aabcdd', 'abcdee', 'ababab'];*/

    /*[
        "abcde",
        "fghij",
        "klmno",
        "pqrst",
        "fguij",
        "axcye",
        "wvxyz"
    ];*/

let twos = 0;
let threes = 0;

input.forEach((val, index) => {
    twos += checkForNs(val, 2);
    threes += checkForNs(val, 3);   
})

function checkForNs(val, n) {
    let res = val.split("").reduce((acc, curr) => {
        if(typeof curr === 'undefined') return;
        acc[curr] ? acc[curr]++ : acc[curr] = 1;
        return acc;
    }, [])
    
    let res2 = Object.keys(res).filter((val) => res[val] === n);

    if(res2.length > 0) return 1;
    else return 0;
}

function compareStrings(str1, str2) {
    let letters1 = str1.split("");
    let letters2 = str2.split("");

    let str3 = "";
    let unlike = 0;

    for(let i = 0; i < letters1.length; i++) {
        if(letters1[i] === letters2[i]) str3 += letters1[i];
        else unlike++;
        if(unlike > 1) break;
    }

    if(unlike === 1) return str3;
    else return null;
}

input.forEach((val1) => input.forEach((val2) => {
    let result = compareStrings(val1, val2);
    if(result !== null) console.log(result);
}))

console.log(`${twos} * ${threes} = ${twos*threes}`);