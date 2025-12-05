import assert from 'node:assert';
import fs from 'node:fs';
const fileName = process.argv[2];
const split = fs.readFileSync(fileName as string, 'utf8').split("\n\n");
assert.equal(split.length, 2)
assert(split[0] && split[1])

const ranges: range[] = split[0]
    .split("\n")
    .map(i => i.split("-"))
    .map(rs => [parseInt(rs[0] || "", 10), parseInt(rs[1] || "", 10)] as range)


const numbers = split[1]
    .split('\n')
    .filter(line => line !== "")
    .map(line => parseInt(line, 10));


const part1 = numbers.filter(num => ranges.find(r => inRange(r, num))).length

console.log(part1)

type range = readonly [number, number];

const freshCount = ranges
    .reduce<range[]>((mergedRanges, el) => {
        let foundIdx = mergedRanges.findIndex(r => overlaps(r, el));
        let curRange = el;
        while (foundIdx >= 0) {
            const mergeMin = Math.min(...[...mergedRanges[foundIdx] as range, ...curRange]);
            const mergeMax = Math.max(...[...mergedRanges[foundIdx] as range, ...curRange]);
            curRange = [mergeMin, mergeMax];
            mergedRanges.splice(foundIdx, 1)
            foundIdx = mergedRanges.findIndex(r => overlaps(r,curRange))
        }
        mergedRanges.push(curRange)
        return mergedRanges;
    }, [])
    .reduce((sum, r) => sum + r[1] - r[0] + 1, 0);
console.log(freshCount);



function overlaps(r: range, el: range): unknown {
    return inRange(r, el[0]) || inRange(r, el[1]) || inRange(el, r[0]) || inRange(el, r[1]);
}

function inRange(r: range, num: number): boolean {
    return r[0] <= num && r[1] >= num;
}
