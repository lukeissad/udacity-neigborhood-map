# Udacity Neighborhood Map Project

A Google Maps + React project, using Foursquare API for the Udacity Front-End Web Developer Nanodegree Program.

## Table of Contents

* [Project Details](#project-details)
* [How to Run](#how-to-run)
  * [Development build](#development-build)
  * [Production build](#production-build)
* [Resources](#resources)

## Project Details

For the Neighborhood Map project the student had to create a single page application featuring a map of a neighborhood of their choice. They had to add functionality to this map including highlighted locations, third-party data and various ways to browse the content.

## How to Run

### Development build

* clone this repository
* navigate into the newly created app folder
* install the project dependencies with `npm install`
* launch the app with `npm start`
* After a moment a new browser window should open, displaying the app. If it doesn't, you can see the app by going to this address http://localhost:3000/ in the browser of your choice

_**Note:** The Service Worker for this app is implemented only in the production build!_

### Production build

* clone or download this repository
* navigate into the newly created app folder
* install the project dependencies with `npm install`
* create a production build with `npm run build`
* install serve with `npm install -g serve`
* serve the build with `serve -s build`
* go to http://localhost:5000/ in the browser of your choice

## Resources

An article I found most helpful during development: [How to Write a Google Maps React Component](https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/).

This project uses [Google Maps API](https://cloud.google.com/maps-platform/) as well as [Foursquare API](https://developer.foursquare.com/).

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
