import fs from 'node:fs';
const fileName = process.argv[2];
const data = fs.readFileSync(fileName as string, 'utf8')
const split = data.split('\n');


console.log(`part one: ${partOne(split)}, part two: ${partTwo(split)}`)


function partOne(lines: string[]): number {

    let position = 50;
    let numberOfZeros = 0;
    for (const line of lines) {
        if (line === "") {
            continue;
        }
        const sign = line[0] === "R" ? 1 : -1
        const num = parseInt(line.substring(1));
        let calculatedPosition = (position + (num * sign)) % 100
        if (calculatedPosition < 0) {
            calculatedPosition = 100 + (calculatedPosition);
        }
        position = calculatedPosition;
        if (position === 0) {
            numberOfZeros++;
        }

    }
    return numberOfZeros;
}


function partTwo(lines: string[]): number {

    let position = 50;
    let numberOfZeros = 0;
    for (const line of lines) {
        let localzero = 0;
        if (line === "") {
            continue;
        }
        const sign = line[0] === "R" ? 1 : -1
        const num = parseInt(line.substring(1));
        let calculatedPosition = position + (num * sign)

        localzero += Math.floor(Math.abs(calculatedPosition) / 100);

        if (calculatedPosition < 0) {
            //corner case when moving from 0 to a negative number, pass should be countend
            if(position !==0){
                localzero++;
            }
            calculatedPosition = 100 + (calculatedPosition % 100);
        }
        if(calculatedPosition === 0){
            localzero++
        }
        position = calculatedPosition % 100 ;
        numberOfZeros+=localzero;
        console.log(`${line} now points at ${position} passed by ${localzero} to ${numberOfZeros}`)

    }
    return numberOfZeros;
}
