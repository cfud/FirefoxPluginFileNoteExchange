var self = require("sdk/self");

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

var buttons1 = require('sdk/ui/button/action');
var buttons2 = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button1 = buttons1.ActionButton({
  id: "cfud-file-exchange-link",
  label: "cFUD file exchange",
  icon: {
    "16": "./1.png",
    "32": "./1.png",
    "64": "./1.png"
  },
  onClick: handleClick1
});

var button2 = buttons2.ActionButton({
  id: "cfud-note-exchange-link",
  label: "cFUD notes exchange",
  icon: {
    "16": "./2.png",
    "32": "./2.png",
    "64": "./2.png"
  },
  onClick: handleClick2
});

function handleClick1(state) {
  tabs.open("https://cfud.biz/cryptosharing/");
}

function handleClick2(state) {
  tabs.open("https://cfud.biz/cryptosharing/notes");
}