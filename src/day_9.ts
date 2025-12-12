import fs from 'node:fs';
const X = 0;
const Y = 1;
const fileName = process.argv[2];
const data = fs.readFileSync(fileName as string, 'utf8')
    .trim()
    .split("\n")
    .map<coordinate>(line => {
        const [x, y] = line.split(',').map(item => parseInt(item, 10));
        return [x, y]
    });
console.log(part1(data))
console.log(part2(data))

type coordinate = readonly [number, number];
type area = readonly [coordinate, coordinate];

function part1(data: coordinate[]) {
    const openPairs = []
    for (let i = 0; i < data.length - 1; i++) {
        for (let j = 0; j < data.length; j++) {
            const idx = data.findIndex((el, idx) =>
                (idx !== i && idx !== j && overlaps(data[i], data[j], el)))
            if (idx === -1) {
                openPairs.push({ left: data[i], right: data[j], size: size(data[i], data[j]) });
            }
        }
    }

    openPairs.sort((l, r) => r.size - l.size)
    return openPairs[0].size;
}

function part2(data: coordinate[]) {

    const edge: coordinate[] = []
    const rounded = [...data, data[0], data[1]]
    for (let i = 1; i < rounded.length - 1; i++) {
        edge.push(...calculateOutlineTo(rounded[i - 1], rounded[i], rounded[i + 1]))
    }
    edge.push(edge[0], edge[1]);

    const openPairs = []
    for (let i = 0; i < data.length - 1; i++) {
        for (let j = i + 1; j < data.length; j++) {
            const a = createArea(data[i], data[j]);
                openPairs.push({ left: data[i], right: data[j], size: size(data[i], data[j]) , overlaps: overlapsEdge(a,edge)});
        }
    }

    openPairs.sort((l, r) => r.size - l.size)
    return openPairs.filter(i=>!i.overlaps)[0].size;
}


function overlaps(left: coordinate, right: coordinate, middle: coordinate) {
    //x is sorted
    return Math.min(left[X], right[X]) <= middle[X]
        && Math.max(left[X], right[X]) >= middle[X]
        && Math.min(left[Y], right[Y]) <= middle[Y]
        && Math.max(left[Y], right[Y]) >= middle[Y]
}


function overlapsEdge(a: area, edge: coordinate[]){
    for (let i = 0; i < edge.length - 1; i++) {
        if (lineInArea(a, edge[i], edge[i + 1])) {
     //       console.log("overlap", a, (edge[i], edge[i + 1]))
            
            return [edge[i],edge[i+1]].join();
        }
    }
    return false

}


function lineInArea(a: area, begin: coordinate, end: coordinate) {

    if (begin[X] == end[X]) {
        return begin[X] >= a[0][X] && begin[X] <= a[1][X] && !((begin[Y] < a[0][Y] && end[Y] < a[0][Y]) || (begin[Y] > a[1][Y] && end[Y] > a[1][Y]))
    }

    if (begin[Y] == end[Y]) {
        return begin[Y] >= a[0][Y] && begin[Y] <= a[1][Y] && !((begin[X] < a[0][X] && end[X] < a[0][X]) || (begin[X] > a[1][X] && end[X] > a[1][X]))
    }

    const mess = `assumption broken: ${begin}, ${end}`;
    throw new Error(mess);

}



function size(left: coordinate, right: coordinate) {
    return (Math.abs(left[0] - right[0]) + 1) * (Math.abs(left[1] - right[1]) + 1)
}

function calculateVector(from: coordinate, to: coordinate): coordinate {
    return [to[0] - from[0], to[1] - from[1]]
}


function detProd(a: coordinate, b: coordinate) {
    return a[0] * b[1] - a[1] * b[0]
}

function calculateOutlineTo(first: coordinate, second: coordinate, third: coordinate): coordinate[] {
    const from = calculateVector(first, second)
    const to = calculateVector(second, third)
    const prod = detProd(from, to)
    if (prod < 0) {
        return [[second[0] - Math.sign(from[0]) + Math.sign(to[0]), second[1] - Math.sign(from[1]) + Math.sign(to[1])]]
    } else {

        return [
            [second[0] + Math.sign(from[0]) - Math.sign(to[0]), second[1] + Math.sign(from[1]) - Math.sign(to[1])],
        ]
    }

}


/**
 * create a normalized area low xy to high xy 
 */
function createArea(first: coordinate, second: coordinate): area {
    return [[Math.min(first[X], second[X]), Math.min(first[Y], second[Y])],
    [Math.max(first[X], second[X]), Math.max(first[Y], second[Y])]]
}

