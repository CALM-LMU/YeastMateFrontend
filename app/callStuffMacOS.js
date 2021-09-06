const { spawn } = require('child_process');
const temp = require("temp");
const fs   = require('fs');

const runCommandTerminalMacOS = (command) => {
    var tempCommandFile = temp.openSync({suffix: ".command"});
    fs.writeFileSync(tempCommandFile.fd, command);
    fs.chmodSync(tempCommandFile.path, "700");
    proc = spawn('open', [tempCommandFile.path]);
    temp.cleanupSync();

    return proc
}

module.exports = {runCommandTerminalMacOS: runCommandTerminalMacOS};

// runCommandTerminalMacOS("man cp");