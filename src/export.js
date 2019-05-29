import { UI } from 'sketch';
import sketch from 'sketch/dom';
import dialog from '@skpm/dialog';
import { writeFileSync } from '@skpm/fs';
import color from './lib/color';

export default function(context) {

    let document = sketch.getSelectedDocument();
    let colors;

    let identifier = String(context.command.identifier());
    if (identifier === 'export-document-colors-to-clr-file' || identifier === 'export-document-colors-to-txt-file') {
        colors = document.colors;
    }
    if (identifier === 'export-global-colors-to-clr-file' || identifier === 'export-global-colors-to-txt-file') {
        colors = sketch.getGlobalColors();
    }

    if (colors.length === 0) {
        UI.message('Document have no colors.');
        return;
    }

    let filter;
    if (identifier === 'export-document-colors-to-clr-file' || identifier === 'export-global-colors-to-clr-file') {
        filter = { name: 'Apple Color Picker Palette', extensions: [ 'clr' ] }
    }
    if (identifier === 'export-document-colors-to-txt-file' || identifier === 'export-global-colors-to-txt-file') {
        filter = { name: 'Text File', extensions: [ 'txt', 'text' ] }
    }

    dialog.showSaveDialog(
        {
            filters: [filter]
        },
        (filePath) => {
            if (identifier === 'export-document-colors-to-clr-file' || identifier === 'export-global-colors-to-clr-file') {
                let colorList = color.colorListFromArray(colors);
                colorList.writeToFile(filePath);
            }
            if (identifier === 'export-document-colors-to-txt-file' || identifier === 'export-global-colors-to-txt-file') {
                let text = color.toTextContent(colors);
                writeFileSync(filePath, text);
            }
            UI.message('Colors save to "' + filePath + '".');
        }
    );

}