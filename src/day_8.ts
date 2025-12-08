import fs from 'node:fs';
const fileName = process.argv[2];
const data = fs.readFileSync(fileName as string, 'utf8')
    .trim()
    .split("\n")



const ranges: distance[] = []
for (let i = 0; i < data.length - 1; i++) {
    for (let j = i + 1; j < data.length; j++) {
        const di: distance = {
            distance: distance(parseCoord(data[i]), parseCoord(data[j])),
            left: data[i], right: data[j]
        }
        ranges.push(di);
    }
}

ranges.sort((a, b) => a.distance - b.distance)

console.log(ranges.slice(0, 10))

const result = part1(ranges);
console.log("part 1:", result)
console.log("part 1:", part2(ranges))


function part1(ranges: distance[]) {
    const groups: Set<string>[] = [];

    for (let i = 0; i < parseInt(process.argv[3]); i++) {
        const left = removeMatching(groups, ranges[i].left);
        const right = removeMatching(groups, ranges[i].right);
        groups.push(left.union(right));
    }

    groups.sort((l, r) => r.size - l.size);
    console.log(groups.slice(0, 3));
    const result = groups.slice(0, 3).map(i => i.size)
        .reduce((a, b) => a * b, 1);
    return result;
}

function part2(ranges: distance[]) {
    const groups: Set<string>[] = [];

    for (let i = 0; i < ranges.length; i++) {
        const left = removeMatching(groups, ranges[i].left);
        const right = removeMatching(groups, ranges[i].right);
        const union = left.union(right);
        if (union.size === data.length) {
            return parseCoord(ranges[i].left).x *
                parseCoord(ranges[i].right).x;
        }

        groups.push(union);
    }
    throw "groups could not be combined to circuit"

}

function removeMatching(groups: Set<string>[], box: string): Set<string> {
    const idx = groups.findIndex(s => s.has(box))
    if (idx === -1) {
        return new Set([box])
    }
    return groups.splice(idx, 1)[0]
}


interface distance {
    distance: number;
    left: string;
    right: string;
}

interface coordinate {
    x: number;
    y: number;
    z: number;
}

function parseCoord(s: string): coordinate {
    const [x, y, z] = s.split(',')
        .map(part => parseInt(part, 10));
    return { x, y, z };
}

function toKey(c: coordinate) {
    return [c.x, c.y, c.y].join(",")
}

function distance(left: coordinate, right: coordinate) {
    return Math.sqrt(
        Math.pow(left.x - right.x, 2) +
        Math.pow(left.y - right.y, 2) +
        Math.pow(left.z - right.z, 2)
    );
}
