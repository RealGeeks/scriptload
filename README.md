# Scriptload

Asynchronously load one or more scripts while executing them in order. It even works on IE8!

## Usage

```js
var load = require('scriptload');

load(['jquery.js', 'jquery-plugin.js'], function () {
  // At this point both scripts have been loaded and executed.
});
```
