import color from './color';

/**
 * Read Apple CLR file
 * @param  {String} filePath
 * @returns {Array}
 */
export default function(filePath) {
    let colorList = NSColorList.alloc().initWithName_fromFile(null, filePath);
    return color.toArray(colorList);
}
