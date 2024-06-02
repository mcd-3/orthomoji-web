/**
 * Pauses execution for a set amount of time
 * 
 * @param {number} ms - Amount of time in milliseconds to pause for
 * @returns {Promise}
 */
const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { wait };
