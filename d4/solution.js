const input = require('./input.js');
/*const input = [
    "[1518-11-01 00:00] Guard #10 begins shift",
    "[1518-11-01 00:05] falls asleep",
    "[1518-11-01 00:25] wakes up",
    "[1518-11-01 00:30] falls asleep",
    "[1518-11-01 00:55] wakes up",
    "[1518-11-01 23:58] Guard #99 begins shift",
    "[1518-11-02 00:40] falls asleep",
    "[1518-11-02 00:50] wakes up",
    "[1518-11-03 00:05] Guard #10 begins shift",
    "[1518-11-03 00:24] falls asleep",
    "[1518-11-03 00:29] wakes up",
    "[1518-11-04 00:02] Guard #99 begins shift",
    "[1518-11-04 00:36] falls asleep",
    "[1518-11-04 00:46] wakes up",
    "[1518-11-05 00:03] Guard #99 begins shift",
    "[1518-11-05 00:45] falls asleep",
    "[1518-11-05 00:55] wakes up"
]*/

const entries = [];

function compareDates(e1, e2) {
    if(e1.year < e2.year) return true;
    else if(e1.year > e2.year) return false;

    if(e1.month < e2.month) return true;
    else if(e1.month > e2.month) return false;

    if(e1.day < e2.day) return true;
    else if(e1.day > e2.day) return false;

    if(e1.hour < e2.hour) return true;
    else if(e1.hour > e2.hour) return false;

    if(e1.minute < e2.minute) return true;
    else if(e1.minute > e2.minute) return false;

    return true;
}

function parseLogEntry(entry, index) {
    const match = entry.match(/^\[(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2})\]\s([^#]+\s#?(\d+)?[^#]+)$/)
    const [ m, year, month, day, hour, minute, text, guardId ] = match;
    const logEntry = {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: parseInt(hour),
        minute: parseInt(minute),
        text,
        guardId: guardId ? parseInt(guardId) : null
    }

    if(entries.length === 0) entries.push(logEntry);
    else {
        for(let i = 0; i < entries.length; i++) {
            if(compareDates(logEntry, entries[i])) {
                entries.splice(i, 0, logEntry);
                break;
            } else if(i === entries.length-1) {
                entries.push(logEntry);
                break;
            }
        }
    }
}

input.forEach(parseLogEntry);

const times = [];
let currentGuard = -1;
let fellAsleep = -1;

for(let i = 0; i < entries.length; i++) {
    let entry = entries[i];
    if(entry.guardId) currentGuard = entry.guardId;
    if(!times[currentGuard]) times[currentGuard] = []
    if(/falls/.test(entry.text)) fellAsleep = entry.minute;
    else if(/wakes/.test(entry.text)) {
        for(let j = fellAsleep; j < entry.minute; j++) {
            times[currentGuard][j] ? times[currentGuard][j]++ : times[currentGuard][j] = 1;
        }
    }
}

let longest = { totalTime: 0 };

const aggregated = times.map((time, id) => {
    const totalTime = time.reduce((total, current) => total + current, 0);
    const mostMinute = (() => {
        let biggest = -1;
        let biggestInd = -1;
        time.forEach((t, i) => {
            if(t > biggest) { biggest = t; biggestInd = i; }
        })
        return biggestInd;
    })();

    if(totalTime > longest.totalTime) {
        longest.totalTime = totalTime;
        longest.id = id;
        longest.minute = mostMinute;
    }
    return {totalTime, mostMinute};
});

const frequent = { frequency: 0 };
const aggregated2 = times.map((time, id) => {
    const frequentMinute = (() => {
        let mostFrequent = -1;
        let mostFrequentId = -1;
        time.forEach((t, i) => {
            if(t > mostFrequent) {
                mostFrequent = t;
                mostFrequentId = i;
            }
        });
        return {mostFrequent, mostFrequentId};
    })()
    if(frequentMinute.mostFrequent > frequent.frequency) {
        frequent.frequency = frequentMinute.mostFrequent;
        frequent.id = id;
        frequent.minute = frequentMinute.mostFrequentId
    }
});

console.log(longest.id * longest.minute);
console.log(frequent.id * frequent.minute);