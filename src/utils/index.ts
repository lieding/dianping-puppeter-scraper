export function objectFlatten (obj: object, ret: object = {}) {
  Object.keys(obj).forEach(key => {
    const val = obj[key];
    const type = typeof val;
    switch (type) {
      case 'undefined':
        break;
      case 'object':
        if (Array.isArray(val)) {
          ret[key] = val;
        } else if (val === null) {
          break;
        } else {
          objectFlatten(val, ret);
        }
        break;
      default:
        ret[key] = val;
    }
  })
  return ret;
}