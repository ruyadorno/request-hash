const getRequestHash = require('..');

describe('defaultSerializer', () => {
  const { defaultSerializer } = getRequestHash();

  it('should defaultSerializer a simple object', () => {
    expect(defaultSerializer({ foo: 'bar' })).toBe('foo,bar');
  });

  it('should defaultSerializer a multi-level object', () => {
    expect(
      defaultSerializer({
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

  it('should defaultSerializer falsy edge cases', () => {
    expect(defaultSerializer(NaN)).toBe('NaN');
    expect(defaultSerializer(0)).toBe('0');
    expect(defaultSerializer()).toBe('undefined');
    expect(defaultSerializer(null)).toBe('null');
  });
});

describe('getFeed', () => {
  describe('defaults', () => {
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

  describe('serializer', () => {
    const { getFeed } = getRequestHash({
      expand: true,
      serializer: JSON.stringify
    });

    it('should retrieve a formatted string', () => {
      expect(getFeed('foo', 'bar')).toBe('foo\n"bar"');
    });

    it('should retrieve a formatted number', () => {
      expect(getFeed('foo', 'bar')).toBe('foo\n"bar"');
    });

    it('should retrieve a formatted object', () => {
      expect(getFeed('foo', { foo: { bar: 'bar' } })).toBe(
        'foo\n{"foo":{"bar":"bar"}}'
      );
    });

    it('should retrieve empty string for falsy elems', () => {
      expect(getFeed('foo', NaN)).toBe('');
      expect(getFeed('foo', 0)).toBe('');
      expect(getFeed('foo')).toBe('');
      expect(getFeed('foo', null)).toBe('');
    });
  });
});

describe('getCookies', () => {
  describe('default', () => {
    const { getCookies } = getRequestHash();

    it('should pass through on default config', () => {
      expect(getCookies({ headers: { cookie: 'foo=bar' } })).toEqual({
        foo: 'bar'
      });
    });
  });

  describe('cookies', () => {
    const { getCookies } = getRequestHash({ cookies: ['foo', 'bar'] });

    it('should return only specified cookies', () => {
      expect(
        getCookies({ headers: { cookie: 'foo=foo; bar=bar; lorem=lorem' } })
      ).toEqual({ foo: 'foo', bar: 'bar' });
    });

    it('should allow missing expected cookies', () => {
      expect(
        getCookies({ headers: { cookie: 'bar=bar; lorem=lorem; ipsum=ipsum' } })
      ).toEqual({ bar: 'bar' });
    });

    it('should not break on missing headers', () => {
      expect(getCookies({ headers: {} })).toEqual({});
      expect(getCookies({ headers: null })).toEqual({});
      expect(getCookies({})).toEqual({});
    });
  });
});

describe('getHeaders', () => {
  describe('default', () => {
    const { getHeaders } = getRequestHash();

    it('should pass through on default config', () => {
      expect(getHeaders({ headers: { 'x-foo': 'foo' } })).toEqual({
        'x-foo': 'foo'
      });
    });

    it('should not break on missing headers', () => {
      expect(getHeaders({ headers: {} })).toEqual({});
      expect(getHeaders({ headers: null })).toEqual({});
      expect(getHeaders({})).toEqual({});
    });
  });

  describe('headers', () => {
    const { getHeaders } = getRequestHash({
      headers: ['content-type', 'x-foo']
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
      ).toEqual({ 'content-type': 'application/json', 'x-foo': 'foo' });
    });

    it('should allow missing expected headers', () => {
      expect(
        getHeaders({
          headers: {
            'x-bar': 'bar',
            'content-type': 'application/json',
            cookie: 'foo=bar'
          }
        })
      ).toEqual({ 'content-type': 'application/json' });
    });
  });

  describe('headers + cookies', () => {
    const { getHeaders } = getRequestHash({
      headers: ['content-type', 'x-foo'],
      cookies: ['foo']
    });

    it('should allow filtering cookies without affecting other headers', () => {
      expect(
        getHeaders({
          headers: {
            'x-bar': 'bar',
            'x-foo': 'foo',
            'content-type': 'application/json',
            cookie: 'foo=foo; bar=bar; lorem=lorem'
          }
        })
      ).toEqual({
        'content-type': 'application/json',
        cookie: { foo: 'foo' },
        'x-foo': 'foo'
      });
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

    it('should print only pathname result if only pathanme is available', () => {
      expect(requestHash({ url: '/foo' })).toBe(
        '014a72fdffadf9324723b098323836b8a79ac6502d13b25e610d815f3911407e'
      );
    });

    it('should print only query result if only query value is available', () => {
      expect(requestHash({ query: 'q=foo+bar' })).toBe(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
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
      expect(requestHash({ headers: { 'x-foo': 'foo' } })).toBe(
        '99aa72d98b5ccd7b0dfccd241b106f61026856212c5b1783836cc51b42a0460d'
      );
    });

    it('should print only headers if only cookies value is available', () => {
      expect(requestHash({ headers: { cookie: 'foo=bar' } })).toBe(
        '954de5a314928da61771a0be594d714c7bf9ea990f7fc9f2d1e8735ce9e2fe4b'
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
        'fc77a8dd95b7a092944bbadd67a0450fe054c6e9fc04dd58137987b6f8e1f000'
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

    it('should print only pathname result if only pathanme is available', () => {
      expect(requestHash({ url: '/foo' })).toBe(
        'b2f410b5861cf040358848a0574bcdd9'
      );
    });

    it('should print only query result if only query value is available', () => {
      expect(requestHash({ query: 'q=foo+bar' })).toBe(
        'd41d8cd98f00b204e9800998ecf8427e'
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
      expect(requestHash({ headers: { cookie: 'foo=bar' } })).toBe(
        '021e3cb40256ac4e5ed0953453512022'
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
      ).toBe('12511ad7cfabccb16c68ed8990030f34');
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

    it('should print only pathname result if only pathanme is available', () => {
      expect(requestHash({ url: '/foo' })).toBe('pathname:\n/foo');
    });

    it('should print only query result if only query value is available', () => {
      expect(requestHash({ url: '?q=foo+bar' })).toBe('query:\nq,foo bar');
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

    it('should print only cookies if only cookies value is available', () => {
      expect(requestHash({ headers: { cookie: 'foo=bar' } })).toBe(
        'headers:\ncookie,foo,bar'
      );
    });

    it('should print only headers if only headers value is available', () => {
      expect(requestHash({ headers: { 'x-foo': 'foo' } })).toBe(
        'headers:\nx-foo,foo'
      );
    });

    it('should print a complete feed if available', () => {
      expect(
        requestHash({
          body: 'foo=bar',
          method: 'POST',
          url: '/foo?q=1',
          headers: {
            'Content-Type': 'application/json',
            cookie: 'foo=bar; lorem=ipsum'
          }
        })
      ).toBe(
        'method:\nPOST\npathname:\n/foo\nquery:\nq,1\ndata:\nfoo=bar\nheaders:\nContent-Type,application/json\ncookie,foo,bar\nlorem,ipsum'
      );
    });
  });

  describe('headers + cookies', () => {
    const requestHash = getRequestHash({
      expand: true,
      headers: ['content-type', 'x-foo', 'x-lorem'],
      cookies: ['foo', 'ipsum']
    });

    it('should allow filtering cookies without affecting other headers', () => {
      expect(
        requestHash({
          headers: {
            'x-bar': 'bar',
            'x-foo': 'foo',
            'content-type': 'application/json',
            cookie: 'foo=foo; bar=bar; lorem=lorem'
          }
        })
      ).toBe(
        'headers:\ncontent-type,application/json\ncookie,foo,foo\nx-foo,foo'
      );
    });
  });
});
