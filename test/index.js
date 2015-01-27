'use strict';

var test = require('tape');
var load = require('../');

test('Scriptload', {timeout: 500}, function (assert) {
  assert.plan(4);

  window.loadedScripts = [];

  load('test/fixtures/script-one.js', function () {
    assert.equal(window.loadedScripts[0], 'one', 'single script');

    window.loadedScripts = [];

    load([], function () {
      assert.ok('All good', 'no scripts');

      window.loadedScripts = [];

      load([
        'test/fixtures/script-one.js',
        'test/fixtures/script-two.js'
      ], function () {
        assert.equal(window.loadedScripts[0], 'one', 'script one');
        assert.equal(window.loadedScripts[1], 'two', 'script two');
      });
    });
  });
});
