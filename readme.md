## Why this fork?
* The goal of this fork is to demonstrate how to instrument an application using aspect-oriented programming techniques in concert with logging context and output patterns.
* The NodeCellar app is the best reference application for Node.js I could find, and I am just taking advantage of it being in a build-able, runnable state.
* Hopefully this "makeover" shows how you can quickly create highly instrumented applications without interfering (much) with your existing codebase

## What is different?
### Aspects
* The [Scarlet](https://github.com/scarletjs/scarlet) library was leveraged to provide time tracing for certain classes and methods
* This Aspect takes advantage of the fact that you can hijack a method in Javascript to perform "before and after" logic that is then logged.

### Interceptors
* The [Connect Logger](http://www.senchalabs.org/connect/logger.html) was introduced to capture incoming Web requests.

### Logging
* System.out calls were replaced with proper logging (winston logger) calls.

## TODO?
* Either teach winston proper patterns, or switch over to log4js
* Figure out how to set up something like MDC in the Java world.


# Node Cellar Sample Application with Backbone.js, Twitter Bootstrap, Node.js, Express, and MongoDB #

"Node Cellar" is a sample CRUD application built with with Backbone.js, Twitter Bootstrap, Node.js, Express, and MongoDB.

The application allows you to browse through a list of wines, as well as add, update, and delete wines.

This application is further documented [here](http://coenraets.org/blog).

The application is also hosted online. You can test it [here](http://nodecellar.coenraets.org).


## To run the application on your own Heroku account:##

1. Install the [Heroku Toolbelt](http://toolbelt.heroku.com)

2. [Sign up](http://heroku.com/signup) for a Heroku account

3. Login to Heroku from the `heroku` CLI:

        $ heroku login

4. Create a new app on Heroku:

        $ heroku create

5. Add the [MongoLab Heroku Add-on](http://addons.heroku.com/mongolab)

        $ heroku addons:add mongolab

6. Upload the app to Heroku:

        $ git push heroku master

7. Open the app in your browser:

        $ heroku open

