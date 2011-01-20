    !!!!!!!!!!!!!!!!!!!!!!!!!!
    !! NOT PRODUCTION READY !!
    !! USE AT YOUR OWN RISK !!
    !!!!!!!!!!!!!!!!!!!!!!!!!!
## January 2011: Zeppelin is currently pre-alpha software. 
We expect to move to a first production version within the next few weeks. Documentation and further updates to follow... @pelger

## Zeppelin
Zeppelin is a cloud development framework that is oriented to run multiple applications on the same node stack.
Zeppelin is based on two key principals:

 * Keep everything as simple as possible

 * Avoid doing work wherever possible

Zeppelin has a server and client side components. As much processing as possible is handled on the client side, for example view templates are
processed on the client moving processing load from the server. Client side templating is handled through the excellent jquote library.

## Key Features:

 * Multiple applications per server stack instance

 * Distributed MVC architecture - template processing and rendering is done on the client

 * Built in WebDav CMS support
 
 * Simple application layout 

## Application layout and configuration
Applications built ontop of the Zeppelin framework should have the following structure.

    hello
    |
    |-- app
    |   |-- controllers
    |   |   `-- my_mvc.js
    |   |-- helpers
    |   |   `-- my_mvc.js
    |   `-- models
    |       `-- my_mvc.js
    |-- public
    |   `-- hello
    |       |-- css
    |       |   |-- presentational.css
    |       |   |-- reset.css
    |       |   `-- structural.css
    |       |-- index.html
    |       |-- js
    |       |   `-- app.js
    |       `-- views
    |           `-- my_mvc.ztp.html
    |-- test
    |   |-- acceptance
    |   `-- unit
    |       `-- my_mvc_test.js
    `-- zconfig.js

Application configuration is through the file zconfig.js placed in the root of an application. Typically this looks like.

    exports.config = 
    {
      live: {enabled: "true", environment: "development"},

      environments: {test: {database: "quoteorama-test"},
                     development: {database: "quoteorama-development"},
                     production: {database: "quoteorama-production"}},

      webdav: true,
    }

In order to create and deploy an application create a similar directory structure and point the zeppelin framework at it.

## Framework configuration
The framework is configured through a single file zconfig.js. This file should be passed to the framework on startup. The framework
configuration file should look like the following:

    exports.config = 
    {
      live: {environment: "development"},

      "applications": [{name: "examples",
                        description: "example applications",
                        hostIp: "localhost",
                        portNumber: 3500,
                        roots: ["/home/me/work/Zeppelin/Zeppelin/examples"]}],

      environments: {test: {database: { driver: "mongo",
                                        host: "localhost",
                                        port: 27017}},

      development: {database: { driver: "mongo",
                                host: "localhost",
                                port: 27017}},

      production: {database: { driver: "mongo",
                               host: "localhost",
                               port: 27017}}},
    }

## Installation
Zeppelin should be installed through npm:

npm install zeppelin

## Usage
Zepplin can be run by executing:

    zeppelin frameworkconfigfile

where frameworkconfigfile is the framework configuration as specified above.

For a full tutorial please see this gist - (TODO - will be in place by end of Jan 2011).

## Dependencies
Zeppelin requires the following modules:

 * npm install connect
 * npm install jsDAV
 * npm install underscore
 * npm install node-uuid
 * npm install eyes
 * npm install mongodb
 * npm install expresso

You'll need to install a suitable driver for your database:
    npm install mongodb
    npm install aws-lib

Currently mongodb is the default data store.

## Getting involved
We activly welcome contributions to Zeppelin. Connect though:

email: elger dot peter at gmail
follow zeppelin on twitter: @pelger

## A Whole lotta love
Zeppelin is built on top of the great work of its dependant modules, jquery, jquote and of course node.js

Hey Hey beh beh when you shake that thing...

