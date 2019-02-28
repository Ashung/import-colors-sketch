import { UI } from 'sketch';
import { EOL } from 'os';
import { readFileSync } from '@skpm/fs';
import color from './color';

/**
 * Convert GIMP palette file to NSColorList
 * http://www.selapa.net/swatches/colors/fileformats.php#gimp_gpl
 * @param  {String} filePath
 * @returns {Array}
 */
export default function(filePath) {

    let colorContents = readFileSync(filePath, 'utf-8');
    let lines = colorContents.split(EOL);

    if (lines.length < 2 && lines[0] !== 'GIMP Palette') {
        UI.message('Error: not a GIMP palette file.');
        return;
    }

    let colors = [];

    lines.forEach(line => {
        let regExpColor = new RegExp(/(\d+)[\t|\s]+(\d+)[\t|\s]+(\d+)[\t|\s]+(.*)/, '');
        if (regExpColor.test(line)) {
            let r = parseInt(line.match(regExpColor)[1]);
            let g = parseInt(line.match(regExpColor)[2]);
            let b = parseInt(line.match(regExpColor)[3]);
            let nscolor = color.colorWithRGBA(r, g, b, 1.0);
            let hexValue = color.toHexValue(nscolor);
            let colorName = line.match(regExpColor)[4] || null;
            colors.push({
                name: colorName,
                color: hexValue
            });
        }
    });

    return colors;
}