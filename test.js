'use strict'

var test = require('tape')
var replace = require('./')

var simple = "require('foo')()"
var args = "require('foo')('bar', process)"

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

  t.end()
})
