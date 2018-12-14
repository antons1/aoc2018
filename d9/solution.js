let inputs = [
    [9, 32],
    [10, 1618],
    [13, 7999],
    [17, 1104],
    [21, 6111],
    [30, 5807],
    [403, 71920]
];

function node(value, prev, next) { return { value, prev, next } }

function runGame([playersNo, lastScore]) {
    const players = new Array(playersNo).fill(0);
    const circle = node(0, null, null);
    circle.prev = circle.next = circle;
    const metadata = {
        currentPlayer: 1,
        activeMarble: circle,
        nextMarble: 1,
        currentScore: 0,
        lastScore
    }

    while(metadata.nextMarble <= metadata.lastScore * 100) {
        if(metadata.nextMarble % 23 === 0) doPointRound(circle, players, metadata);
        else doRegularRound(circle, players, metadata);
        //console.log (metadata.activeMarble.value, metadata.activeMarble.next.value, metadata.activeMarble.prev.value);
    }

    console.log(metadata.nextMarble-1, metadata.lastScore, players.reduce(getHighestScore, { currentHighest: 0, currentPlayer: 0 }), (players[314] ? players[314] : ":("));
}

function doRegularRound(circle, players, metadata) {
    const nextOne = metadata.activeMarble.next;
    const afterThat = metadata.activeMarble.next.next;
    metadata.activeMarble = node(metadata.nextMarble++, nextOne, afterThat);
    nextOne.next = metadata.activeMarble;
    afterThat.prev = metadata.activeMarble;

    metadata.currentPlayer++;
    if(metadata.currentPlayer >= players.length) metadata.currentPlayer = 0;
}

function doPointRound(circle, players, metadata) {
    let toRemove = metadata.activeMarble;
    for(let i = 0; i < 7; i++) {
        toRemove = toRemove.prev;
    }

    metadata.currentScore = toRemove.value + metadata.nextMarble++;
    players[metadata.currentPlayer] += metadata.currentScore;

    metadata.activeMarble = toRemove.next;
    toRemove.prev.next = toRemove.next;

    metadata.currentPlayer++;
    if(metadata.currentPlayer >= players.length) metadata.currentPlayer = 0;
}

function getHighestScore(total, current, index) { return current > total.currentHighest ? { currentHighest: current, currentPlayer: index } : total }

inputs.forEach(runGame);