'use strict'

var test = require('tape')
var replace = require('./')

var simple = "require('foo')()"
var args = "require('foo')('bar', process)"
var multiple = "require('foo')()\nrequire('bar')()"

test(function (t) {
  var code
  code = replace(simple, {
    foo: function () {
      return 'bar'
    }
  })
  t.equal(code, 'bar')

  code = replace(args, {
    foo: function () {
      return [].slice.call(arguments)
        .map(function (node) {
          return node.type
        })
        .join(', ')
    }
  })
  t.equal(code, 'Literal, Identifier')

  code = replace(multiple, {
    foo: function () {return 'baz'},
    bar: function () {return 'qux'}
  })
  t.equal(code, 'baz\nqux')

  t.end()
})
