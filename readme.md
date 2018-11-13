# replace-immediate-require-call [![Build Status](https://travis-ci.org/bendrucker/replace-immediate-require-call.svg?branch=master)](https://travis-ci.org/bendrucker/replace-immediate-require-call) [![Greenkeeper badge](https://badges.greenkeeper.io/bendrucker/replace-immediate-require-call.svg)](https://greenkeeper.io/)

> Replace immediate calls to a required function


## Install

```
$ npm install --save replace-immediate-require-call
```


## Usage

```js
var replaceImmediateRequireCall = require('replace-immediate-require-call');

replaceImmediateRequireCall('require("foo")()', {
  foo: function () {
    return '"foo"'
  }
});
//=> replace require("foo")() with "foo"
```

## API

#### `replaceImmediateRequireCall(code, replacements)` -> `string`

##### code

*Required*  
Type: `string`

Your JavaScript.

##### replacements

*Required*  
Type: `object`

An object with keys corresponding to the expecting module ids (strings passed to required). Values are functions that receive the argument nodes to the immediate require call.

The arguments are passed directly as [AST nodes](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API), not their string values.


```js
var code = 'require("foo")(bar, "baz")'
var replaced = replaceImmediateRequireCall(code, {
  foo: function (node1, node2) {
    return [node1.type, node2.type].join(', ')
  }
})
assert.equal(replaced, 'Identifier, Literal')
```

## License

MIT © [Ben Drucker](http://bendrucker.me)
