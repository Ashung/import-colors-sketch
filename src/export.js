import { UI as ui } from 'sketch';
import { basename } from 'path';
import { Document } from 'sketch/dom';
import dialog from '@skpm/dialog';
import color from './color';

export default function(context) {

    var document = Document.getSelectedDocument();
    var colors = document.colors;

    if (colors.length === 0) {
        ui.message('Document have no colors.');
        return;
    }

    dialog.showSaveDialog(
        {
            filters: [
                { name: 'Apple Color Picker Palette', extensions: [ 'clr' ] }
            ]
        },
        (filePath) => {
            let name = basename(filePath, '.clr');
            let colorList = NSColorList.alloc().initWithName(name);
            let keyCount = {};
            colors.forEach(colorAsset => {
                let name = colorAsset.name || colorAsset.color.toUpperCase();
                let nscolor = colorAsset.sketchObject.color().NSColorWithColorSpace(document.sketchObject.colorSpace());
                color.addColorToList(nscolor, name, colorList, keyCount);
            });
            colorList.writeToFile(filePath);
            ui.message('Colors save to "' + filePath + '".');
        }
    );

}