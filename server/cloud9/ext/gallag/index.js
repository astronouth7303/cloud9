/**
 * Gallag Shell Module for the Cloud9 IDE
 *
 * @copyright 2011, Megan Kearl, Patrick Lu
 */
var Plugin = require("cloud9/plugin");
var sys    = require("sys");

var ShellGallagPlugin = module.exports = function(ide) {
    this.ide = ide;
    this.hooks = ["command"];
    this.name = "gallag";
};

sys.inherits(ShellGallagPlugin, Plugin);

(function() {
    /*var githelp     = "",
        commandsMap = {
            "default": {
                "commands": {
                    "[PATH]": {"hint": "path pointing to a folder or file. Autocomplete with [TAB]"}
                }
            }
        };

    this.$commandHints = function(commands, message, callback) {
        var _self = this;

        if (!githelp) {
            this.spawnCommand("git", null, message.cwd, null, null, function(code, err, out) {
                if (!out)
                    return callback();

                githelp = {"git": {
                    "hint": "the stupid content tracker",
                    "commands": {}
                }};

                out.replace(/[\s]{3,4}([\w]+)[\s]+(.*)\n/gi, function(m, sub, hint) {
                    githelp.git.commands[sub] = _self.augmentCommand(sub, {"hint": hint});
                });
                onfinish();
            });
        }
        else {
            onfinish();
        }

        function onfinish() {
            _self.extend(commands, githelp);
            callback();
        }
    };

    this.augmentCommand = function(cmd, struct) {
        var map = commandsMap[cmd] || commandsMap["default"];
        return this.extend(struct, map || {});
    };
    */

    this.command = function(user, message, client) {
        if (message.command === "skill")
        {
            sys.puts("In killing mode...");
            this.$kill();
            return true;
        }
        if (message.command !== "python" && message.command !== "ps")
            return false;

        sys.puts("hello from gallag");
        var _self = this;
        var argv = message.argv || [];
        //if(!this.child)
        if (true)
        {
            this.child = this.spawnCommand(message.command, argv.slice(1), message.cwd, 
                function(err) { // Error
                    _self.sendResult(0, message.command, {
                        code: 0,
                        argv: message.argv,
                        err: err,
                        out: null
                    });
                }, 
                function(out) { // Data
                    _self.sendResult(0, message.command, {
                        code: 0,
                        argv: message.argv,
                        err: null,
                        out: out
                    });
                }, 
                function(code, err, out) {
                    _self.sendResult(0, message.command, {
                        code: code,
                        argv: message.argv,
                        err: null,
                        out: null
                    });
                });
        }
        //else
            sys.puts("child.pid:"+this.child.pid+" existed!");

        return true;
    };
    
    this.$kill = function() {
        var child = this.child;
        sys.puts("child.pid:"+child.pid+" is about to get killed");
        if (!child)
            return;
        try {
            child.kill();
            // check after 2sec if the process is really dead
            // If not kill it harder
            setTimeout(function() {
                if (child.pid > 0)
                    child.kill("SIGKILL");
            }, 2000);
            this.child = undefined;
        }
        catch(e) {}
    };
    
    this.dispose = function(callback) {
        this.$kill();
        callback();
    };
    
}).call(ShellGallagPlugin.prototype);