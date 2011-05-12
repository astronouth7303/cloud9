/**
 * Simple authentication backend using a single text file.
 *
 * @copyright 2010, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
var Plugin = require("cloud9/plugin");
var sys = require("sys"),
    querystring = require("querystring"),
    fs = require("fs");

var FlatfilePlugin = module.exports = function(ide) {
    this.ide = ide;
    this.hooks = ["command"];
    this.name = "flatfile";
};

sys.inherits(FlatfilePlugin, Plugin);

(function() {
    this.users = {};
    this.authinit = function(ops) {
        if (!ops.file) throw "flatfile backend requires the file as an argument.";
        var data = fs.readFileSync(ops.file); // Can I make safely this asyncronous?
        for (var l in data.split(/\n|\r|\r\n/)) if (l) { // Filter out blank lines
            q = querystring.parse(l);
            this.users[q.user] = q.password;
        }
    };
    
    this.command = function(user, message, client) {
        if (message.command != "attach")
            return false;

        if (message.workspaceId != this.ide.options.workspaceId) {
            this.ide.error("Unable to attach web socket!", 10, message, client)
            return true;
        }

        client.send('{"type": "attached"}');
        this.ide.execHook("connect", user, client);
        return true;
    };
      
}).call(FlatfilePlugin.prototype);