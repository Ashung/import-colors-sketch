export default {

    /**
     * @param  {String} hexValue #[0-9A-F]{3,8}
     * @returns {NSColor} NSColor
     */
    colorWithHex (hexValue) {
        return MSImmutableColor.colorWithSVGString(hexValue).NSColorWithColorSpace(nil);
    },

    /**
     * @param  {String} hexValue #[0-9A-F]{3,8}
     * @returns {MSColor} MSColor
     */
    mscolorWithHex (hexValue) {
        return MSImmutableColor.colorWithSVGString(hexValue).newMutableCounterpart();
    },

    /**
     * @param  {Number} r 0..255
     * @param  {Number} g 0..255
     * @param  {Number} b 0..255
     * @param  {Number} a 0..1
     * @returns {NSColor} NSColor
     */
    colorWithRGBA (r, g, b, a) {
        return NSColor.colorWithRed_green_blue_alpha(r / 255, g / 255, b / 255, a);
    },

    /**
     * @param  {Number} h 0..360
     * @param  {Number} s 0..100
     * @param  {Number} l 0..100
     * @param  {Number} a 0..1
     * @returns {NSColor} NSColor
     */
    colorWithHSLA (h, s, l, a) {
        h = h / 360;
        s = s / 100;
        l = l / 100;
        let r, g, b;
        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1 / 6) return p + (q - p) * 6 * t;
                if(t < 1 / 2) return q;
                if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return NSColor.colorWithRed_green_blue_alpha(r, g, b, a);
    },

    /**
     * @param  {Number} h 0..360
     * @param  {Number} s 0..100
     * @param  {Number} b 0..100
     * @param  {Number} a 0..1
     * @returns {NSColor} NSColor
     */
    colorWithHSBA (h, s, b, a) {
        return NSColor.colorWithHue_saturation_brightness_alpha(h / 360, s / 100, b / 100, a);
    },

    /**
     * @param  {String} name CSS color name
     * @returns {NSColor} NSColor
     */
    colorWithName (name) {
        let colors = {
            'aliceblue': [240, 248, 255],
            'antiquewhite': [250, 235, 215],
            'aqua': [0, 255, 255],
            'aquamarine': [127, 255, 212],
            'azure': [240, 255, 255],
            'beige': [245, 245, 220],
            'bisque': [255, 228, 196],
            'black': [0, 0, 0],
            'blanchedalmond': [255, 235, 205],
            'blue': [0, 0, 255],
            'blueviolet': [138, 43, 226],
            'brown': [165, 42, 42],
            'burlywood': [222, 184, 135],
            'cadetblue': [95, 158, 160],
            'chartreuse': [127, 255, 0],
            'chocolate': [210, 105, 30],
            'coral': [255, 127, 80],
            'cornflowerblue': [100, 149, 237],
            'cornsilk': [255, 248, 220],
            'crimson': [220, 20, 60],
            'cyan': [0, 255, 255],
            'darkblue': [0, 0, 139],
            'darkcyan': [0, 139, 139],
            'darkgoldenrod': [184, 134, 11],
            'darkgray': [169, 169, 169],
            'darkgreen': [0, 100, 0],
            'darkgrey': [169, 169, 169],
            'darkkhaki': [189, 183, 107],
            'darkmagenta': [139, 0, 139],
            'darkolivegreen': [85, 107, 47],
            'darkorange': [255, 140, 0],
            'darkorchid': [153, 50, 204],
            'darkred': [139, 0, 0],
            'darksalmon': [233, 150, 122],
            'darkseagreen': [143, 188, 143],
            'darkslateblue': [72, 61, 139],
            'darkslategray': [47, 79, 79],
            'darkslategrey': [47, 79, 79],
            'darkturquoise': [0, 206, 209],
            'darkviolet': [148, 0, 211],
            'deeppink': [255, 20, 147],
            'deepskyblue': [0, 191, 255],
            'dimgray': [105, 105, 105],
            'dimgrey': [105, 105, 105],
            'dodgerblue': [30, 144, 255],
            'firebrick': [178, 34, 34],
            'floralwhite': [255, 250, 240],
            'forestgreen': [34, 139, 34],
            'fuchsia': [255, 0, 255],
            'gainsboro': [220, 220, 220],
            'ghostwhite': [248, 248, 255],
            'gold': [255, 215, 0],
            'goldenrod': [218, 165, 32],
            'gray': [128, 128, 128],
            'green': [0, 128, 0],
            'greenyellow': [173, 255, 47],
            'grey': [128, 128, 128],
            'honeydew': [240, 255, 240],
            'hotpink': [255, 105, 180],
            'indianred': [205, 92, 92],
            'indigo': [75, 0, 130],
            'ivory': [255, 255, 240],
            'khaki': [240, 230, 140],
            'lavender': [230, 230, 250],
            'lavenderblush': [255, 240, 245],
            'lawngreen': [124, 252, 0],
            'lemonchiffon': [255, 250, 205],
            'lightblue': [173, 216, 230],
            'lightcoral': [240, 128, 128],
            'lightcyan': [224, 255, 255],
            'lightgoldenrodyellow': [250, 250, 210],
            'lightgray': [211, 211, 211],
            'lightgreen': [144, 238, 144],
            'lightgrey': [211, 211, 211],
            'lightpink': [255, 182, 193],
            'lightsalmon': [255, 160, 122],
            'lightseagreen': [32, 178, 170],
            'lightskyblue': [135, 206, 250],
            'lightslategray': [119, 136, 153],
            'lightslategrey': [119, 136, 153],
            'lightsteelblue': [176, 196, 222],
            'lightyellow': [255, 255, 224],
            'lime': [0, 255, 0],
            'limegreen': [50, 205, 50],
            'linen': [250, 240, 230],
            'magenta': [255, 0, 255],
            'maroon': [128, 0, 0],
            'mediumaquamarine': [102, 205, 170],
            'mediumblue': [0, 0, 205],
            'mediumorchid': [186, 85, 211],
            'mediumpurple': [147, 112, 219],
            'mediumseagreen': [60, 179, 113],
            'mediumslateblue': [123, 104, 238],
            'mediumspringgreen': [0, 250, 154],
            'mediumturquoise': [72, 209, 204],
            'mediumvioletred': [199, 21, 133],
            'midnightblue': [25, 25, 112],
            'mintcream': [245, 255, 250],
            'mistyrose': [255, 228, 225],
            'moccasin': [255, 228, 181],
            'navajowhite': [255, 222, 173],
            'navy': [0, 0, 128],
            'oldlace': [253, 245, 230],
            'olive': [128, 128, 0],
            'olivedrab': [107, 142, 35],
            'orange': [255, 165, 0],
            'orangered': [255, 69, 0],
            'orchid': [218, 112, 214],
            'palegoldenrod': [238, 232, 170],
            'palegreen': [152, 251, 152],
            'paleturquoise': [175, 238, 238],
            'palevioletred': [219, 112, 147],
            'papayawhip': [255, 239, 213],
            'peachpuff': [255, 218, 185],
            'peru': [205, 133, 63],
            'pink': [255, 192, 203],
            'plum': [221, 160, 221],
            'powderblue': [176, 224, 230],
            'purple': [128, 0, 128],
            'rebeccapurple': [102, 51, 153],
            'red': [255, 0, 0],
            'rosybrown': [188, 143, 143],
            'royalblue': [65, 105, 225],
            'saddlebrown': [139, 69, 19],
            'salmon': [250, 128, 114],
            'sandybrown': [244, 164, 96],
            'seagreen': [46, 139, 87],
            'seashell': [255, 245, 238],
            'sienna': [160, 82, 45],
            'silver': [192, 192, 192],
            'skyblue': [135, 206, 235],
            'slateblue': [106, 90, 205],
            'slategray': [112, 128, 144],
            'slategrey': [112, 128, 144],
            'snow': [255, 250, 250],
            'springgreen': [0, 255, 127],
            'steelblue': [70, 130, 180],
            'tan': [210, 180, 140],
            'teal': [0, 128, 128],
            'thistle': [216, 191, 216],
            'tomato': [255, 99, 71],
            'turquoise': [64, 224, 208],
            'violet': [238, 130, 238],
            'wheat': [245, 222, 179],
            'white': [255, 255, 255],
            'whitesmoke': [245, 245, 245],
            'yellow': [255, 255, 0],
            'yellowgreen': [154, 205, 50]
        };
        if (colors[name.toLowerCase()]) {
            let r = colors[name][0] / 255;
            let g = colors[name][1] / 255;
            let b = colors[name][2] / 255;
            return NSColor.colorWithRed_green_blue_alpha(r, g, b, 1);
        }
    },

    /**
     * @param  {Number} c 0..100
     * @param  {Number} m 0..100
     * @param  {Number} y 0..100
     * @param  {Number} k 0..100
     * @param  {Number} a 0..1
     * @returns {NSColor} NSColor
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
     * @returns {NSColor} NSColor
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

        R = Math.min(Math.max(0, R), 1);
        G = Math.min(Math.max(0, G), 1);
        b = Math.min(Math.max(0, B), 1);

        return NSColor.colorWithRed_green_blue_alpha(R, G, B, alpha);
    },

    /**
     * @param  {Number} g grayscale 0..100 white..black
     * @param  {Number} a 0..1
     * @returns {NSColor} NSColor
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
     * @returns {NSColor} NSColor
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
        if (!isNaN(keyCount[key])) {
            keyCount[key] ++;
        } else {
            keyCount[key] = 1;
        }
        if (keyCount[key] === 1) {
            colorList.setColor_forKey(nscolor, key);
        } else {
            colorList.setColor_forKey(nscolor, key + ' ' + keyCount[key]);
        }
    },

    /**
     * @param  {Array} colorsArray
     * @returns  {NSColorList} NSColorList
     */
    colorListFromArray (colorsArray) {
        let colorList = NSColorList.alloc().initWithName(null);
        let keyCount = {};
        colorsArray.forEach(item => {
            let nscolor = this.colorWithHex(item.color);
            let colorName = item.name || item.color;
            this.addColorToList(nscolor, colorName, colorList, keyCount);
        });
        return colorList;
    },

    /**
     * @param  {NSColor} nscolor
     * @returns {String} [0-9A-F]{6|8}
     */
    toHexValue (nscolor) {
        let color;
        if (String(nscolor.class()) === 'MSColor') {
            color = nscolor;
        } else {
            color = MSColor.colorWithNSColor(nscolor);
        }
        if (color.alpha() === 1) {
            return '#' + String(color.immutableModelObject().hexValue());
        } else {
            return '#' + String(color.immutableModelObject().hexValue()) + this.floatToHex(color.alpha());
        }
    },

    /**
     * @param  {Number} f 0..1
     * @returns {String} [A-F]
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
     * @returns {MSColorAsset} MSColorAsset
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
     * @returns {MSColorAsset} MSColorAsset
     */
    colorAssetWithName_red_green_blue_alpha (name, red, green, blue, alpha) {
        let mscolor = MSColor.colorWithRed_green_blue_alpha(red, green, blue, alpha);
        return MSColorAsset.alloc().initWithAsset_name(mscolor, name);
    },

    /**
     * @param  {NSColorList} colorList
     * @returns {Array} [{name, color}]
     */
    toArray (colorList) {
        let colors = [];
        colorList.allKeys().forEach(key => {
            let nscolor = colorList.colorWithKey(key);
            colors.push({
                name: key,
                color: this.toHexValue(nscolor),
            });
        });
        return colors;
    },

    /**
     * @param  {String | Null} name
     * @returns {String | Null} String
     */
    cleanName (name) {
        if (name !== null) {
            name = name.replace(/\sCopy(\s\d+)?/, '');
        }
        return name;
    },

    /**
     * @param  {Array} colorArray [{name, color}]
     * @param  {Object} keyCount
     * @returns {String} name: #FFFFFF
     */
    toTextContent (colorArray, keyCount) {
        let text = '';
        colorArray.forEach(item => {
            let name = item.name;
            let color = item.color;
            if (!isNaN(keyCount[name])) {
                keyCount[name] ++;
            } else {
                keyCount[name] = 1;
            }
            if (keyCount[name] === 1) {
                name = item.name;
            } else {
                name += ' ' + keyCount[name];
            }
            if (/^#[0-9A-F]{6}FF$/i.test(item.color)) {
                color = item.color.substr(0, 7);
            }
            text += name + ': ' + color + '\n';
        });
        return text;
    }

}
