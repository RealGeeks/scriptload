// Code adapted from
// http://www.html5rocks.com/en/tutorials/speed/script-loading/

'use strict';

var _ = require('lodash');

var doc = document;

// document.head is not available in IE8.
var head = doc.getElementsByTagName('head')[0];

var supportsAsync = 'async' in doc.scripts[0];

var tasks = [];

module.exports = function scriptLoad(sources, callback) {
  if (!_.isArray(sources)) {
    sources = [sources];
  }

  // Bail if there are no scripts to load.
  if (!sources.length) {
    return callback && callback();
  }

  var src;
  var script;
  var pendingScripts = [];

  if (!supportsAsync) {
    // Prevent IE from garbage collecting our scripts by keeping
    // references on an outside scope.
    tasks.push(pendingScripts);
  }

  function stateChange() {
    var pendingScript;
    // Execute as many scripts in order as we can
    while (pendingScripts[0] && pendingScripts[0].readyState == 'loaded') {
      pendingScript = pendingScripts.shift();
      pendingScript.onreadystatechange = null;
      head.appendChild(pendingScript);
    }

    if (!pendingScripts[0]) {
      callback && callback();

      _.pull(tasks, pendingScripts);
    }
  }

  while (src = sources.shift()) {
    script = doc.createElement('script');

    if (supportsAsync) {
      // Trigger callback after the last script loads.
      if (callback && !sources[0]) {
        /*jshint loopfunc: true */
        script.onload = function () {
          // don’t trigger callback again if src changes.
          script.onload = null;
          callback();
        };
      }
      script.async = false;
      script.src = src;
      head.appendChild(script);
    } else {
      // IE < 10 does not support the async attribute, but loads scripts
      // without having to add them to the DOM, triggering state changes.
      pendingScripts.push(script);
      script.onreadystatechange = stateChange;
      script.src = src;
    }
  }
};
