import assert from 'node:assert';
import fs from 'node:fs';
const fileName = process.argv[2];
const data = fs.readFileSync(fileName as string, 'utf8')
    .split("\n")


const symbolRow = data[data.length - 2]
assert(symbolRow !== undefined)
const cols = symbolRow.trim().split(/\s+/)
    .map<Col>(op => { return { operation: mapOperation(op), numbers: [], width: 0 } });

const numbers = data.slice(0, -2)
numbers
    .map(row => row.trim().split(/\s+/))
    .forEach(row => row.forEach((num, index) => cols[index]?.numbers.push(parseInt(num, 10))));
const part1 = cols.map(executeColumn).reduce((total, col) => total + col);
console.log(part1)

let i = 0;

const cols2 = []

while (true) {
    const nextSymbol = nextSymbolIn(symbolRow, i + 1)
    const width = nextSymbol === -1 ? symbolRow.length - i : (nextSymbol - i - 1);

    assert(symbolRow[i])
    const nums = []
    for (let numIndex = 0; numIndex < width; numIndex++) {
        
        const numString = numbers.reduce((total, next) => total + next[i + numIndex] || " ", "")
            .trim();
        assert.equal(numString.indexOf(" "), -1)
        nums.push(parseInt(numString, 10))

    }

    cols2.push({ operation: mapOperation(symbolRow[i] || ""), numbers: nums })

    if (nextSymbol === -1) {
        break
    }
    i = nextSymbol;
}

const part2 = cols2.map(executeColumn).reduce((total, col) => total + col);
console.log(part2);



type Operation = (a: number, b: number) => number;
interface Col {
    operation: Operation;
    numbers: number[];
}

function executeColumn(col: Col) {
    return col.numbers.reduce(col.operation, col.operation === plus ? 0 : 1);
}

function mapOperation(op: string) {
    switch (op) {
        case "+": {
            return plus;
        }
        case "*": {
            return times;
        }
        default:
            throw Error(`unexpected symbol ${op}`);
    }
}

function plus(a: number, b: number) {
    return a + b;
}

function times(a: number, b: number) {
    return a * b;
}
function nextSymbolIn(s: string, idx: number) {
    const plus = s.indexOf("+", idx);
    const times = s.indexOf("*", idx);
    if (plus === -1 && times === -1) {
        return -1;
    }
    if (plus == -1) {
        return times;
    }
    if (times == -1) {
        return plus;
    }

    return Math.min(s.indexOf("+", idx), s.indexOf("*", idx));

}
