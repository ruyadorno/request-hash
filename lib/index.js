'use strict';

const crypto = require('crypto');

const sep = '\n';

module.exports = function(opts) {
  const { algorithm, expand, headers } = opts || {};

  const serialize = elem =>
    elem && typeof elem === 'object'
      ? Object.entries(elem)
          .map(i => [i[0], serialize(i[1])])
          .sort()
          .join(sep)
      : String(elem);

  const getFeed = (title, elem) =>
    elem ? [title, serialize(elem)].join(sep) : '';

  const getHeaders = req => {
    if (headers && headers.length) {
      return headers.reduce((acc, key) => {
        acc[key] = req.headers[key];
        return acc;
      }, {});
    }
    return req.headers;
  };

  const requestHash = function(req) {
    const methodFeed = getFeed('method:', req.method);
    const queryFeed = getFeed('query:', req.query);
    const dataFeed = getFeed('data:', req.body);
    const headersFeed = getFeed('headers:', getHeaders(req));

    const feed = [methodFeed, queryFeed, dataFeed, headersFeed]
      .filter(Boolean)
      .join(sep);

    return expand
      ? feed
      : crypto
          .createHash(algorithm || 'sha256')
          .update(feed)
          .digest('hex');
  };

  requestHash.serialize = serialize;
  requestHash.getFeed = getFeed;
  requestHash.getHeaders = getHeaders;

  return requestHash;
};
