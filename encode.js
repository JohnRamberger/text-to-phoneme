//purely for development purposes
const Lame = require("node-lame").Lame;

let clips = [];
for (let i = 2; i < process.argv.length; i++) {
    clips.push(process.argv[i]);
}

for (let i = 0; i < clips.length; i++) {
    const clip = `./sounds/me/wav/${clips[i]}.wav`;
    const finish = `./sounds/me/mp3/${clips[i]}.mp3`;
    const encoder = new Lame({
        output: finish,
        bitrate: 192,
    }).setFile(clip);

    encoder
        .encode()
        .then(() => {
            // Encoding finished
            logGreen(`finished converting ${clips[i]}.wav to ${clips[i]}.mp3`);
        })
        .catch((error) => {
            // Something went wrong
            logRed(error);
        });
}


function logGreen(message) {
    console.log("\x1b[32m%s\x1b[0m", message);
}

function logRed(message) {
    console.log("\x1b[31m%s\x1b[0m", message);   
}
