# SierraPi Manager
## _A simple node app for a SierraPi_

![N|Solid](	https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=Raspberry%20Pi&logoColor=white)

![Badge](https://img.shields.io/github/license/dgaray01/sierrapi-manager?label=License)
![Badge](https://img.shields.io/github/last-commit/dgaray01/sierrapi-manager?label=Last%20commit)
![Badge](https://img.shields.io/github/forks/dgaray01/sierrapi-manager?style=social)


A simple node.js app made for customizing, setup, manage
and control transmissions, wifi settings, check performance
and more for your SierraPi!
## Features

- Check RAM and Disk usage
- Restart and power off your SierraPi
- Add, archive and remove songs for transmission
- Change your transmission frequency, wifi password and wifi SSID
- Secure and fast.

## Installation

___

#### Manual
SierraPi Manager requires [Node.js](https://nodejs.org/) v10+ and Raspbian Full to run.

Install the dependencies needed
```sh
sudo apt-get update
sudo apt-get install make build-essential
```

Install the FM_Transmitter
```sh
cd /home/pi
git clone https://github.com/markondej/fm_transmitter
cd fm_transmitter
mkdir song && mkdir archive
echo "performance"| sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```
Now let's install the power button for the SierraPi
```sh
cd /home/pi
git clone https://github.com/dgaray01/power-button-rpi
cd power-button-pi
./pi-power-button/script/install
```
Now press the button and it should turn the SierraPi off, press it again and it should turn on.

Create a crontab job.
```sh
crontab -e
```
Add this line at the end:
```crontab
aaaaaaaaa
```
Install the webserver.

```sh
cd /home/pi
git clone https://github.com/dgaray01/sierrapi-manager
cd sierrapi-manager
npm install --save
```
The webserver runs on port 8080, so make sure this port is available.

___
# Install image
If you don't want to install it manually you can just download and install a custom .img file 
to your SierraPi.

[Download](http://cdn.dgaray.me/sierrapi1.img)
We do not guarantee this will work on other RaspberryPi model, only on RaspberryPi 4 Model B
Now connect your microSD card to your computer and flash it using an imager. 

Recomended apps:
1) https://www.raspberrypi.com/software/
2) https://www.balena.io/etcher/

Login info:
Hostname: ``raspberrypi``
User: ``pi``
Password: ``admin123``

---
## Development

Want to contribute? Great!

There are severals ways you can contribute to this project.
[PayPal](https://paypal.me/dgaray01)

## License

MIT

**Free Software, Hell Yeah!**
