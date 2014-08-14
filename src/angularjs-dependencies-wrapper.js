'use strict';

var fs = require('fs');
var uglifyjs = require("uglifyjs");
var _ = require("underscore");

function splice_string(str, begin, end, replacement) {
  return str.substr(0, begin) + replacement + str.substr(end);
}

exports.convert = function () {
  var sourceFile = process.argv[2];

  if (process.argv.length < 2) throw new Error('Pass on a file name/path');
  if (!fs.existsSync(sourceFile)) throw new Error('File is not exist');

  var source = fs.readFileSync(sourceFile, 'utf8');
  var ast = uglifyjs.parse(source);
  var functionsRequiresWrapping = [];

  ast.walk(new uglifyjs.TreeWalker(function (node) {
    if (node instanceof uglifyjs.AST_Call && node.expression.property === 'service') {
      if (node.args[1] instanceof uglifyjs.AST_Function) {
        functionsRequiresWrapping.push(node.args[1]);
      }
    }

    if (node instanceof uglifyjs.AST_Call && node.expression.property === 'config') {
      if (node.args[0] instanceof uglifyjs.AST_Function) {
        functionsRequiresWrapping.push(node.args[0]);
      }
    }

    if (node instanceof uglifyjs.AST_ObjectProperty && node.key === 'controller') {
      if (node.value instanceof uglifyjs.AST_Function) {
        functionsRequiresWrapping.push(node.value);
      }
    }
  }));

  // Wrap all functions to Array Inline Annotation
  for (var i = functionsRequiresWrapping.length; --i >= 0;) {
    var node = functionsRequiresWrapping[i];
    var start_pos = node.start.pos;
    var end_pos = node.end.endpos;
    var dependencies = _(node.argnames).pluck('name');

    var replacement = new uglifyjs.AST_Array({
      elements: dependencies.map(function (dependency) {
        return new uglifyjs.AST_String({
          value: dependency
        })
      })
    }).print_to_string({ beautify: true });

    source = splice_string(source, start_pos, end_pos, replacement);
  }

  // Overwrite source file
  fs.writeFileSync(sourceFile, source);
};