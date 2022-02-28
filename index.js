/*
SierraPI Server-Manager

Makesa website that we can access privately or public 
depending on your router settings, this is a website
that manages your SierraPI configuration.
*/
var express = require('express');
const si = require('systeminformation');
var app = express();
const fs = require("fs")
const mailgun = require("mailgun-js");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const sessionExpire = 1000 * 60 * 60 * 24;
const { exec } = require('child_process');
const os = require("os")
const db = require("quick.db")
const bodyParser = require("body-parser")
const ramm = new db.table("RAM")
const wifi = new db.table("WIFI")
const disk = require("diskusage");
const radio = new db.table("radio")
const { countReset, count } = require('console');
app.use(sessions({
    secret: "sierrapisecret",
    saveUninitialized:true,
    cookie: { maxAge: sessionExpire },
    resave: false
}));

const jsonParser = express.json()
app.use(jsonParser);
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

var session;

const password = 'admin123'

app.use(express.static("views"));
app.set('view engine', 'ejs');

app.get('/', async (req,res) => {
const dir = "/home/pi/fm_transmitter/song"
const dir2 = "/home/pi/fm_transmitter/archives"
const currentRAM =  8000 - (parseInt(os.freemem()) / 1024 / 1024)
    let files = fs.readdirSync(dir)
    let archived = fs.readdirSync(dir2)
    
    let data1 = ramm.fetch("now")
    let data2 = ramm.fetch("1")
    let data3 = ramm.fetch("2")

    if(data1 === null) data1 = 0
    if(data2 === null) data2 = 0
    if(data3 === null) data3 = 0

    ramm.set("now", currentRAM)
    ramm.set("1", data1)
    ramm.set("2", data2)
    ramm.set("3", data3)
    
disk.check("/", async function (error, info) {

  
    let diskktotal = parseInt(info.total / 1024) / 1024 / 1024 
    let diskkfree = parseInt(info.free) / 1024 / 1024 / 1024

    console.log(diskktotal)
    console.log(diskkfree)
	let temp = await si.cpuTemperature()
	console.log(temp)
    session=req.session;
    if(session.userid){
    res.render("index", { temp: temp.main, transmitting: "Yes", ammountFiles: files.length, files: files, archived: archived, RAM: currentRAM, RAM1: data1, RAM2: data2, RAM3: data3, disktotal: diskktotal - diskkfree, diskfree: diskkfree});
    }else
    res.render('login')

});
});

app.post('/user',(req,res) => {
    if("root" == "root" && req.body.password == password){
        session=req.session;
        session.userid="root";
        console.log(req.session)
        res.redirect("/")
    }
    else{
        res.send('Invalid username or password');
    }
});

app.post('/wifi',(req,res) => {
    let name = req.body.ssid
    let pass = req.body.password
    let country = req.body.country
    let namedb = wifi.fetch("name")
    let passdb = wifi.fetch("pass")
    let countrydb = wifi.fetch("country")
    if(namedb === null) namedb = "SierraPi"
    if(countrydb === null) countrydb = "NI"
    if(passdb === null) passdb = "admin123"

console.log(pass)

    if(!name) name =  namedb
    if(!country) country = countrydb
    if(!pass) pass = passdb

    wifi.set("name", name)
    wifi.set("country", country)
    wifi.set("pass", pass)

    fs.writeFileSync('/etc/hostapd/hostapd.conf', `country_code=${country}\ninterface=wlan0\nssid=${name}\nhw_mode=g\nchannel=7\nmacaddr_acl=0\nauth_algs=1\nignore_broadcast_ssid=0\nwpa=2\nwpa_passphrase=${pass}\nwpa_key_mgmt=WPA-PSK\nwpa_pairwise=TKIP\nrsn_pairwise=CCMP`)
    exec('sudo systemctl restart hostapd.service');
    
        res.redirect("/")
   
});

app.get('/api/:type/:file', (req,res) =>{
    const dir = "/home/pi/fm_transmitter/song"
    const archives = "/home/pi/fm_transmitter/archives"
    const type = req.params.type
    const file = req.params.file
    let files1 = fs.readdirSync(dir)
    let files2 = fs.readdirSync(archives)

    if(type === "deleteWav"){
     if(!files1.includes(file)) return res.send(404)
     fs.unlinkSync(`/home/pi/fm_transmitter/song/${file}`)
     res.redirect("/")
    } else if(type === "architeIt"){
        if(!files1.includes(file)) return res.send(404)
        exec(`sudo cp /home/pi/fm_transmitter/song/${file} /home/pi/fm_transmitter/archives && sudo rm -r /home/pi/fm_transmitter/song/${file}`)
        
        setTimeout(function() {
            res.redirect("/")
        }, 3000);
       } else if (type === "transmitIt"){
        if(!files2.includes(file)) return res.send(404)
        exec(`sudo cp /home/pi/fm_transmitter/archives/${file} /home/pi/fm_transmitter/song && sudo rm -r /home/pi/fm_transmitter/archives/${file}`)
        
        setTimeout(function() {
            res.redirect("/")
        }, 3000);
       } else if(type === "deleteArchivedWav"){
        if(!files2.includes(file)) return res.send(404)
        fs.unlinkSync(`/home/pi/fm_transmitter/archives/${file}`)
        res.redirect("/")
       }


if(!type) res.send(404)
if(!file) res.send(404)


});

app.post('/radioset',async (req,res) => {
    let frequency = req.body.frequency
    let country = req.body.country
    let freqdb = radio.fetch("freq")
    let typedb = radio.fetch("type")
    if(typedb === null) typedb = "recorded"
    if(freqdb === null) freqdb = "90.1"

    console.log(req.body)
    console.log(country)

    if(!frequency) frequency = freqdb
    if(!country) country = typedb

    radio.set("freq", frequency)  
    radio.set("type", country) 

    fs.writeFileSync('/home/pi/fm_transmitter/start.sh', `#!/bin/bash\nsudo ./fm_transmitter -f ${frequency} song/*`)
    res.redirect("/")
    setTimeout(function() {
        exec('sudo reboot');
    }, 4000);



   
});



app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/settings',(req,res) => {
    session=req.session;
    if(session.userid){
        let namedb = wifi.fetch("name")
        let passdb = wifi.fetch("pass")
        let countrydb = wifi.fetch("country")
        let freq = radio.fetch("freq")
        if(namedb === null) namedb = "SierraPi"
        if(countrydb === null) countrydb = "NI"
        if(passdb === null) passdb = "admin123"
        if(freq === null) freq = "90.1"

        res.render("settings", { ssid: namedb, pass: passdb, country: countrydb, freq: freq});
    
    }else
    res.render('login')
});
	


app.listen(80);
console.log('Server is listening on port 80');
