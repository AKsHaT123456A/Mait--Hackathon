//jshint esversion:6
const express=require("express");
const { Client } = require('whatsapp-web.js');
const qrcode = require("qrcode-terminal");
const bodyParser=require("body-parser");
const client = new Client();

client.on('qr', (qr,req,res) => {
    // Generate and scan this code with your phone
    // console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
    res.send(qrcode.generate(qr, {small: true}));
    
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

app=express();
PORT=process.env.PORT||3000;

app.listen(PORT,(err)=>{
    if(err)console.log(err);
    else console.log("Server started at "+PORT);
});