import { UI } from 'sketch';
import sketch from 'sketch/dom';
import color from "./lib/color";
import sketchpreset2colors from './lib/sketchpreset-to-colors';

export default function(context) {

    const identifier = String(__command.identifier());

    if (identifier === 'remove-all-document-colors') {
        if (sketch.version.sketch >= 69) {
            UI.message('Not support.');
        } else {
            const document = sketch.getSelectedDocument();
            document.colors = [];
            UI.message('Document colors removed.');
        }
    }

}
