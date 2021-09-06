const { spawn } = require('child_process');
const temp = require("temp");
const fs   = require('fs');

const runCommandTerminalMacOS = (command) => {
    var tempCommandFile = temp.openSync({suffix: ".command"});
    fs.writeFileSync(tempCommandFile.fd, command);
    fs.chmodSync(tempCommandFile.path, "700");
    spawn('open', [tempCommandFile.path]);
    temp.cleanupSync();
}

// runCommandTerminalMacOS("man cp");