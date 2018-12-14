let inputs = [
    [9, 32],
    [10, 1618],
    [13, 7999],
    [17, 1104],
    [21, 6111],
    [30, 5807]    
];

let current = inputs[0];



function goClockwise(circle, len, metadata) {
    if(circle.length === 0) return 0;
    else {
        let newInd = metadata.currentMarble + len;
        if(newInd >= circle.length) newInd = newInd % circle.length;
        return newInd;
    }
}

function goCounterClockwise(circle, len, metadata) {
    if(circle.length === 0) return 0;
    else {
        let newInd = metadata.currentMarble - len;
        return newInd;
    }
}

function doRound(metadata, players, circle) {
    let newMarble = ++metadata.lastPlacedMarble;
    if(newMarble%23 === 0 && newMarble !== 0) {
        metadata.lastScore = newMarble;
        let removeInd = goCounterClockwise(circle, 7, metadata);
        let removed = circle.splice(removeInd, 1);
        metadata.lastScore += removed[0];
        players[metadata.currentPlayer] += metadata.lastScore;
        metadata.currentMarble = removeInd;
    } else {
        let addInd = goClockwise(circle, 2, metadata);
        if(addInd === 0) addInd = circle.length;
        circle.splice(addInd, 0, newMarble);
        metadata.currentMarble = addInd;
    }
}
let round = 0;


inputs.forEach((current) => {
    const circle = [];
    const players = new Array(current[0]).fill(0);
    const metadata = {
        lastPlacedMarble: -1,
        currentMarble: 0,
        currentPlayer: 0,
        lastScore: 0
    }

    while(metadata.lastScore < current[1]) {
        doRound(metadata, players, circle);
        metadata.currentPlayer++;
        if(circle.length === 44 || circle.length === 45 || circle.length === 46 || circle.length === 47) console.log(circle.slice(5, 20))
        if(metadata.currentPlayer >= players.length) metadata.currentPlayer = 0;
    }
    console.log(metadata.lastScore);
})
