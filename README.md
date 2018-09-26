# request-hash

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage percentage][coveralls-image]][coveralls-url]
[![License MIT][license-image]][license-url]

> Generate a hash from an express Request or http.IncomingMessage

## Features

- Highly configurable
  - Options to **hand-pick / filter** which **headers** and **cookies** to use in order to create the hash
  - BYO **serialization**, **encoding** and **hashing algorithm** with sane defaults
- Works with any [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) or [express.Request](http://expressjs.com/en/api.html#req)

## Installation

```sh
$ npm install --save request-hash
```

## Usage

Here's a simple example using an express app:

```js
const requestHash = require('request-hash');
const express = require('express')
const app = express()
const port = 3000

// Initialize hash method using custom options
const hash = requestHash({ serializer: JSON.stringify, algorithm: 'md5' });

app.get('/', (req, res) => res.send(hash(req)))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

## API

The API exposes an initialization function which receives the options in order to customize the hash, this main funciton returns another function that actually performs the hashing.

### requestHash(options)

```js
const requestHash = require('request-hash');
requestHash({
  algorithm: 'sha256',
  encoding: 'hex',
  expand: false,
  cookies: undefined, // undefined means all cookies are going to be used as-is
  headers: undefined, // undefined means all headers are going to be used as-is
  serializer: undefined // undefined means custom serialize function is going to be used
});
```

#### Options

- **algorithm:** `<string>` Defines which hash algorithm to use, [possible values depends on the supported OpenSSL version in the platform](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options). Examples are `sha256`, `sha512`, `md5`, etc.
- **digest:** `<string>` Defines a custom encoding to be used, possible values are: `hex`, `latin1`, `base64`.
- **serializer** `<function>` An object serialization function to be used, if undefined uses a custom implementation
- **expand:** `<boolean>` Allows you to bypass the hash algorithm, just returns the concatenated elements
- **cookies:** `<array>` List of cookie keys to be used to create the unique hash, defaults to using all elements
- **headers:** `<array>` List of header keys to be used to create the unique hash, defaults to using all elements

### hash(request:http.IncomingMessage)

```js
const requestHash = require('request-hash');
const hash = requestHash();

hash(req);
```

## Alternatives

- [incoming-message-hash](https://github.com/flickr/incoming-message-hash)

## License

MIT © [Ruy Adorno](http://ruyadorno.com)


[npm-image]: https://badge.fury.io/js/request-hash.svg
[npm-url]: https://npmjs.org/package/request-hash
[travis-image]: https://travis-ci.org/ruyadorno/request-hash.svg?branch=master
[travis-url]: https://travis-ci.org/ruyadorno/request-hash
[coveralls-image]: https://coveralls.io/repos/ruyadorno/request-hash/badge.svg
[coveralls-url]: https://coveralls.io/r/ruyadorno/request-hash
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: https://raw.githubusercontent.com/ruyadorno/request-hash/master/LICENSE
