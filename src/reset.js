import { UI } from 'sketch';
import color from "./lib/color";
import sketchpreset2colors from './lib/sketchpreset-to-colors';

export default function(context) {

    let preset = NSBundle.mainBundle().bundlePath() + '/Contents/Resources/assets.sketchpreset';
    let colors = sketchpreset2colors(preset);

    let assetCollection = MSPersistentAssetCollection.sharedGlobalAssets();
    assetCollection.removeAllColorAssets();

    colors.forEach(item => {
        let colorAsset = color.colorAsset(item.name, item.color);
        assetCollection.addColorAsset(colorAsset);
    });

    UI.message('Reset to default global colors.');

}
