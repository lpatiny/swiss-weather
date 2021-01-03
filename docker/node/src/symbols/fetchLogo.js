import { writeFileSync } from 'fs';
import { join } from 'path';

import fetch from 'node-fetch';

async function doAll() {
    for (let i = 100; i < 200; i++) {
        let response = await fetch(
            `https://www.meteosuisse.admin.ch/etc/designs/meteoswiss/assets/images/icons/meteo/weather-symbols/${i}.svg`,
        );
        if (response.status === 200) {
            let svg = await response.text();
            writeFileSync(join(__dirname, 'meteosuisse', `${i}.svg`), svg, 'utf8');
        }
    }
}

doAll();
