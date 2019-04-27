const inputs = [
    [9, "5158916779"],
    [5, "0124515891"],
    [18, "9251071085"],
    [2018, "5941429882"],
    [513401, "?"]
];

const inputs2 = [
    [9, "51589"],
    [5, "01245"],
    [18, "92510"],
    [2018, "59414"],
    [513401, "513401"]
]

function doRun([result, target]) {
    let recipes = '37';
    let elves = [0, 1];
    let x = 0;

    while(recipes.length < result+10) {
        recipes += (parseInt(recipes.charAt(elves[0])) + parseInt(recipes.charAt(elves[1]))).toString();
        elves[0] = (parseInt(recipes[elves[0]]) + 1 + elves[0]) % recipes.length;
        elves[1] = (parseInt(recipes[elves[1]]) + 1 + elves[1]) % recipes.length;
        x++;
        if(x%1000 === 0) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write('Scanned ' + x + ' recipe rounds');
        }
    }
    console.log();
    console.log(recipes.substr(recipes.length-10));
}

function doRunPart2([result, target]) {
    let recipes = '37';
    let elves = [0, 1];
    const targetReg = new RegExp(target);
    let x = 0;

    while(!(targetReg.test(recipes.substr(recipes.length-target.length)))) {
        recipes += (parseInt(recipes.charAt(elves[0])) + parseInt(recipes.charAt(elves[1]))).toString();
        elves[0] = (parseInt(recipes[elves[0]]) + 1 + elves[0]) % recipes.length;
        elves[1] = (parseInt(recipes[elves[1]]) + 1 + elves[1]) % recipes.length;
        x++;
        if(x%1000 === 0) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write('Scanned ' + x + ' recipe rounds');
        }
    }
    console.log("Found target at", x, "rounds", recipes.length-target.length);

}

inputs.forEach(doRun);
inputs2.forEach(doRunPart2);