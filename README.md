# Instructions

Please run this project under the latest LTS version of Node.js.  
Date: 2023/03/18  
Latest: 18.15.0  
Use of NVM for Node version control is recommended.

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

## Preprocess

There are 2 options to set up the project before actually serving.  

1. Unzip pre-downloaded files to get the necessary resources.  
2. Compute the resources on your own, which takes around 3 minutes.  

## Serve

```text
npm run serve
```

It initializes the script and run the proxy on port 22070.  
