const { Client } = require('whatsapp-web.js');
const qrcode = require("qrcode-terminal");
const bodyParser=require("body-parser");
const client = new Client();
const qrcode=()=>{
client.on('qr', (qr,req,res) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    //qrcode.generate(qr, {small: true});
    res.send(qr);
    
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();
};
module.exports={qrcode};
