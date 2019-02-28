import { readFileSync } from '@skpm/fs';
import color from "./color";

export default function(filePath) {

    let assetContent = readFileSync(filePath, 'utf-8');
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