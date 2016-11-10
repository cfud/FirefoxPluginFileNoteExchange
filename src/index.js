var self = require("sdk/self");
const CryptoJS = require('lib/aes').CryptoJS;
let { Cc, Ci ,Cu} = require('chrome');

var buttons1 = require('sdk/ui/button/action');
var buttons2 = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var ww = require("sdk/window/utils");

function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;

var button1 = buttons1.ActionButton({
  id: "cfud-file-exchange-link",
  label: "cFUD file exchange",
  icon: {
    "16": "./1.png",
    "32": "./1.png",
    "64": "./1.png"
  },
  badge: 0,
  badgeColor: "#00AAAA",
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
	var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
	
	if (state.badge>0){
		prompts.alert(null, "cFUD transfer status", "File download in the process. Please wait!");	
		return -1;
	}
	
	var password = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
	
	const nsIFilePicker = Ci.nsIFilePicker;
	var fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	
	fp.init(ww.getMostRecentBrowserWindow(), "Select the file for sharing", nsIFilePicker.modeOpen);
	fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);

	var rv = fp.show();
	if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
		button1.badge = state.badge + 1;
		button1.badgeColor = "#AA00AA";

		var path = fp.file.path;
		var fname = fp.file.path.replace(/^.*[\\\/]/, '');
		var file = require("sdk/io/file");
		var {Request} = require("sdk/request");

		var params = {};
		params.data = file.read(fp.file.path, "b");
		Cu.import("resource://gre/modules/devtools/Console.jsm");
		Cu.importGlobalProperties(["atob", "btoa"]);
		params.data = btoa(params.data);
		params.data = CryptoJS.AES.encrypt(params.data,password).toString();
		params.name = fname;

		Request({
		  url: "https://cfud.biz/cryptosharing/uploadFile/",
		  content: params,
		  onComplete: function(response)
		  {
			var clipboard = require("sdk/clipboard");
			clipboard.set("Key : "+password + "\r\n" + "URL : https://cfud.biz/en/cryptosharing/download/" + response.text + "\r\n");
			prompts.alert(null, "The transfer is complete", "Message copied to clipboard");	
			button1.badge = 0;	
			button1.badgeColor = "#00AAAA";			
		  }
		}).post();
	}
}

function handleClick2(state) {
  tabs.open("https://cfud.biz/cryptosharing/notes");
}