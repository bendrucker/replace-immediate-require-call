'use strict'

var hasRequire = require('has-require')
var detective = require('detective')
var patch = require('patch-text')

module.exports = function replaceImmediateRequireCall (code, replacements) {
  var ids = Object.keys(replacements)
  var checker = new hasRequire.Checker(code)
  if (!ids.some(checker.has, checker)) return code
  var patches = detective
    .find(code, { nodes: true })
    .nodes
    .filter(requireLiteral)
    .filter(callExpression)
    .map(function (node) {
      return {
        id: node.arguments[0].value,
        parent: node.parent
      }
    })
    .filter(function (require) {
      return ~ids.indexOf(require.id)
    })
    .map(function (require) {
      var parent = require.parent
      return {
        start: parent.start,
        end: parent.end,
        replacement: replacements[require.id].apply(null, parent.arguments)
      }
    })
  return patch(code, patches)
}

function requireLiteral (node) {
  var arg = node.arguments[0]
  return arg && arg.type === 'Literal'
}

function callExpression (node) {
  var parent = node.parent
  return parent && parent.type === 'CallExpression'
}
