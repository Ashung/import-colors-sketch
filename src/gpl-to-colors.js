import { UI as ui } from 'sketch';
import { EOL } from 'os';
import { readFileSync } from '@skpm/fs';
import color from './color';

/**
 * Convert GIMP palette file to NSColorList
 * http://www.selapa.net/swatches/colors/fileformats.php#gimp_gpl
 * @param  {String} filePath
 * @returns {NSColorList}
 */
export default function(filePath) {

    var colorContents = readFileSync(filePath, 'utf-8');
    let lines = colorContents.split(EOL);

    if (lines.length < 2 && lines[0] !== 'GIMP Palette') {
        ui.message('Error: not a GIMP palette file.');
        return;
    }

    let name = lines[1].replace(/Name:[\t|\s]*/, '');
    let colors = NSColorList.alloc().initWithName(name);
    let keyCount = {};
    lines.forEach(line => {
        let regExpColor = new RegExp(/(\d+)[\t|\s]+(\d+)[\t|\s]+(\d+)[\t|\s]+(.*)/, '');
        if (regExpColor.test(line)) {
            let r = parseInt(line.match(regExpColor)[1]);
            let g = parseInt(line.match(regExpColor)[2]);
            let b = parseInt(line.match(regExpColor)[3]);
            let name = line.match(regExpColor)[4];
            let nscolor = color.colorWithRGBA(r, g, b, 1.0);
            color.addColorToList(nscolor, name, colors, keyCount);
        }
    });

    return colors;
}