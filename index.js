'use strict'

var hasRequire = require('has-require')
var detective = require('detective')

module.exports = function replaceImmediateRequireCall (code, replacements) {
  var ids = Object.keys(replacements)
  var checker = new hasRequire.Checker(code)
  if (!ids.some(checker.has, checker)) return code
  var offset = 0
  return detective
    .find(code, {nodes: true})
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
    .reduce(function (code, statement) {
      var start = statement.start + offset
      var end = statement.end + offset
      var replacement = statement.replacement
      offset += (replacement.length - (end - start))
      return code.slice(0, start) + replacement + code.slice(end)
    }, code)
}

function requireLiteral (node) {
  var arg = node.arguments[0]
  return arg && arg.type === 'Literal'
}

function callExpression (node) {
  var parent = node.parent
  return parent && parent.type === 'CallExpression'
}
