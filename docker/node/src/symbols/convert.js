import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const text = readFileSync(join(__dirname, 'symbols.txt'), 'utf8');
const lines = text.split(/\r?\n/);

let keys = [
    { bit: 0, code: 'so', description: 'sun' },
    { bit: 1, code: 'mo', description: 'moon' },
    { bit: 2, code: 'ne', description: 'fog' },
    { bit: 3, code: 'klhe', description: 'small white cloud' },
    { bit: 4, code: 'grhe', description: 'large light grey cloud' },
    { bit: 5, code: 'grdu', description: 'large dark cloud' },
    { bit: 6, code: 'ra', description: 'rain' },
    { bit: 7, code: 'shra', description: 'rain shower' },
    { bit: 8, code: 'ra3', description: 'heavy rain' },
    { bit: 9, code: 'sr', description: 'sleet' },
    { bit: 10, code: 'shsr', description: 'sleet shower' },
    { bit: 11, code: 'sn', description: 'snow' },
    { bit: 12, code: 'shsn', description: 'snow shower' },
    { bit: 13, code: 'sn3', description: 'heavy snow' },
    { bit: 14, code: 'bl', description: 'lightning' },
];

const results = {};

for (let line of lines) {
    const [code, value] = line.split('\t');
    let bits = 0;
    value.split('_').forEach((part) => {
        let match = keys.filter((key) => key.code === part)[0];
        bits |= 1 << match.bit;
    });
    results[code] = bits;
}

writeFileSync(
    join(__dirname, 'mapping.json'),
    JSON.stringify(results, undefined, 2),
    'utf8',
);
