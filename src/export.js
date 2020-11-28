import { UI } from 'sketch';
import sketch from 'sketch/dom';
import { Swatch } from 'sketch/dom';
import dialog from '@skpm/dialog';
import { writeFileSync } from '@skpm/fs';
import color from './lib/color';
import { toArray } from 'util';

export default function(context) {

    const document = sketch.getSelectedDocument();
    const identifier = String(__command.identifier());

    let colors;
    dialog.showMessageBox(
        {
            type: 'none',
            buttons: ['OK', 'Cancel'],
            message: 'Export colors',
            checkboxLabel: 'Include color variables from library.',
            checkboxChecked: true
        },
        ({ response, checkboxChecked }) => {
            if (response === 0) {
                if (checkboxChecked) {
                    colors = toArray(document._getMSDocumentData().allSwatches()).map(swatch => {
                        return Swatch.fromNative(swatch);
                    });
                } else {
                    colors = document.swatches;
                }
            } else {
                return;
            }
        }
    );
    
    if (colors.length === 0) {
        UI.message('Document have no color variables.');
        return;
    }

    let filter;
    if (identifier === 'export-color-variables-to-clr-file') {
        filter = { name: 'Apple Color Picker Palette', extensions: [ 'clr' ] }
    }
    if (identifier === 'export-color-variables-to-txt-file') {
        filter = { name: 'Text File', extensions: [ 'txt', 'text' ] }
    }

    dialog.showSaveDialog(
        {
            filters: [filter]
        },
        (filePath) => {
            if (identifier === 'export-color-variables-to-clr-file') {
                let colorList = color.colorListFromArray(colors);
                colorList.writeToFile(filePath);
            }
            if (identifier === 'export-color-variables-to-txt-file') {
                let keyCount = {};
                let text = color.toTextContent(colors, keyCount);
                writeFileSync(filePath, text);
            }
            UI.message('Colors save to "' + filePath + '".');
        }
    );

}