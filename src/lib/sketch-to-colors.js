import sketch from 'sketch/dom';
import { UI } from 'sketch';
import { Document } from 'sketch/dom';

/**
 * Get colors from Sketch file.
 * @param  {String} filePath
 * @returns {Array} [ {name, color} ]
 */
export default function(filePath) {

    if (sketch.version.sketch >= 92) {
        filePath = NSURL.fileURLWithPath(filePath);
    }

    // Read data from sketch file.
    const error = MOPointer.alloc().init();
    const msDocument = MSDocument.alloc().init();
    msDocument.readFromURL_ofType_error(filePath, 'com.bohemiancoding.sketch.drawing', error);

    if (error.value() !== null) {
        UI.message('Error: Not a Sketch file.');
        return;
    }

    const document = Document.fromNative(msDocument);

    let colors;
    if (document.swatches.length > 0) {
        colors = document.swatches.map(item => {
            return {
                name: item.name,
                color: item.color
            };
        });
    } else {
        colors = document.colors.map(item => {
            return {
                name: item.name,
                color: item.color
            };
        });
    }

    return colors;

}