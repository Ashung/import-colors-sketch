import { UI } from 'sketch';
import { Buffer } from 'buffer';
import { readFileSync } from '@skpm/fs';
import color from './color';

/**
 * Convert Adobe Swatch Exchange (ASE) file to Array [{name, color}]
 * File format specification:
 * http://www.selapa.net/swatches/colors/fileformats.php#adobe_ase
 * @param  {String} filePath
 * @returns {Array} [ {name, color} ]
 */
export default function(filePath) {

    let colorContents = readFileSync(filePath);
    let colorBuffer = Buffer.from(colorContents);
    let signature = colorBuffer.toString('utf-8', 0, 4);
    let versionMajor = colorBuffer.slice(4, 6).readInt16BE(0);
    let versionMin = colorBuffer.slice(6, 8).readInt16BE(0);
    let count = colorBuffer.slice(8, 12).readInt32BE(0);

    if (colorBuffer.length > 12 && signature !== 'ASEF' && versionMajor !== 1 && versionMin !== 0) {
        UI.message('Error: Not Adobe Swatch Exchange (ASE) file.');
        return;
    }

    let colors = [];

    let i = 12;
    while (i < colorBuffer.length) {

        let blockLength;
        let blockType = colorBuffer.slice(i, i + 2).readInt16BE(0).toString(16);
        i += 2;

        // Ignore group start c001, end c002
        if (blockType === 'c001') {
            blockLength = colorBuffer.slice(i, i + 4).readInt32BE(0);
            i += blockLength;
        }
        if (blockType === 'c002') {
            i += 2;
        }

        // Color entry, start 0001
        if (blockType === '1') {
            blockLength = colorBuffer.slice(i, i + 4).readInt32BE(0);
            let nameLength = colorBuffer.slice(i + 4, i + 6).readUInt16BE(0);
            let colorName = '';
            let nscolor;
            for (let j = 0; j < nameLength * 2 - 2; j += 2) {
                colorName += String.fromCodePoint(colorBuffer.slice(i + 6 + j, i + 8 + j).readInt16BE(0));
            }
            let _i = i + 6 + nameLength * 2;
            let colorModel = colorBuffer.slice(_i, _i + 4).toString('utf-8', 0, 4);
            _i += 4;
            if (colorModel === 'RGB ') {
                let r = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                _i += 4;
                let g = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                _i += 4;
                let b = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                nscolor = color.colorWithRGBA(r * 255, g * 255, b * 255, 1.0);
            } else if (colorModel === 'CMYK') {
                let c = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                _i += 4;
                let m = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                _i += 4;
                let y = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                _i += 4;
                let k = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                nscolor = color.colorWithCMYKA(c * 100, m * 100, y * 100, k * 100, 1.0);
            } else if (colorModel === 'LAB ') {
                let l = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                _i += 4;
                let a = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                _i += 4;
                let b = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                nscolor = color.colorWithLABA(l * 100, a * 100, b * 100, 1.0);
            } else if (colorModel === 'Gray') {
                let g = colorBuffer.slice(_i, _i + 4).readFloatBE(0);
                nscolor = color.colorWithGA((1 - g) * 100, 1.0);
            }

            let hexValue = color.toHexValue(nscolor);
            colors.push({
                name: colorName,
                color: hexValue
            });

            i += blockLength;
        }
    }

    return colors;
}