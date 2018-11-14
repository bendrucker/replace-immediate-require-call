'use strict'

var test = require('tape')
var replace = require('./')

test('no args', function (t) {
  const code = replace("require('foo')()", {
    foo: function () {
      return 'bar'
    }
  })

  t.equal(code, 'bar')
  t.end()
})

test('multiple arg types', function (t) {
  const code = replace("require('foo')('bar', process)", {
    foo: function () {
      return [].slice.call(arguments)
        .map(function (node) {
          return node.type
        })
        .join(', ')
    }
  })

  t.equal(code, 'Literal, Identifier')
  t.end()
})

test('multiple replacements', function (t) {
  const code = replace("require('foo')()\nrequire('bar')()", {
    foo: function () { return 'baz' },
    bar: function () { return 'qux' }
  })

  t.equal(code, 'baz\nqux')
  t.end()
})
