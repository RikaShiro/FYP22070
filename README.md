# Instructions

Please run this project under the latest 16.X.X LTS version of Node.js.  
Due to the limitation of Node package "http-mitm-proxy", Node version should not be later than 16.  
Date: 2023/03/22  
Latest: 16.19.1  
Use of NVM for Node version control is recommended.

## Download

This project contains too much historical data that do not contribute to current functions.
To faster the download process, please run:

```text
git clone git@github.com:RikaShiro/FYP22070.git --depth=1
```

## Install

Chinese users will probably get error when downloading "Sharp" package.  
Set Chinese mirror hosted at Alibaba for "Sharp" before install node packages.  
For Chinese users, run:  

```text
npm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp"
npm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"
npm install
```

For international users, run:  

```text
npm install
```

## Prepare

### 1. Tables

```text
npm run init
```

2 Tables are required: 'shanten' and 'enumerations'.  
There are 2 options to set up the project before actually serving.  

1. Unzip the pre-downloaded tables.  
2. Compute the tables your own, which takes around 2 minutes (CPU multi-threading).  

### 2. opencv.js

This project makes use of opencv.js.  
The official copy is available at https://docs.opencv.org/${version}/opencv.js  
Currently, version 4.7.0 is attached.  

### 3. liqi.json

liqi.json defines the actions at maj-soul.com.  
It is necessary for websocket messages decode, since the game uses protobuf to exchange information.  
This file can be obtained during user login, and should be updated together with the web game client.  

### 4. http-mitm-proxy

The command line

```text
node index.js
```

opens up a local proxy server that listens to port 22070. Besides, you have to turn on proxy in your OS setting. For Windows, please config the proxy manually in "proxy setting", for address "127.0.0.1" and port "22070". The port can be changed in ".env" file.  
At the first time you run the project, it is necessary to trust the certificate of http-mitm-proxy. The certificate path is ./.http-mitm-proxy/certs/ca.pem

## Serve

```text
npm run serve
```

It initializes the script and run the proxy on port 22070.  
