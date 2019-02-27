export default {

    /**
     * @param  {Number} r 0..255
     * @param  {Number} g 0..255
     * @param  {Number} b 0..255
     * @param  {Number} a 0..1
     * @returns {NSColor}
     */
    colorWithRGBA (r, g, b, a) {
        return NSColor.colorWithRed_green_blue_alpha(r / 255, g / 255, b / 255, a);
    },

    /**
     * @param  {Number} h 0..360
     * @param  {Number} s 0..100
     * @param  {Number} b 0..100
     * @param  {Number} a 0..1
     * @returns {NSColor}
     */
    colorWithHSBA (h, s, b, a) {
        return NSColor.colorWithHue_saturation_brightness_alpha(h / 360, s / 100, b / 100, a);
    },

    /**
     * @param  {Number} c 0..100
     * @param  {Number} m 0..100
     * @param  {Number} y 0..100
     * @param  {Number} k 0..100
     * @param  {Number} a 0..1
     * @returns {NSColor}
     */
    colorWithCMYKA (c, m, y, k, a) {
        return NSColor.colorWithDeviceCyan_magenta_yellow_black_alpha(c / 100, m / 100, y / 100, k / 100, a);
    },

    /**
     * http://www.easyrgb.com/en/math.php
     * @param  {Number} l 0..100
     * @param  {Number} a -128..127
     * @param  {Number} b -128..127
     * @param  {Number} alpha 0..1
     * @returns {NSColor}
     */
    colorWithLABA (l, a, b, alpha) {
        // CIE lab to CIE XYZ
        let y = (l + 16) / 116;
        let x = a / 500 + y;
        let z = y - b / 200;

        y = y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787;
        x = x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787;
        z = z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787;

        // D65
        x = x * 95.047;
        y = y * 100;
        z = z * 108.883;

        // CIE XYZ to sRGB
        x = x / 100;
        y = y / 100;
        z = z / 100;

        let R = x * 3.2406 + y * -1.5372 + z * -0.4986;
        let G = x * -0.9689 + y * 1.8758 + z * 0.0415;
        let B = x * 0.0557 + y * -0.2040 + z * 1.0570;

        R = R > 0.0031308 ? 1.055 * Math.pow(R, 1 / 2.4) - 0.055 : 12.92 * R;
        G = G > 0.0031308 ? 1.055 * Math.pow(G, 1 / 2.4) - 0.055 : 12.92 * G;
        B = B > 0.0031308 ? 1.055 * Math.pow(B, 1 / 2.4) - 0.055 : 12.92 * B;

        return NSColor.colorWithRed_green_blue_alpha(R, G, B, alpha);
    },

    /**
     * @param  {Number} g grayscale 0..100 white..black
     * @param  {Number} a 0..1
     * @returns {NSColor}
     */
    colorWithGA (g, a) {
        return NSColor.colorWithWhite_alpha(1 - g / 100, a);
    },

    /**
     * http://www.nomodes.com/aco.html
     * @param  {Number} colorSpace 0: RGB, 1: HSB, 2: CMYK, 7: LAB, 8: Grayscale, 9, Wide CMYK
     * @param  {Number} w
     * @param  {Number} x
     * @param  {Number} y
     * @param  {Number} z
     * @returns {NSColor}
     */
    colorFromAco (colorSpace, w, x, y, z) {
        if (colorSpace === 0) {
            // w: 0..65535, x: 0..65535, y: 0..65535, z: 0
            return this.colorWithRGBA(w / 65535 * 255, x / 65535 * 255, y / 65535 * 255, 1.0);
        } else if (colorSpace === 1) {
            // w: 0..65535, x: 0..65535, y: 0..65535, z: 0
            return this.colorWithHSBA(w / 65535 * 360, x / 65535 * 100, y / 65535 * 100, 1.0);
        } else if (colorSpace === 2) {
            // w: 0..65535, x: 0..65535, y: 0..65535, z: 0..65535
            return this.colorWithCMYKA(100 - w / 65535 * 100, 100 - x / 65535 * 100, 100 - y / 65535 * 100, 100 - z / 65535 * 100, 1.0);
        } else if (colorSpace === 7) {
            // w: 0..10000, x: -12800..12700, y: -12800..12700, z: 0
            if (x > 12700) {
                x = x - 65535;
            }
            if (y > 12700) {
                y = y - 65535;
            }
            return this.colorWithLABA(w / 100, x / 100, y / 100, 1.0);
            
        } else if (colorSpace === 8) {
            // w: 0..10000, x: 0, y: 0, z: 0
            return this.colorWithGA(w / 10000 * 100, 1.0);
        } else if (colorSpace === 9) {
            // w: 0..10000, x: 0..10000, y: 0..10000, z: 0..10000
            return this.colorWithCMYKA(w / 10000 * 100, x / 10000 * 100, y / 10000 * 100, z / 10000 * 100, 1.0);
        } else {
            return null;
        }
    },

    /**
     * @param  {NSColor} nscolor
     * @param  {String} key
     * @param  {NSColorList} colorList
     * @param  {Object} keyCount
     */
    addColorToList (nscolor, key, colorList, keyCount) {
        if (keyCount[key]) {
            keyCount[key] ++;
        } else {
            keyCount[key] = 1;
        }
        if (keyCount[key] === 1) {
            colorList.setColor_forKey(nscolor, key);
        } else if (keyCount[key] === 2) {
            colorList.setColor_forKey(nscolor, key + ' Copy');
        } else {
            colorList.setColor_forKey(nscolor, key + ' Copy ' + (keyCount[key] - 1));
        }
    },

    /**
     * @param  {NSColor} nscolor
     * @returns {String}
     */
    toHexValue (nscolor) {
        let color = MSColor.colorWithNSColor(nscolor);
        return String(color.immutableModelObject().hexValue());
    },

    /**
     * @param  {Number} f 0..1
     * @returns {String}
     */
    floatToHex (f) {
        let hex = Math.round(f * 255).toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex.toUpperCase();
    },

    /**
     * @param  {String} name
     * @param  {String} hexValue #ffffff, #ffffffff
     * @returns {MSColorAsset}
     */
    colorAsset (name, hexValue) {
        let mscolor = MSImmutableColor.colorWithSVGString(hexValue).newMutableCounterpart();
        return MSColorAsset.alloc().initWithAsset_name(mscolor, name);
    },

    /**
     * @param  {String} name
     * @param  {Number} red 0..1
     * @param  {Number} green 0..1
     * @param  {Number} blue 0..1
     * @param  {Number} alpha 0..1
     * @returns {MSColorAsset}
     */
    colorAssetWithName_red_green_blue_alpha (name, red, green, blue, alpha) {
        let mscolor = MSColor.colorWithRed_green_blue_alpha(red, green, blue, alpha);
        return MSColorAsset.alloc().initWithAsset_name(mscolor, name);
    },

    /**
     * @param  {NSColorList} colorList
     * @returns {Object}
     */
    toObject (colorList) {
        let colors = {
            name: colorList.name(),
            items: []
        };
        colorList.allKeys().forEach(key => {
            let nscolor = colorList.colorWithKey(key);
            colors.items.push({
                name: key,
                color: '#' + String(this.toHexValue(nscolor)) + this.floatToHex(nscolor.alphaComponent()),
            });
        });
        return colors;
    }

}
