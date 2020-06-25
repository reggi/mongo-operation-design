/**
 * Helper function for either accepting a callback, or returning a promise
 *
 * @param {?Function} callback The last function argument in exposed method, controls if a Promise is returned
 * @param {Function} wrapper A function that wraps the callback
 * @returns {Promise|void} Returns nothing if a callback is supplied, else returns a Promise.
 */
export function maybePromise(callback, wrapper) {
  let result;
  if (typeof callback !== 'function') {
    result = new Promise((resolve, reject) => {
      callback = (err, res) => {
        if (err) return reject(err);
        resolve(res);
      };
    });
  }

  wrapper(function(err, res) {
    if (err != null) {
      try {
        callback(err, null);
      } catch (error) {
        return process.nextTick(() => {
          throw error;
        });
      }
      return;
    }

    callback(err, res);
  });

  return result;
}