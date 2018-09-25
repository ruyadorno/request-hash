const getRequestHash = require('..');

describe('serialize', () => {
  const { serialize } = getRequestHash();

  it('should serialize a simple object', () => {
    expect(serialize({ foo: 'bar' })).toBe('foo,bar');
  });

  it('should serialize a multi-level object', () => {
    expect(
      serialize({
        foo: {
          bar: /bar/,
          lorem: {
            ipsum: 'ipsum'
          }
        },
        dolor: {
          sit: 0,
          met: 15.45
        }
      })
    ).toBe('dolor,met,15.45\nsit,0\nfoo,bar,\nlorem,ipsum,ipsum');
  });

  it('should serialize falsy edge cases', () => {
    expect(serialize(NaN)).toBe('NaN');
    expect(serialize(0)).toBe('0');
    expect(serialize()).toBe('undefined');
    expect(serialize(null)).toBe('null');
  });
});

describe('getFeed', () => {
  const { getFeed } = getRequestHash();

  it('should retrieve a formatted string', () => {
    expect(getFeed('foo', 'bar')).toBe('foo\nbar');
  });

  it('should retrieve empty string for falsy elems', () => {
    expect(getFeed('foo', NaN)).toBe('');
    expect(getFeed('foo', 0)).toBe('');
    expect(getFeed('foo')).toBe('');
    expect(getFeed('foo', null)).toBe('');
  });
});

describe('getHeaders', () => {
  describe('default', () => {
    const { getHeaders } = getRequestHash();

    it('should pass through on default config', () => {
      expect(getHeaders({ headers: 'foo' })).toBe('foo');
    });
  });
  describe('headers', () => {
    const { getHeaders } = getRequestHash({
      headers: ['content-type', 'cookie']
    });

    it('should return only specified headers', () => {
      expect(
        getHeaders({
          headers: {
            'x-foo': 'foo',
            'content-type': 'application/json',
            cookie: 'foo=bar'
          }
        })
      ).toEqual({ 'content-type': 'application/json', cookie: 'foo=bar' });
    });
  });
});

describe('requestHash', () => {
  describe('defaults', () => {
    const requestHash = getRequestHash();

    it('should print empty feed on no valid params', () => {
      expect(requestHash({})).toBe(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      );
    });

    it('should print only method result if only method is available', () => {
      expect(requestHash({ method: 'POST' })).toBe(
        '98bff001039b32480416592646bd5150a9e9032b0bc68739cbc1995a08d51984'
      );
    });

    it('should print only query result if only query value is available', () => {
      expect(requestHash({ query: 'q=foo+bar' })).toBe(
        '98529eb2d97346c755e897de279c55f41f8b8af9e08bd89bc8e8f339cff2f18b'
      );
    });

    it('should print only data result if only data value is available', () => {
      expect(requestHash({ body: { foo: 'bar' } })).toBe(
        'e84591958397f12278b8c24ab713ad5e08899a8c111677fe8f5fd0c4d78ea1b0'
      );
    });

    it('should print only data result if type string', () => {
      expect(requestHash({ body: 'foo=bar' })).toBe(
        '9c9390d0ead68415513391b6a03f403bf2ac604fc709f6ad9c6ef3bcc50c133d'
      );
    });

    it('should print only data result if type number', () => {
      expect(requestHash({ body: 12020 })).toBe(
        'af45b8832d650393aec38dc463dcd6bd73a1af37d2e4a6404f8bd8afcb80a381'
      );
    });

    it('should print only data result if type boolean', () => {
      expect(requestHash({ body: true })).toBe(
        '6dd343d34f6170ffa03cef92ebba02126c97d8edf6c7dd9e41644904f82c1aa6'
      );
    });

    it('should print only headers if only headers value is available', () => {
      expect(requestHash({ headers: { Cookie: 'foo=bar' } })).toBe(
        'f6a4debd9da0d569cb5cefad7ca4020ad40c654bb9d61e0e139af92ccd0a1215'
      );
    });

    it('should print a complete feed if available', () => {
      expect(
        requestHash({
          body: 'foo=bar',
          method: 'POST',
          query: 'q=1',
          headers: { 'Content-Type': 'application/json' }
        })
      ).toBe(
        '282e4268b71f189bcab9c869a3efbe8915fcaa6294f43f2eed41ed9c565c9f8b'
      );
    });
  });

  describe('algorithm', () => {
    const requestHash = getRequestHash({ algorithm: 'md5' });

    it('should print empty feed on no valid params', () => {
      expect(requestHash({})).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });

    it('should print only method result if only method is available', () => {
      expect(requestHash({ method: 'POST' })).toBe(
        '7a10d95bd88ce660296dd8afac8310a4'
      );
    });

    it('should print only query result if only query value is available', () => {
      expect(requestHash({ query: 'q=foo+bar' })).toBe(
        'fe5890bd19886708940a630921037466'
      );
    });

    it('should print only data result if only data value is available', () => {
      expect(requestHash({ body: { foo: 'bar' } })).toBe(
        '83dc96152fe5a4bd1fb1da86fa408bea'
      );
    });

    it('should print only data result if type string', () => {
      expect(requestHash({ body: 'foo=bar' })).toBe(
        'c33a8387de5a9add04bf25fa92f01e83'
      );
    });

    it('should print only data result if type number', () => {
      expect(requestHash({ body: 12020 })).toBe(
        '56b9ff4ba638aaab82deee59b686a383'
      );
    });

    it('should print only data result if type boolean', () => {
      expect(requestHash({ body: true })).toBe(
        '0bd1fe572276db001ab1dcb1181d497c'
      );
    });

    it('should print only headers if only headers value is available', () => {
      expect(requestHash({ headers: { Cookie: 'foo=bar' } })).toBe(
        'e235b1ffc43e8899102f83594df70bb7'
      );
    });

    it('should print a complete feed if available', () => {
      expect(
        requestHash({
          body: 'foo=bar',
          method: 'POST',
          query: 'q=1',
          headers: { 'Content-Type': 'application/json' }
        })
      ).toBe('3e5bd032f4dc284dd50a42331b2bbc9e');
    });
  });

  describe('expanded result', () => {
    const requestHash = getRequestHash({ expand: true });

    it('should print empty feed on no valid params', () => {
      expect(requestHash({})).toBe('');
    });

    it('should print only method result if only method is available', () => {
      expect(requestHash({ method: 'POST' })).toBe('method:\nPOST');
    });

    it('should print only query result if only query value is available', () => {
      expect(requestHash({ query: 'q=foo+bar' })).toBe('query:\nq=foo+bar');
    });

    it('should print only data result if only data value is available', () => {
      expect(requestHash({ body: { foo: 'bar' } })).toBe('data:\nfoo,bar');
    });

    it('should print only data result if type string', () => {
      expect(requestHash({ body: 'foo=bar' })).toBe('data:\nfoo=bar');
    });

    it('should print only data result if type number', () => {
      expect(requestHash({ body: 12020 })).toBe('data:\n12020');
    });

    it('should print only data result if type boolean', () => {
      expect(requestHash({ body: true })).toBe('data:\ntrue');
    });

    it('should print only headers if only headers value is available', () => {
      expect(requestHash({ headers: { Cookie: 'foo=bar' } })).toBe(
        'headers:\nCookie,foo=bar'
      );
    });

    it('should print a complete feed if available', () => {
      expect(
        requestHash({
          body: 'foo=bar',
          method: 'POST',
          query: 'q=1',
          headers: { 'Content-Type': 'application/json' }
        })
      ).toBe(
        'method:\nPOST\nquery:\nq=1\ndata:\nfoo=bar\nheaders:\nContent-Type,application/json'
      );
    });
  });
});
