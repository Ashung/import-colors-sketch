import { basename } from 'path';

/**
 * Read Apple CLR file
 * @param  {String} filePath
 * @returns {NSColorList}
 */
export default function(filePath) {
    let name = basename(filePath, '.clr');
    let colors = NSColorList.alloc().initWithName_fromFile(name, filePath);
    return colors;
}
