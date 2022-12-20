const express = require("express");
const router = express();
const bodyParser = require("body-parser");
const qrcode=require("../routes/qr");
router.post("/qrscanner",qrcode);
module.exports = router;

