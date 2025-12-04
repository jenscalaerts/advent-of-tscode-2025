import fs from 'node:fs';
const fileName = process.argv[2];
const data = fs.readFileSync(fileName as string, 'utf8')
const ranges = parse(data)

const part1 = ranges.map(range =>sumOfInvalidIds(range, possibleComLenghtsPart1)).reduce((a, b) => a + b, 0)
const part2 = ranges.map(range =>sumOfInvalidIds(range, possibleComLenghts)).reduce((a, b) => a + b, 0)
console.log(`part 1: ${part1}, part2: ${part2}`)



interface range {
    from: number;
    to: number;
}

function parse(data: string) {
    const result: range[] = [];
    const ranges = data.split(',');
    for (const range of ranges) {
        if (!range.includes("-")) {
            continue;
        }
        const [begin, end] = range.split("-");
        const r = { from: parseInt(begin ?? "0", 10), to: parseInt(end ?? "0", 10) }
        result.push(r);
    }
    return result;
}

function sumOfInvalidIds(range: range, lengtsAlgo: (num: number) => number[]) {
    let invalids = 0
    for (let i = range.from; i <= range.to; i++) {
        if (isRepeatingString(i.toString(), lengtsAlgo)) {
            invalids += i
        }
    }
    console.log(`${range.from}-${range.to}: ${invalids}`)
    return invalids;
}

function possibleComLenghtsPart1(len: number) {
    if (len % 2 != 0) {
        return [];
    }
    return [len / 2];
}

function possibleComLenghts(len: number) {
    if (len == 1) {
        return [];
    }
    let possibles: number[] = []
    for (let i = 1; i <= len / 2; i++) {
        if (len / i === Math.floor(len / i)) {
            possibles.push(i)
        }
    }
    return possibles;
}

function isRepeatingString(s: string, options: (num: number) => number[]): boolean {
    const lengths = options(s.length);

    for (const length of lengths) {
        if (isRepeating(s, length)) {
            console.log(s)
            return true;
        }
    }
    return false;
}
function isRepeating(s: string, numberOfChars: number): boolean {
    const check = s.substring(0, numberOfChars);
    for (let i = numberOfChars; i < s.length; i += numberOfChars) {
        if (check !== s.substring(i, i + numberOfChars)) {
            return false;
        }
    }
    return true;
}

