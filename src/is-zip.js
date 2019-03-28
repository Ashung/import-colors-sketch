import { Buffer } from 'buffer';
import { readFileSync } from '@skpm/fs';

export default function(filePath) {
    let contents = readFileSync(filePath);
    let buffer = Buffer.from(contents);

    if (!buffer || buffer.length < 4) {
        return false;
    }

    return buffer[0] === 0x50 &&
        buffer[1] === 0x4B &&
        (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
        (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08);
}