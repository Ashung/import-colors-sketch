import { UI } from 'sketch';
import { Document, Artboard, ShapePath, Text, Rectangle, Library } from 'sketch/dom';
import sketch from 'sketch/dom';
import { extname, basename } from 'path';
import os from 'os';
import dialog from '@skpm/dialog';
import color from './color';
import clr2colors from './clr-to-colors';
import gpl2colors from './gpl-to-colors';
import aco2colors from './aco-to-colors';
import ase2colors from './ase-to-colors';

export default function(context) {

    dialog.showOpenDialog({
        filters: [
            { name: 'Apple Color Picker Palette', extensions: [ 'clr' ] },
            { name: 'Adobe Color Swatch', extensions: [ 'aco' ] },
            { name: 'Adobe Swatch Exchange', extensions: [ 'ase' ] },
            { name: 'GIMP Palette', extensions: [ 'gpl' ] }
        ],
        properties: [ 'openFile' ]
    }, (filePaths) => {

        let colors;
        let filePath = filePaths[0];
        let fileName = basename(filePath);
        let fileType = extname(filePath).toLowerCase();
        if (fileType === '.clr') {
            colors = clr2colors(filePath);
        } else if (fileType === '.aco') {
            colors = aco2colors(filePath);
        } else if (fileType === '.ase') {
            colors = ase2colors(filePath);
        } else if (fileType === '.gpl') {
            colors = gpl2colors(filePath);
        }

        let identifier = String(context.command.identifier());
        if (identifier === 'import-colors-to-document' || identifier === 'import-colors-to-global') {

            let document = Document.getSelectedDocument();
            let colorAssets;
            if (identifier === 'import-colors-to-document') {
                colorAssets = document.colors;
            } else {
                colorAssets = sketch.getGlobalColors();
            }

            let doRemoveAllColorAssets = false;
            let doAddColorAssets = false;

            if (colorAssets.length === 0) {
                doAddColorAssets = true;
            } else {
                dialog.showMessageBox(
                    {
                        type: 'info',
                        buttons: ['OK', 'Cancel', 'Append'],
                        message: 'Replace all document colors with colors from "' + fileName + '".'
                    },
                    ({ response, checkboxChecked }) => {
                        if (response === 0) {
                            doRemoveAllColorAssets = true;
                            doAddColorAssets = true;
                        } else if (response === 1) {
                            return null;
                        } else if (response === 2) {
                            doAddColorAssets = true;
                        }
                    }
                );
            }

            let assetCollection;
            if (doRemoveAllColorAssets) {
                if (identifier === 'import-colors-to-document') {
                    assetCollection = document._getMSDocumentData().assets();
                } else {
                    assetCollection = MSPersistentAssetCollection.sharedGlobalAssets();
                }
                assetCollection.removeAllColorAssets();
            }

            if (doAddColorAssets) {
                if (identifier === 'import-colors-to-document') {
                    color.toObject(colors).items.forEach(item => {
                        let newName = item.name.replace(/\sCopy(\s\d+)?/, '');
                        colorAssets.push({
                            name: newName,
                            color: item.color
                        });
                    });
                    UI.message('Colors have imported to document colors.');
                } else {
                    color.toObject(colors).items.forEach(item => {
                        let newName = item.name.replace(/\sCopy(\s\d+)?/, '');
                        let colorAsset = color.colorAsset(newName, item.color);
                        assetCollection.addColorAsset(colorAsset);
                    });
                    UI.message('Colors have imported to global colors.');
                }
            }

        } 
        
        else if (identifier === 'convert-colors-to-clr-file') {
            dialog.showSaveDialog(
                {
                    filters: [
                        { name: 'Apple Color Picker Palette', extensions: [ 'clr' ] }
                    ]
                },
                (filePath) => {
                    colors.writeToFile(filePath);
                    UI.message('Colors have convert to .clr file.');
                }
            );
        }

        else if (identifier === 'import-colors-as-library') {

            let libraryPath = os.homedir() + '/Library/Application Support/com.bohemiancoding.sketch3/Libraries/' + fileName.replace(/\.\w+$/i, '.sketch');
            let msDocument = MSDocument.alloc().init();
            let document = Document.fromNative(msDocument);

            // Page
            document.pages[0].name = 'Library Preview';

            // Add artboard
            let artboard = new Artboard({
                name: 'Library Preview',
                parent: document.pages[0],
                frame: new Rectangle(0, 0, 200, 160),
                background: {
                    enabled: true,
                    includeInExport: true,
                    color: '#000000'
                }
            });

            color.toObject(colors).items.forEach((item, index) => {
                
                // Add colors
                let newName = item.name.replace(/\sCopy(\s\d+)?/, '');
                document.colors.push({
                    name: newName,
                    color: item.color
                });
                
                // Add layers 5 x 4
                if (index < 20) {
                    let x = index % 5;
                    let y = Math.floor(index / 5);
                    let rectangleLayer = new ShapePath({
                        name: 'shape',
                        parent: artboard,
                        frame: new Rectangle(x * 40, y * 40, 40, 40),
                        style: { 
                            fills: [ { color: item.color } ]
                        }
                    });
                }

            });

            // Add text
            let text = new Text({
                name: 'text',
                text: fileName.replace(/\.\w+$/i, ''),
                parent: artboard,
                fixedWidth: true,
                frame: new Rectangle(10, 10, 180, 140),
                style: {
                    textColor: '#ffffff',
                    fontFamily: 'Futura',
                    fontSize: 20,
                    lineHeight: 40,
                    alignment: 'center',
                    verticalAlignment: 'center'
                }
            });
            text.sketchObject.frame().setMidY(80);

            document.save(libraryPath, error => {
                if (error) {
                    UI.message('Error: ' + error.message);
                } else {
                    Library.getLibraryForDocumentAtPath(libraryPath);
                    UI.message('Colors have imported as a library.');
                }
            });

        }

    });
}
