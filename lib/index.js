'use strict';

const crypto = require('crypto');

const sep = '\n';

module.exports = function(opts) {
  const { algorithm, expand, headers } = opts || {};

  const serialize = obj =>
    Object.entries(obj)
      .sort()
      .join(sep);

  const getSerializer = elem => (typeof elem === 'object' ? serialize : String);

  const getFeed = (title, elem) =>
    elem ? [title, getSerializer(elem)(elem)].join(sep) : '';

  const getHeaders = req => {
    if (headers && headers.length) {
      return headers.reduce((acc, key) => {
        acc[key] = req[key];
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
  requestHash.getSerializer = getSerializer;
  requestHash.getFeed = getFeed;

  return requestHash;
};
