const Jimp = require('jimp');
const Discord = require('discord.js')
const {token, prefix} = require('./discord.json')
const client = new Discord.Client();

const ASCII_CHARS = [".", ".", ".", ".", "-", "=", "+", "*", "#", "%", "@"];

function resizeGrayImage(image, new_width = 70) {
    const new_height = 20;
    const resizedImage = image.resize(new_width, new_height).grayscale();
    return resizedImage;
}

function pixelsToChar(image) {
    const pixels = image.bitmap.data;
    let chars = "";
    for (let index = 0; index < pixels.length; index += 4) {
        const grayscaleAverage = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        chars += ASCII_CHARS[~~(grayscaleAverage / 25)];
    }
    return chars;
}

function createFrame(image, new_width = 70) {
    const resizedImage = resizeGrayImage(image, new_width);
    const newImage = pixelsToChar(resizedImage);
    const totalPixels = newImage.length;
    let frame = "";
    for (let i = 0; i < totalPixels; i += new_width) {
        frame += "\n" + newImage.slice(i, i + new_width);
    }
    return "`"+frame+"`";
}

// let i = 0;
// while (i < 2000) {
//     const frame = Jimp.read(`./frames/frame${i}.jpg`, (err, im) => {
//         console.log(createFrame(im, 60));
//     })
//     i++;
// }

client.once('ready', () => {
	console.log('Bad Apple Discord Bot is running...');
});

client.on('message', async message => {
    try {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const arguments = message.content.slice(prefix.length).trim().split(" ");
		const command = arguments.shift().toLowerCase();
        if (command == "badapple_weebyte") {
            let wasCreated = false;
            let msg;
            for (let index = 0; index < 7000; index += 4) {
                const image = await Jimp.read(`./frames/frame${index}.jpg`);
                const frame = createFrame(image, 60);
                if (frame) {
                    if (wasCreated == false) {
                        msg = await message.channel.send(frame)
                        wasCreated = true;
                    } else {
                        await msg.edit(frame);
                    }
                }
                
            }
        } 
    } catch (error) {
        console.log(`Error: ${error}. Continue working...`)
    }
});

client.login(token);