import qs from 'qs';

export const parseQueryString = (queryString: string) => {
  return qs.parse(queryString, {
    decoder(str, defaultDecoder, charset, type) {
      if (type === 'value') {
        if (str === '') return '';

        if (str === 'true') return true;
        if (str === 'false') return false;

        if (str === 'null') return null;

        if (str === 'undefined') return undefined;

        if (/^[+-]?\d+(\.\d+)?$/.test(str) && Number.isFinite(Number(str))) return Number(str);

        if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('{') && str.endsWith('}'))) {
          try {
            return JSON.parse(str);
          } catch (e) {
            return str;
          }
        }

        return str;
      }

      return defaultDecoder(str, charset);
    },
    arrayLimit: 100,
    depth: 10,
    parameterLimit: 1000,
  });
};
