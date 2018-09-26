# request-hash

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Coverage percentage][coveralls-image]][coveralls-url]
[![License MIT][license-image]][license-url]

> Generate a hash from an express request

## Features

- Highly configurable
  - Options to hand-pick headers / cookies to use in order to create the hash
  - BYO serialization, encoding and hash algorithm with sane defaults
- Works with any [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) or [express.Request](http://expressjs.com/en/api.html#req)

## Installation

```sh
$ npm install --save request-hash
```

## Usage

Here's a simple example using express Hello world:

```js
const requestHash = require('request-hash')();
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send(requestHash(req)))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

## Alternatives

- [incoming-message-hash](https://github.com/flickr/incoming-message-hash)

## License

MIT © [Ruy Adorno](http://ruyadorno.com)


[npm-image]: https://badge.fury.io/js/request-hash.svg
[npm-url]: https://npmjs.org/package/request-hash
[travis-image]: https://travis-ci.org/ruyadorno/request-hash.svg?branch=master
[travis-url]: https://travis-ci.org/ruyadorno/request-hash
[daviddm-image]: https://david-dm.org/ruyadorno/request-hash.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ruyadorno/request-hash
[coveralls-image]: https://coveralls.io/repos/ruyadorno/request-hash/badge.svg
[coveralls-url]: https://coveralls.io/r/ruyadorno/request-hash
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: https://raw.githubusercontent.com/ruyadorno/request-hash/master/LICENSE
