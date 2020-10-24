import { UI } from 'sketch';
import { Document, Artboard, ShapePath, Rectangle, Library, Style, Swatch } from 'sketch/dom';
import sketch from 'sketch/dom';
import { extname, basename } from 'path';
import os from 'os';
import dialog from '@skpm/dialog';
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from '@skpm/fs';
import color from './lib/color';
import clr2colors from './lib/clr-to-colors';
import gpl2colors from './lib/gpl-to-colors';
import aco2colors from './lib/aco-to-colors';
import act2colors from './lib/act-to-colors';
import ase2colors from './lib/ase-to-colors';
import sketchpreset2colors from './lib/sketchpreset-to-colors';
import sketchpalette2colors from './lib/sketchpalette-to-colors';
import sketch2colors from './lib/sketch-to-colors';
import txt2colors from './lib/txt-to-colors';

export default function(context) {

    const identifier = String(__command.identifier());

    dialog.showOpenDialog({
        filters: [
            { name: 'Apple Color Picker Palette', extensions: [ 'clr' ] },
            { name: 'Adobe Color Swatch', extensions: [ 'aco' ] },
            { name: 'Adobe Color Table', extensions: [ 'act' ] },
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
          } else if (fileType === '.act') {
            colors = act2colors(filePath);
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

        if (identifier === 'import-colors-to-color-variables') {

            let document = sketch.getSelectedDocument();
            let swatches = document.swatches;
            if (swatches.length === 0) {
                dialog.showMessageBox(
                    {
                        type: 'none',
                        buttons: ['OK', 'Cancel'],
                        message: 'Import colors from "' + fileName + '"?',
                        checkboxLabel: 'Auto add numbers in front of Color Variables.',
                        checkboxChecked: true
                    },
                    ({ response, checkboxChecked }) => {
                        if (response === 0) {
                            addColorVariables(checkboxChecked);
                        } else {
                            return;
                        }
                    }
                );
            } else {
                dialog.showMessageBox(
                    {
                        type: 'none',
                        buttons: ['OK', 'Cancel', 'Append'],
                        message: 'Remove all existing color variables, before import colors from "' + fileName + '"?',
                        checkboxLabel: 'Auto add numbers in front of Color Variables.',
                        checkboxChecked: true
                    },
                    ({ response, checkboxChecked }) => {
                        if (response === 0) {
                            removeAllColorVariables();
                            addColorVariables(checkboxChecked);
                        } else if (response === 1) {
                            return;
                        } else if (response === 2) {
                            addColorVariables(checkboxChecked);
                        }
                    }
                );
            }

            function removeAllColorVariables() {
                document.swatches = [];
            }

            function addColorVariables(addNumber) {
                colors.forEach((item, index) => {
                    const swatch = Swatch.from({
                        name: (addNumber ? `${index + 1}. ` : '') + item.name,
                        color: item.color
                    });
                    swatches.push(swatch);
                });
                UI.message(`Import ${colors.length} color variable${colors.length > 1 ? 's' : ''} to document.`);
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
                    let keyCount = {};
                    let text = color.toTextContent(colors, keyCount);
                    writeFileSync(filePath, text);
                    UI.message('Colors have convert to .txt file.');
                }
            );
        }

        else if (identifier === 'import-colors-as-library') {

            dialog.showMessageBox(
                {
                    type: 'none',
                    buttons: ['OK', 'Cancel'],
                    message: 'Import colors as library from "' + fileName + '"?',
                    checkboxLabel: 'Auto add numbers in front of Color Variables.',
                    checkboxChecked: true
                },
                ({ response, checkboxChecked }) => {
                    if (response === 1) {
                        return;
                    } else {

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
                            frame: new Rectangle(0, 0, 400, 400)
                        });

                        colors.forEach((item, index) => {

                            // Add colors
                            const colorName = (checkboxChecked ? `${index + 1}. ` : '') + item.name;
                            const swatch = Swatch.from({
                                name: colorName,
                                color: item.color
                            });
                            document.swatches.push(swatch);

                            // Add layers 4 x 4
                            if (index < 16) {
                                let x = (index % 4) * 90 + 40;
                                let y = Math.floor(index / 4) * 90 + 40;
                                const layer = new ShapePath({
                                    name: colorName,
                                    parent: artboard,
                                    shapeType: ShapePath.ShapeType.Oval,
                                    frame: new Rectangle(x, y, 50, 50),
                                    style: {
                                        fills: [
                                            {
                                                color: swatch.referencingColor
                                            }
                                        ],
                                        borders: [
                                            {
                                                color: '#0000001A',
                                                fillType: Style.FillType.Color,
                                                position: Style.BorderPosition.Inside
                                            }
                                        ]
                                    }
                                });
                            }

                        });

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
                }
            );

        }

        else if (identifier === 'import-colors-and-update-color-variables') {
            let document = sketch.getSelectedDocument();
            let swatches = document.swatches;
            let names = swatches.map(item => item.name);
            let countNew = 0;
            let countUpdate = 0;
            colors.forEach(item => {
                if (names.includes(item.name)) {
                    let mscolor = color.mscolorWithHex(item.color);
                    let swatch = swatches.find(_item => _item.name === item.name);
                    swatch.sketchObject.updateWithColor(mscolor);
                    let swatchContainer = document._getMSDocumentData().sharedSwatches();
                    swatchContainer.updateReferencesToSwatch(swatch.sketchObject);
                    countUpdate ++;
                } else {
                    swatches.push(Swatch.from({
                        name: item.name,
                        color: item.color
                    }));
                    countNew ++;
                }
                UI.message(`Add: ${countNew}, Update: ${countUpdate}.`);
            });
        }
    });
}