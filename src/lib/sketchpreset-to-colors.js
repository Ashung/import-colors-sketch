import { readFileSync } from '@skpm/fs';
import color from './color';
import isJSONString from './is-json-string';
import isZip from './is-zip';
import sketch from 'sketch/dom';
import { UI } from 'sketch';
import { toArray } from 'util';

/**
 * Get colors from Sketch .sketchpreset file.
 * @param  {String} filePath
 * @returns {Array} [ {name, color} ]
 */
export default function(filePath) {

    let assetContent = readFileSync(filePath, 'utf-8');

    // Sketch < 54 sketchpreset is JSON file
    if (isJSONString(assetContent)) {
        let colors = JSON.parse(assetContent).root.colorAssets;

        colors = colors.map(item => {
            let colorName = item.name;
            let nscolor = color.colorWithRGBA(
                item.color.red * 255,
                item.color.green * 255,
                item.color.blue * 255,
                item.color.alpha
            );
            let hexValue = color.toHexValue(nscolor);
            return {
                name: colorName,
                color: hexValue
            };
        });

        return colors;
    }
    
    // Sketch 54+ sketchpreset is ZIP file
    if (isZip(filePath)) {
        if (sketch.version.sketch >= 54) {
            let nativeAssets = MSPersistentAssetCollection.assetCollectionWithURL(NSURL.fileURLWithPath(filePath));
            let colors = toArray(nativeAssets.colorAssets()).map(asset => {
                let hexValue = color.toHexValue(asset.color());
                return {
                    name: String(asset.name()),
                    color: hexValue
                }
            });
            return colors;
        } else {
            UI.message('This sketch preset file need to open with Sketch 54+.');
            return;
        }
    }

}