function snakeToCamel(obj) {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
      result[camelKey] = snakeToCamel(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

module.exports = { snakeToCamel };
