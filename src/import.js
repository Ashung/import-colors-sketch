import { UI } from 'sketch';
import { Document, Artboard, ShapePath, Text, Rectangle, Library, Style } from 'sketch/dom';
import sketch from 'sketch/dom';
import { extname, basename } from 'path';
import os from 'os';
import dialog from '@skpm/dialog';
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from '@skpm/fs';
import color from './lib/color';
import clr2colors from './lib/clr-to-colors';
import gpl2colors from './lib/gpl-to-colors';
import aco2colors from './lib/aco-to-colors';
import ase2colors from './lib/ase-to-colors';
import sketchpreset2colors from './lib/sketchpreset-to-colors';
import sketchpalette2colors from './lib/sketchpalette-to-colors';
import sketch2colors from './lib/sketch-to-colors';
import txt2colors from './lib/txt-to-colors';

export default function(context) {

    dialog.showOpenDialog({
        filters: [
            { name: 'Apple Color Picker Palette', extensions: [ 'clr' ] },
            { name: 'Adobe Color Swatch', extensions: [ 'aco' ] },
            { name: 'Adobe Swatch Exchange', extensions: [ 'ase' ] },
            { name: 'GIMP Palette', extensions: [ 'gpl' ] },
            { name: 'Sketch', extensions: [ 'sketchpreset', 'sketchpalette', 'sketch' ] },
            { name: 'Text File', extensions: [ 'txt', 'text' ] }
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
        } else if (fileType === '.sketchpreset') {
            colors = sketchpreset2colors(filePath);
        } else if (fileType === '.sketchpalette') {
            colors = sketchpalette2colors(filePath);
        } else if (fileType === '.sketch') {
            colors = sketch2colors(filePath);
        } else if (fileType === '.txt' || fileType === '.text') {
            colors = txt2colors(filePath);
        }

        if (colors === undefined) {
            return;
        }

        if (Array.isArray(colors) && colors.length === 0) {
            UI.message('No colors.');
            return;
        }

        let identifier = String(context.command.identifier());
        if (identifier === 'import-colors-to-document' || identifier === 'import-colors-to-global') {

            let document = sketch.getSelectedDocument();
            let colorAssets;
            if (identifier === 'import-colors-to-document') {
                colorAssets = document.colors;
            } else {
                if (sketch.version.sketch >= 54) {
                    colorAssets = sketch.globalAssets.colors;
                } else {
                    colorAssets = sketch.getGlobalColors();
                }
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
                    colors.forEach(item => {
                        let newName = color.cleanName(item.name);
                        document.colors.push({
                            name: newName,
                            color: item.color
                        });
                    });
                    UI.message('Colors have imported to document colors.');
                } else {
                    colors.forEach(item => {
                        let newName = color.cleanName(item.name);
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
                    let colorList = color.colorListFromArray(colors);
                    colorList.writeToFile(filePath);
                    UI.message('Colors have convert to .clr file.');
                }
            );
        }

        else if (identifier === 'convert-colors-to-txt-file') {
            dialog.showSaveDialog(
                {
                    filters: [
                        { name: 'Text File', extensions: [ 'txt', 'text' ] }
                    ]
                },
                (filePath) => {
                    let text = color.toTextContent(colors);
                    writeFileSync(filePath, text);
                    UI.message('Colors have convert to .txt file.');
                }
            );
        }

        else if (identifier === 'import-colors-as-library') {

            let libraryFolder = os.homedir() + '/Library/Application Support/com.bohemiancoding.sketch3/Plugins/import-colors-libraries/';
            let libraryPath = libraryFolder + fileName.replace(/\.\w+$/i, '.sketch');

            if (!existsSync(libraryFolder)) {
                mkdirSync(libraryFolder);
            }

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

            // Background
            let background = new ShapePath({
                name: 'background',
                parent: artboard,
                frame: new Rectangle(0, 0, 200, 160),
                style: {
                    fills: [{
                        fill: 'Pattern',
                        pattern: {
                            patternType: Style.PatternFillType.Tile,
                            image: {
                                base64: 'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHVJREFUWAnt07ENwCAMRFGTlbz/BvZMkJL+O1KK7wqKs9DTsapqx+Bk5uC2iGd02wfLfCBFVVBBKkDzdlBBKkDzdlBBKkDzdlBBKkDza79Dl9z57r6v+OwnoYQKKkgFaN4OKkgFaN4OKkgFaN4OKkgFaP73HTyNbwquT+qlgwAAAABJRU5ErkJggg=='
                            }
                        }
                    }]
                }
            });

            colors.forEach((item, index) => {
                
                // Add colors
                let newName = color.cleanName(item.name);
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

                    // Remove library files that remove from Libraries Preferences
                    let allLibraries = sketch.getLibraries().map(item => {
                        return String(item.sketchObject.locationOnDisk().path());
                    });
        
                    let colorLibraryFiles = readdirSync(libraryFolder).filter(item => {
                        return extname(item) === '.sketch';
                    }).map(item => {
                        return libraryFolder + item;
                    });
        
                    colorLibraryFiles.forEach(item => {
                        if (!allLibraries.includes(item)) {
                            unlinkSync(item);
                        }
                    });

                    UI.message('Colors have imported as a library.');
                }
            });

        }

    });
}
