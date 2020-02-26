import { UI } from 'sketch';
import { Buffer } from 'buffer';
import { readFileSync } from '@skpm/fs';
import color from './color';

/**
 * Convert Adobe Color Table (ACT) file to Array [{ name, color }]
 * File format specification:
 * https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/#50577411_pgfId-1070626
 * @param {string} filePath
 * @returns {Array} [ {name, color} ]
 */
export default function(filePath) {
  let colorContents = readFileSync(filePath);
  let colorBuffer = Buffer.from(colorContents);

  // should be 768 or 772 bytes long
  if (colorBuffer.length !== 768 && colorBuffer.length !== 772) {
    UI.message('Error: Not a valid Adobe Color Table (ACT) file.');
    return;
  }

  let numColors = 255;

  // If file is 772 bytes long, there are 4 additional bytes remaining
  if (colorBuffer.length === 772) {
    // Two bytes for the number of colors to use.
    numColors = colorBuffer.slice(-4).readInt16BE();
  }

  let colors = [];

  let i = 0;

  while (i < numColors * 3) {
    let r = colorBuffer.slice(i, i + 1).readUInt8(0);
    let g = colorBuffer.slice(i + 1, i + 2).readUInt8(0);
    let b = colorBuffer.slice(i + 2, i + 3).readUInt8(0);

    const nscolor = color.colorWithRGBA(r, g, b, 1);
    const hexValue = color.toHexValue(nscolor);

    colors.push({
      name: hexValue,
      color: hexValue,
    });

    i += 3;
  }

  return colors;
}
