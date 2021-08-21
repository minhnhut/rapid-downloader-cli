## Install

```
npm install -g rapid-downloader-cli
```

## Usage

```
rapid [URL to download]
```

## Available options

### Force single connection

```
rapid --single [URL to download]
```

### Specify number of connections should be used

Default are 8 connections. Be caution that too many connections may clog your network traffic.

```
rapid -c 16 [URL to download]
```