var audioconcat = require("audioconcat");
var audiosilent = require("audiosilent");
var audiomono = require("audiomono");
const useNumbers = true;

let sentence = [];
for (let i = 2; i < process.argv.length; i++) {
    sentence.push(process.argv[i]);
}

// Read the file and print its contents.
var fs = require("fs"),
    filename = "./cmu/cmudict.dict";
fs.readFile(filename, "utf8", async function (err, data) {
    if (err) throw err;

    var arr = data.split("\n");
    var tmp = [];
    var sentencePhonemes = [];

    for (let j = 0; j < sentence.length; j++) {
        let word = sentence[j];
        let a = arr.find(
            (x) =>
                x.split(" ")[0] ==
                word.toLowerCase().replace(",", "").replace(".", "")
        );
        if (!a) {
            console.log(`${word} not defined in dictionary`);
            return;
        }
        let phonemes = a.split(" ");
        phonemes.shift();

        for (let i = 0; i < phonemes.length; i++) {
            if (!useNumbers) {
                phonemes[i] = phonemes[i].replace(/[0-9]/g, "");
            }
            if (!fs.existsSync(`sounds/me/mp3/${phonemes[i]}.mp3`)) {
                logRed(`phoneme not found: ${phonemes[i]}`);
                return;
            }
            phonemes[i] = `sounds/me/mp3/${phonemes[i]}.mp3`;
        }

        if (j == 0) {
            console.log(`| time | dir | file`);
        }

        let concatWord = await concate(phonemes, `tmp/${word}.mp3`);
        if (sentence.length == 1) {
            let silenceWord = await silence(
                concatWord,
                `tmp/${word}_silenced.mp3`
            );
            let monoSentence = await mono(silenceWord, `out/${word}.mp3`);
        } else {
            let silenceWord = await silence(
                concatWord,
                `tmp/${word}_silent.mp3`
            );

            tmp.push(silenceWord);
            if (word.includes(",")) {
                tmp.push(`./sounds/spaces/mp3/space_02.mp3`);
            } else if (word.includes(".")) {
                tmp.push(`./sounds/spaces/mp3/space_04.mp3`);
            } else {
                tmp.push(`./sounds/spaces/mp3/space_01.mp3`);
            }
        }
    }
    //console.log(tmp);
    if (tmp.length > 1) {
        let concatSentence = await concate(
            tmp,
            `tmp/${sentence.join("_")}.mp3`
        );
        let monoSentence = await mono(
            concatSentence,
            `out/${sentence.join("_")}.mp3`
        );
    }
});

const concate = (inputs, output) => {
    output = output.replace(".mp3", "").replace(".", "") + ".mp3"; //.replace(",", "");
    var t0 = performance.now();
    return new Promise((resolve, reject) => {
        audioconcat(inputs)
            .concat(output)
            .on("start", function (command) {
                //console.log("ffmpeg process started:", command);
                //console.log("ffmpeg started");
            })
            .on("error", function (err, stdout, stderr) {
                //logRed("Error:" + err);
                //logRed("ffmpeg stderr:" + stderr);
                return reject(err);
            })
            .on("end", function (op) {
                var t1 = performance.now();
                if (output.includes("tmp")) {
                    logBlue(
                        `| \x1b[33m${((t1 - t0) / 1000).toFixed(
                            1
                        )}s\x1b[0m \x1b[36m| tmp | ${output.replace(
                            "tmp/",
                            ""
                        )}`
                    );
                } else {
                    logGreen(
                        `| \x1b[33m${((t1 - t0) / 1000).toFixed(
                            1
                        )}s\x1b[0m \x1b[32m| out | ${output.replace(
                            "out/",
                            ""
                        )}`
                    );
                }

                resolve(output);
            });
    });
};

const silence = (input, output) => {
    output = output.replace(".mp3", "").replace(".", "") + ".mp3"; //.replace(",", "");
    var t0 = performance.now();
    return new Promise((resolve, reject) => {
        audiosilent(input)
            .silence(output)
            .on("start", function (command) {
                //console.log("ffmpeg process started:", command);
                //console.log("ffmpeg started");
            })
            .on("error", function (err, stdout, stderr) {
                //logRed("Error:" + err);
                //logRed("ffmpeg stderr:" + stderr);
                reject(err);
            })
            .on("end", function (op) {
                var t1 = performance.now();
                if (output.includes("tmp")) {
                    logBlue(
                        `| \x1b[33m${((t1 - t0) / 1000).toFixed(
                            1
                        )}s\x1b[0m \x1b[36m| tmp | ${output.replace(
                            "tmp/",
                            ""
                        )}`
                    );
                } else {
                    logGreen(
                        `| \x1b[33m${((t1 - t0) / 1000).toFixed(
                            1
                        )}s\x1b[0m \x1b[32m| out | ${output.replace(
                            "out/",
                            ""
                        )}`
                    );
                }
                resolve(output);
            });
    });
};

const mono = (input, output) => {
    output = output.replace(".mp3", "").replace(".", "") + ".mp3"; //.replace(",", "");
    var t0 = performance.now();
    return new Promise((resolve, reject) => {
        audiomono(input)
            .mono(output)
            .on("start", function (command) {
                //console.log("ffmpeg process started:", command);
                //console.log("ffmpeg started");
            })
            .on("error", function (err, stdout, stderr) {
                logRed("Error:" + err);
                logRed("ffmpeg stderr:" + stderr);
                reject(err);
            })
            .on("end", function (op) {
                var t1 = performance.now();
                logGreen(
                    `| \x1b[33m${((t1 - t0) / 1000).toFixed(
                        1
                    )}s\x1b[0m \x1b[32m| out | ${output.replace("out/", "")}`
                );
                resolve(output);
            });
    });
};

function logGreen(message) {
    console.log("\x1b[32m%s\x1b[0m", message);
}

function logBlue(message) {
    console.log("\x1b[36m%s\x1b[0m", message);
}

function logRed(message) {
    console.log("\x1b[31m%s\x1b[0m", message);
}

function logPink(message) {
    console.log("\x1b[35m%s\x1b[0m", message);
}

// colors
// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
