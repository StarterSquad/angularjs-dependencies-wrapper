'use strict';

var fs = require('fs');
var uglifyjs = require("uglifyjs");
var _ = require("underscore");

String.prototype.splice = function (startPosition, replaceLength, insertString) {
  return (this.slice(0, startPosition) + insertString + this.slice(startPosition + Math.abs(replaceLength)));
};

exports.convert = function () {
  var sourceFile = process.argv[2];

  if (process.argv.length < 2) throw new Error('Pass on a file name/path');
  if (!fs.existsSync(sourceFile)) throw new Error('File is not exist');

  var source = fs.readFileSync(sourceFile, 'utf8');
  var parsedSource = uglifyjs.parse(source);

  // If we're inside ngseed file
  if (parsedSource.start.value === 'define') {
    var module = parsedSource.body[0].body.args[1].body[1].value;

    // If function has not applied an Array Inline Annotation
    if (module.expression.property && module.args[1].start.value === 'function') {
      // Get start end end positions of the function needs to be wrapped
      var start = module.args[1].start.pos;
      var end = module.args[1].end.endpos;

      // Get deps and wrap each into the quotes
      var arrayInlineAnnotationn = _(module.args[1].argnames).pluck('name').map(function (dependency) {
        return "'" + dependency + "'";
      });

      // Push function as a last element of Array Inline Annotation
      arrayInlineAnnotationn.push(source.slice(start, end));

      // Insert result to the original source
      source = source.splice(start, end - start, '[' + arrayInlineAnnotationn.join(', ') + ']');
    }
  }

  // Overwrite source file
  fs.writeFileSync(sourceFile, source);
};