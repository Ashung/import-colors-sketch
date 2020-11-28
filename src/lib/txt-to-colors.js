import { UI } from 'sketch';
import { EOL } from 'os';
import { readFileSync } from '@skpm/fs';
import color from './color';

/**
 * Get colors from text file.
 * 
 * white: #FFFFFF
 * red: red
 * blue: rgb(0, 0, 255)
 * transparent blue: rgb(0, 0, 255, 0.5)
 * cyan: hsl(180, 100, 50)
 * transparent cyan: hsla(180, 100%, 50%, 0.5)
 * 
 * @param  {String} filePath
 * @returns {Array} [ {name, color} ]
 */
export default function(filePath) {

    let colorContents = readFileSync(filePath, 'utf-8');
    let lines = colorContents.split(EOL);
    let colors = [];

    lines.forEach(line => {
        let lineRegExp = /^(.*):\s?(.*)$/;
        if (lineRegExp.test(line)) {
            let lineMatch = line.match(lineRegExp);
            let colorName = lineMatch[1];
            let colorValue = lineMatch[2];
            let hexValue;
            if (/^#[0-9a-f]{3,8}/i.test(colorValue)) {
                hexValue = colorValue.match(/^#[0-9a-f]{3,8}/i)[0];
            } else if (/^rgb[a]?\(.*\)/i.test(colorValue)) {
                let rgba = colorValue.match(/^rgb[a]?\((.*)\)/i)[1].split(/,\s?/);
                let nsColor = color.colorWithRGBA(parseInt(rgba[0]) || 0, parseInt(rgba[1]) || 0, parseInt(rgba[2]) || 0, parseFloat(rgba[3]) || 1);
                hexValue = color.toHexValue(nsColor);
            } else if (/^hsl[a]?\(.*\)/i.test(colorValue)) {
                let hsla = colorValue.match(/^hsl[a]?\((.*)\)/i)[1].split(/,\s?/);
                let nsColor = color.colorWithHSLA(parseInt(hsla[0]) || 0, parseInt(hsla[1]) || 0, parseInt(hsla[2]) || 0, parseFloat(hsla[3]) || 1);
                hexValue = color.toHexValue(nsColor);
            } else if (color.colorWithName(colorValue)) {
                hexValue = color.toHexValue(color.colorWithName(colorValue));
            }
            if (hexValue) {
                colors.push({
                    name: colorName,
                    color: hexValue
                });
            }
        }
    });

    if (colors.length === 0) {
        UI.message('Invalid format text file.');
        return;
    }

    return colors;
}