import { UI } from 'sketch';
import { Document } from 'sketch/dom';

export default function(filePath) {

    // Read data from sketch file.
    let error = MOPointer.alloc().init();
    let msDocument = MSDocument.alloc().init();
    msDocument.readFromURL_ofType_error(filePath, 'com.bohemiancoding.sketch.drawing', error);

    if (error.value() !== null) {
        UI.message('Error: Not a Sketch file.');
        return;
    }

    let document = Document.fromNative(msDocument);
    let colors = document.colors.map(item => {
        return {
            name: item.name,
            color: item.color
        };
    });

    return colors;

}