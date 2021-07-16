# ![Shiny charm icon](https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/src/assets/icons/shiny-charm.png?raw=true) Pokémon Shiny Tracker ![Shiny charm icon](https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/src/assets/icons/shiny-charm.png?raw=true)

## Introduction

<p align="center">
  <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/version_2.0.0/screenshots/screen_01.png?raw=true" width="200" title="Screen 1" alt="Screen 1">
  <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/version_2.0.0/screenshots/screen_02.png?raw=true" width="200" title="Screen 2" alt="Screen 2">
  <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/version_2.0.0/screenshots/screen_03.png?raw=true" width="200" title="Screen 3" alt="Screen 3">
  <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/version_2.0.0/screenshots/screen_04.png?raw=true" width="200" title="Screen 4" alt="Screen 4">
</p>

The <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/master/src/assets/icons/shiny-charm.png?raw=true" width="16" title="Shiny charm icon" alt="Shiny charm icon">`Pokémon Shiny Tracker` project is a webapp meant to track the number of encouters you did while shiny hunting.

The sidebar menu allows you to create and manage your ongoing hunts. You can : 

 - Create a new hunt, 
 - Delete an ongoing hunt,
 - Choose a hunt to display on the "Ongoing hunt" tab.

The first tab, "Ongoing hunt", displays your current hunt. On this tab, you can : 

 - Increment / decrement the hunt counter
 - Mark the hunt as shiny. A hunt marked as shiny will be moved to the "Finished hunt" tab.

On the second tab, "Finished hunt", the list of your past, finished hunt is displayed. On this tab, you can : 

 - Filter the hunts displayed with a search bar. Valid filters are Pokémon name, or part of their name. You can also use the following special filters : 
   - `*masuda` : will filter the hunts where the option "Masuda method" was selected,
   - `*charm`: will filter the hunts where the option "Shiny Charm" was selected.
 - Delete a finished hunt.

Here is an explanation of the data displayed for a hunt :

<p align="center">
  <img src="https://github.com/demarbre1u/pokemon-shiny-tracker/blob/version_2.0.0/screenshots/pokemon_display.png?raw=true" width="400" title="Pokémon display" alt="Pokémon display">
</p>

There is an image of the hunted Pokémon to the left.

To the right of the image, from top to bottom : 

 - The name of the Pokémon,
 - To the right of the Pokémon name, charms icons depending on the selected option (pink for Masuda Method, blue for Shiny Charm), 
 - Bellow the Pokémon name, a progress bar representing the probability to have found 1 shiny so far, considering the number of encouters made, 
 - Bellow the progress bar, The number of encounters, followed by the type of encounter.


This app was made using Angular 7, and Cordova. It can be used both on a browser and on an Android phone. 

## Versions

Each major version of the app has its own branch.

The different versions of the APK can be downloaded here : 

 - [`v1.0.0`](https://github.com/demarbre1u/pokemon-shiny-tracker/blob/version_2.0.0/apk/pokemon-shiny-tracker_v1.0.0.apk)
 - [`v2.0.0`](https://github.com/demarbre1u/pokemon-shiny-tracker/blob/version_2.0.0/apk/pokemon-shiny-tracker_v2.0.0.apk)

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
