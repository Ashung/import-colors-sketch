import color from './color';

/**
 * Read Apple CLR file, return a Array [{name, color}]
 * @param  {String} filePath
 * @returns {Array} [ {name, color} ]
 */
export default function(filePath) {
    let colorList = NSColorList.alloc().initWithName_fromFile(null, filePath);
    return color.toArray(colorList);
}
