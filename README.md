# ![Shiny charm icon](https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/src/assets/icons/shiny-charm.png?raw=true) Pokémon Shiny Tracker ![Shiny charm icon](https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/src/assets/icons/shiny-charm.png?raw=true)

## Introduction

<p align="center">
  <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/screenshots/screen_01.png?raw=true" width="200" title="Screen 1" alt="Screen 1">
  <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/screenshots/screen_02.png?raw=true" width="200" title="Screen 2" alt="Screen 2">
  <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/screenshots/screen_03.png?raw=true" width="200" title="Screen 3" alt="Screen 3">
</p>

The <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/src/assets/icons/shiny-charm.png?raw=true" width="16" title="Shiny charm icon" alt="Shiny charm icon">`Pokémon Shiny Tracker` project is a webapp meant to track the number of encouters you did while shiny hunting.

It keeps track of :

 - the hunted Pokémon, 
 - the number of encouters, 
 - the method used, 
 - the generation selected, 
 - some additionnal options (Masuda, shiny charm).

Additionnaly, it can work out the probability to have found 1 shiny based on the previous data.

This app was made using Angular 7, and Cordova. It can be used both on a browser and on an Android phone. 

The APK of the app (version `1.0.0`) is available [here](https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/apk/pokemon-shiny-tracker_v1.0.0.apk).

## How to install & run

To install the project :

```bash 
git clone git@github.com:demarbre1u/pokemon-shiny-tracker.git
cd pokemon-shiny-tracker/
npm install
```

Then to run the project :

```bash
ng serve
```

Or, to open the app directly in your browser : 

```bash
ng serve -o
```

Finally, navigate to `http://localhost:4200/`.

## How to build & run the app

To build the app : 

```bash
npm install
ng build --prod --aot
cordova platform add android
cordova build android
```

To run the app (on an emulator) :

```bash
cordova run android
```

To run the app (on a plugged device) :

```bash
cordova run android --device
```
