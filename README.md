AngularJS Dependencies Wrapper
=======

A tiny npm module for auto-wrapping a dependencies to Inline Array Annotation in AngularJS

For example, we have file `test.js` with the following code

```js
define([
  './module'
], function (module) {
  'use strict';

  return modules.service('ContactModal', function ($modal, $timeout, anyService) {
  
  }); 
```
let's run

```bash
angularjs-dependencies-wrapper test.js 
```

and we get a result

```js
define([
  './module'
], function (module) {
  'use strict';

  return modules.service('ContactModal', ['$modal', '$timeout', 'anyService', function ($modal, $timeout, anyService) {
  
  }]); 
```


## Install

```bash
$ npm install angularjs-dependencies-wrapper
```

## Usage

```js
var angularjs-dependencies-wrapper = require('angularjs-dependencies-wrapper');

angularjs-dependencies-wrapper.wrap('filename.js', function (err) {
  
});
```

or in command line

```bash
> angularjs-dependencies-wrapper filename.js 
```

## License 

MIT