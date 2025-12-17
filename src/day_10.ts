import assert from 'node:assert';
import fs from 'node:fs';
const fileName = process.argv[2];

function sum(l: number, r: number) {
    return l + r;
}


part1()
part2()

// inspiration from https://old.reddit.com/r/adventofcode/comments/1pk87hl/2025_day_10_part_2_bifurcate_your_way_to_victory/
function part2() {
    const split = fs.readFileSync(fileName as string, 'utf8')
        .trim()
        .split("\n")
        .map(i => i.split(' '))
        .map<Machine>(i => {
            const joltageTarget = parseJoltage(i[i.length - 1])
            const buttons = i.slice(1, -1).map(i => parseButton(i, joltageTarget.length));
            const combinations = createCombinations(buttons)
                .map((i) => {
                    return {
                        cost: i.length,
                        pattern: i.reduce((l, r) => arrSum(l, r), new Array(i[0].length).fill(0)),
                        combinations: i
                    }
                })
            combinations.push({ cost: 0, pattern: new Array(combinations[0].pattern.length).fill(0), combinations: [] })

            return {
                buttons: buttons,
                joltageTarget: joltageTarget,
                combinations: combinations
            };
        });
    const partials = split.map(t => {
        const req = pressesRequired(t.joltageTarget, t.combinations)
        return req;
    })
    console.log("result", partials.reduce(sum));

    interface Machine {
        buttons: number[][];
        joltageTarget: number[]
        combinations: ButtonCombination[]
    }

    interface ButtonCombination {
        cost: number;
        pattern: number[];
        combinations: number[][]

    }



    function parseButton(button: string, length: number): number[] {
        const initial = Array<number>(length);
        initial.fill(0);
        return button.slice(1, -1)
            .split(",")
            .map(i => parseInt(i, 10))
            .reduce<number[]>((acc, n) => { acc[n] = 1; return acc; }, initial)
    }

    function parseJoltage(joltage: string): number[] {
        return joltage.slice(1, -1)
            .split(",")
            .map(i => parseInt(i, 10));
    }

    function pressesRequired(joltage: number[], combinations: ButtonCombination[]): number {
        if (joltage.reduce(sum) === 0) {
            return 0;
        }
        if (joltage[0] < 0) {
            throw "e"
        }
        const possibleCosts = []
        for (const combination of combinations) {
            const remainder = arrMinus(joltage, combination.pattern);
            if (remainder.filter(r => r % 2 !== 0 || r < 0).length === 0) {
                let remainingJoltage = remainder;
                remainingJoltage = remainingJoltage.map(i => i / 2);


                const cost = combination.cost + 2 * pressesRequired(remainingJoltage, combinations);

                possibleCosts.push({ cost: cost, pattern: combination, remainingJoltage });
            }

        }


        return possibleCosts.map(i => i.cost).sort((a, b) => a - b)[0] || 100000;
    }

    function arrMinus(joltage: number[], combinations: number[]): number[] {
        return joltage.map((i, idx) => i - combinations[idx]);
    }

    function arrSum(left: number[], right: number[]) {
        assert.equal(left.length, right.length);
        return left.map((num, idx) => num + right[idx]);
    }

    function createCombinations(buttons: number[][]): number[][][] {
        if (buttons.length === 1) {
            return [buttons];
        }
        const subCombination = createCombinations(buttons.slice(1));
        const self = buttons[0];
        const comb = subCombination.map(s => [...s, self]);
        return [[self], ...subCombination, ...comb];
    }
}

function part1() {
    const split = fs.readFileSync(fileName as string, 'utf8')
        .trim()
        .split("\n")
        .map(i => i.split(' ').slice(0, -1))
        .map<Machine>(i => {
            return {
                indicators: parseInitialIndicatorLights(i[0]),
                buttons: i.slice(1).map(parseButton),
            };
        })

    console.log(split.map(pressesRequired)
        .reduce(sum));


    interface Machine {
        indicators: number;
        buttons: number[];
    }

    interface State {
        readonly indicators: number
        readonly numberOfPresses: number
    }

    function parseInitialIndicatorLights(indicator: string) {
        return indicator.slice(1, -1)
            .split("")
            .map((char, index) => {
                if (char === ".") {
                    return 0;
                }
                return 1 << index;
            }).reduce(sum)
    }

    function parseButton(button: string) {
        return button.slice(1, -1)
            .split(",")
            .map(i => parseInt(i, 10))
            .map(i => {
                return 1 << i
            })
            .reduce(sum)
    }

    function pressesRequired(machine: Machine) {
        const alreadyReached = new Map<number, number>();
        alreadyReached.set(machine.indicators, 0);
        const tails: State[] = [{ indicators: machine.indicators, numberOfPresses: 0 }];
        while (tails.length > 0) {
            const cur = tails.shift();
            assert(cur);
            for (const button of machine.buttons) {
                const afterPress = cur.indicators ^ button
                if (afterPress === 0) {
                    const result = cur.numberOfPresses + 1;
                    return result;
                }
                if (!alreadyReached.has(afterPress)) {
                    const presses = cur.numberOfPresses + 1;
                    alreadyReached.set(afterPress, presses)
                    tails.push({ indicators: afterPress, numberOfPresses: presses })
                }
            }
        }
        throw Error("could not find combination");


    }
}

