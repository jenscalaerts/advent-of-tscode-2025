
import fs from 'node:fs';
const fileName = process.argv[2];
const data = fs.readFileSync(fileName as string, 'utf8')
    .trim()
    .split("\n")

console.log(part1())
console.log(part2())


function part1() {
    let lastRow = new Set([data[0].indexOf("S")]);

    let count = 0;
    for (let row = 1; row < data.length; row++) {
        const beams = new Set<number>();

        for (const col of lastRow) {
            if (data[row][col] == "^") {
                count++
                beams.add(col - 1)
                beams.add(col + 1)
            } else {
                beams.add(col)
            }
        }
        lastRow = beams

    }
    return count
}

function part2() {
    return findNumberOfTimeLines(0, data[0].indexOf("S"), new Map(), data);
}

function findNumberOfTimeLines(row: number, col: number, cache: Map<number, number>, data: string[]): number {
    if (row === data.length - 1) {
        return 1;
    }
    const cacheKey = toCacheKey(row, col)
    const cachedValue = cache.get(cacheKey);
    if (cachedValue !== undefined) {
        return cachedValue;
    }
    if (data[row][col] === "^") {
        const result = findNumberOfTimeLines(row + 1, col - 1, cache, data) + findNumberOfTimeLines(row + 1, col + 1, cache, data)
        cache.set(cacheKey, result)
        return result;
    }

    return findNumberOfTimeLines(row + 1, col, cache, data)
}

function toCacheKey(row: number, column: number) {
    return row * 1000 + column
}
