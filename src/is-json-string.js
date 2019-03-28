
export default function(str) {
    try {
        return JSON.parse(str) && true;
    } catch (err) {
        return false;
    }
}