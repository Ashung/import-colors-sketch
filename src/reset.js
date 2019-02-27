import { UI } from 'sketch';
import { readFileSync } from '@skpm/fs';
import color from "./color";

export default function(context) {

    let preset = NSBundle.mainBundle().bundlePath() + '/Contents/Resources/assets.sketchpreset';
    let assetContent = readFileSync(preset, 'utf-8');
    let defaultColorAssets = JSON.parse(assetContent).root.colorAssets;

    let assetCollection = MSPersistentAssetCollection.sharedGlobalAssets();
    assetCollection.removeAllColorAssets();

    defaultColorAssets.forEach(item => {
        let colorAsset = color.colorAssetWithName_red_green_blue_alpha(
            item.name,
            item.color.red,
            item.color.green,
            item.color.blue,
            item.color.alpha
        );
        assetCollection.addColorAsset(colorAsset);
    });

    UI.message('Reset to default global colors.');

}
