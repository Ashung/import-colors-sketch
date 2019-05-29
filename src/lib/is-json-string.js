/**
 * Checking string is a JSON or not.
 * @param  {String} str
 * @returns {Boolean}
 */
export default function(str) {
    try {
        return JSON.parse(str) && true;
    } catch (err) {
        return false;
    }
}