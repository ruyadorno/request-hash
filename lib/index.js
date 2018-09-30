'use strict';

const crypto = require('crypto');
const { parse: urlParse } = require('url');

const { parse: cookieParse } = require('cookie');

const sep = '\n';

module.exports = function(opts) {
  const { algorithm, cookies, encoding, expand, headers, serializer } =
    opts || {};

  const filterObjectKeys = (obj, keys) => {
    if (keys) {
      return keys.reduce((acc, key) => {
        if (obj[key] !== undefined) {
          acc[key] = obj[key];
        }
        return acc;
      }, {});
    }
    return obj;
  };

  const defaultSerializer = elem =>
    elem && typeof elem === 'object'
      ? Object.entries(elem)
          .map(i => [i[0], defaultSerializer(i[1])])
          .sort()
          .join(sep)
      : String(elem);

  const getFeed = (title, elem) => {
    const serialized = (serializer || defaultSerializer)(elem);
    return elem && serialized ? [title, serialized].join(sep) : '';
  };

  const getCookies = req =>
    filterObjectKeys(
      cookieParse((req.headers && req.headers.cookie) || ''),
      cookies
    );

  const getHeaders = req => {
    const h = Object.assign({}, req.headers);
    const keys =
      headers && headers.length && cookies && cookies.length
        ? ['cookie'].concat(headers)
        : headers;

    if (h.cookie) {
      h.cookie = getCookies(req);
    }

    return filterObjectKeys(h, keys);
  };

  const requestHash = function(req) {
    const methodFeed = getFeed(
      'method:',
      req.method && req.method.toLowerCase()
    );
    const pathnameFeed = getFeed('pathname:', urlParse(req.url || '').pathname);
    const queryFeed = getFeed('query:', urlParse(req.url || '', true).query);
    const dataFeed = getFeed('data:', req.body);
    const headersFeed = getFeed('headers:', getHeaders(req));

    const feed = [methodFeed, pathnameFeed, queryFeed, dataFeed, headersFeed]
      .filter(Boolean)
      .join(sep);

    return expand
      ? feed
      : crypto
          .createHash(algorithm || 'sha256')
          .update(feed)
          .digest(encoding || 'hex');
  };

  requestHash.defaultSerializer = defaultSerializer;
  requestHash.getFeed = getFeed;
  requestHash.getCookies = getCookies;
  requestHash.getHeaders = getHeaders;

  return requestHash;
};
