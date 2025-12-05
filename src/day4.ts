import fs from 'node:fs';
class coordinate {
    constructor(readonly row: number, readonly col: number) {
    }
    equals(coord: coordinate) {
        return this.row === coord.row && this.col == coord.col
    }

    toString() {
        return this.row + "|" + this.col
    }

}
const outOfBound = 'Q'
const fileName = process.argv[2];
const data = fs.readFileSync(fileName as string, 'utf8')
    .split('\n')
    .filter(line => line !== "")
    .map(line => line.split(""));




console.log(part1())
console.log(part2())


function part1() {

    let s = size();
    let accessible = 0;
    for (let row = 0; row < s.height; row++) {
        for (let col = 0; col < s.width; col++) {
            const coord: coordinate = new coordinate(row, col)
            if (get(coord) === "@" && isMovable(coord)) {
                accessible++
            }
        }
    }
    return accessible
}


function isMovable(coord: coordinate) {
    return adjecentValues(coord).filter(val => val === "@").length < 4;
}

function part2() {

    let s = size();
    let accessible = 0;
    const candidates: Set<string> = new Set()
    for (let row = 0; row < s.height; row++) {
        for (let col = 0; col < s.width; col++) {
            const coord: coordinate = new coordinate(row, col)
            if (get(coord) === "@") {
                candidates.add(coord.toString());
            }
        }
    }
    candidates.values()
    while (true) {
        const df = candidates.values().next()
        if (df.done) {
            break
        }
        const candidate = coordinateFromString(df.value)
        if (isMovable(candidate)) {
            data[candidate.row]?.[candidate.col] = "x"
            adjecents(candidate).filter(adj => get(adj) === "@")
                .map(i => i.toString())
                .forEach(i => candidates.add(i))
            accessible++ 
        }
        candidates.delete(df.value)

    }
    return accessible
}

function get(c: coordinate): string {
    return (data[c.row] || [])[c.col] || outOfBound

}


function size() {
    if (!data[0]) {
        throw new Error("unexpected grid size")
    }
    return { height: data.length, width: data[0].length }
}


function coordinateFromString(s: string) {
    const split = s.split('|')
    if (split.length < 2) {
        throw new Error("unexpected")
    }
    return new coordinate(parseInt(split[0] || "", 10), parseInt(split[1] || "", 10))

}





function adjecents(c: coordinate) {
    const result: coordinate[] = [];
    for (let row = c.row - 1; row < c.row + 2; row++) {
        for (let col = c.col - 1; col < c.col + 2; col++) {
            let candidate: coordinate = new coordinate(row, col)
            if (col == c.col && row == c.row) {
                continue;
            }
            result.push(candidate);
        }
    }
    return result;
}

function adjecentValues(c: coordinate) {
    return adjecents(c)
        .map(get)
}

