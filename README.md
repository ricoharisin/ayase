ayase
===============================

simple script to makes your drawable folder content exact same across the size (ldpi, mdpi, hdpi, xhdpi, xxhdpi) written in node.js

One of the problem that android developer encountered is drawable folder.
There might be some resource (xml / image) on drawable A, for example drawable-xhdpi, but not on another drawable folder, for example drawable-hdpi.

This script will overcome that issue to makes drawable folder content is exact same


#### Feature

* check and automatically copy missing file from base folder to destination folder and vice versa
* auto resize image based on ratio (http://developer.android.com/guide/practices/screens_support.html)
* support ldpi, mdpi, hdpi, xhdpi, xxhdpi

#### Installation

make sure you have nodejs and python v2.7 installed

* clone this repo
* execute this command
    npm install

if you encountered a problem related to node-gyp please refer to this https://github.com/nodejs/node-gyp#installation

#### Usage

    nodejs ayase.js <base folder> <destination folder> --no-resize (opt)

base folder is the 'master' folder and destination folder is the 'slave'
so if the resource is missing on slave but existed on master, it will copy the resource from master to slave

use '--no-resize' option if you don't want to copied image to be resized
this is useful if your master folder size is lower than slave folder to avoid blurring
for example base folder: drawable-mdpi, destination folder drawable-xhdpi

you can run this script multiple times and do not forget to switch base folder and destination folder to make sure everything is same 
