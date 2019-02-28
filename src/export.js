import { UI } from 'sketch';
import sketch from 'sketch/dom';
import dialog from '@skpm/dialog';
import color from './color';

export default function(context) {

    let document = sketch.getSelectedDocument();
    let colors;

    let identifier = String(context.command.identifier());
    if (identifier === 'export-document-colors') {
        colors = document.colors;
    }
    if (identifier === 'export-global-colors') {
        colors = sketch.getGlobalColors();
    }

    if (colors.length === 0) {
        UI.message('Document have no colors.');
        return;
    }

    dialog.showSaveDialog(
        {
            filters: [
                { name: 'Apple Color Picker Palette', extensions: [ 'clr' ] }
            ]
        },
        (filePath) => {
            let colorList = color.colorListFromArray(colors);
            colorList.writeToFile(filePath);
            UI.message('Colors save to "' + filePath + '".');
        }
    );

}