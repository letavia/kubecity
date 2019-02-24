/*
 * restaurantfeeder.js
 * Copyright(c) 2015 Bitergia
 * Author: Alvaro del Castillo <acs@bitergia.com>,
 * Alberto Martín <alberto.martin@bitergia.com>
 * MIT Licensed
 *
 *  Feeds restaurants into Orion CB
 *
 *  First it gets all restaurant information from the JSON file and
 *  the geolocation objects from the GEO JSON file
 *  Then all restaurant data is added to Orion CB
*/

// jshint node: true

'use strict';

var path = require('path');
var utils = require('../utils');
var config = require('../config');
var fs = require('fs');

var EVENT_TYPE = 'Feature';
var POSTAL_ADDRESS_TYPE = 'PostalAddress';
var PROPERTY_VALUE_TYPE = 'PropertyValue';
var DATE_TYPE = 'DateTime';
//var AGGREGATE_RATING_TYPE = 'AggregateRating';

var cacheFile = '../data/kulturklik.json';
//var geolocationFile = '../data/restaurantsGeo.json';
var eventsAdded = 0;
var eventsData; // All data for the events
var geoData;
var eventSelected;
var numberOfevents;

var fiwareHeaders = {
  'fiware-service': config.fiwareService
};

/**
 * Function to display a help menu using the CLI
*/
function showHelp() {
  var progname = path.basename(process.argv[1]);
  // jshint multistr: true, maxlen: false
  // jscs:disable maximumLineLength, disallowMultipleLineStrings
  var helpMessage = [
    '',
    'Generate events based in Open Euskadi JSON and load it into Orion Context Broker.',
    '',
    'Usage: ' + progname + ' <options>',
    '',
    'Available options:',
    '',
    '  -h  --help                          Show this help.',
    '  -f  --jsonfile                      Use a different JSON data from Open Euskadi.',
    '                                      (Feeder expects the same format).',
    '                                      It use by default the one provided in ',
    '                                      \'server/data/events.json\'. ',
    '  -g  --geofile                       Use a different JSON data for event Geolocation. ',
    '                                      It use by default the one provided in ',
    '                                      \'server/data/eventsGeo.json\' (retrieved with Google).',
    '  -r  --event                    Load a single event of the JSON provided using its name.',
    '  -n  --numberOfevents           Load a defined number of events among the ',
    '                                      provided ones (can\'t be used with the previous option).',
    ''].join('\n');
  // jshint multistr: false, maxlen: 80
  // jscs:enable
  console.log(helpMessage);
  process.exit(0);
}

/**
 * Function to parse the arguments given launching the script
*/
function parseArgs() {
  if (process.argv.length < 3) {
    // no args, use defaults
    return;
  }

  var argv = require('minimist')(process.argv.slice(2), {
    alias: {
      h: 'help',
      f: 'jsonfile',
      g: 'geofile',
      r: 'event',
      n: 'numberOfevents'
    },
    default: {
      'jsonfile': '../data/kulturklik.json'
      //'geofile': '../data/restaurantsGeo.json'
    }
  });

  if (argv.help) {
    showHelp();
  }

  if (typeof argv.jsonfile === 'string' && argv.jsonfile !== '') {
    cacheFile = argv.jsonfile;
  }

  if (typeof argv.geofile === 'string' && argv.geofile !== '') {
    geolocationFile = argv.geofile;
  }

  if (typeof argv.event === 'string' && argv.event !== '') {
    eventSelected = argv.event;
  }

  if (typeof argv.numberOfevents === 'number' &&
      argv.numberOfevents !== '') {
    numberOfevents = argv.numberOfevents;
  }

  if (argv.event && argv.numberOfevents) {
    console.error('\'event\' and \'numberOfevents\' ' +
                  'are incompatible. Please try again.');
    showHelp();
    process.exit(1);
  }
}

/**
 * Function that logs the progress of the events loading
 *
 * @param {String} eventIdentifier - event identifier
*/
function logProgress(eventIdentifier) {
  if (eventIdentifier) {
    console.warn('The event', eventIdentifier, 'exists');
  } else {
    eventsAdded++;
    console.info(eventsAdded + '/' + eventsData.length);
  }
}

/**
 * Function to read the event information from a given file
*/
function loadEventData() {
  console.info('Loading events info ...');
  var data = fs.readFileSync(cacheFile);
  eventsData = JSON.parse(data);

  if (eventSelected) {
    eventsData = eventsData.filter(function(element) {
      if (eventSelected === element.documentName) {
        return true;
      }
    });
  }
  if (numberOfevents) {
    eventsData = eventsData.slice(0,numberOfevents);
  }
}

/**
 * Function to read the Geolocation information from a given file
*/
function loadGeoData() {
  var data = fs.readFileSync(geolocationFile);
  geoData = JSON.parse(data);
}

/**
 * Function to generate the organization based on the event name
 *
 * @param {String} rname - event name
 * @return {String} The organization name
*/
function selectOrganization(rname) {
  var id = utils.generateId(rname);
  var n = (parseInt(id.replace(/[a-z]/gi, '').slice(0,10)) % 4) + 1;
  return 'Franchise' + n;
}

/**
 * Function that adapts the information for Orion Context Broker
*/
function feedOrionevents() {
  console.info('Feeding events info in orion.');
  console.info('Number of events: ' + eventsData.length);

  var dictionary = {
    'id': 'name',
    'eventType': 'eventType',
    'eventStartDate': 'eventStartDate',
	'eventEndDate': 'eventEndDate',
    'country': 'country',
    'eventRegistrationStartDate': 'eventRegistrationStartDate',
	'eventRegistrationEndDate': 'eventRegistrationEndDate',
    'eventLanguages': 'eventLanguages',
	'eventOnLine': 'eventOnLine',
  };

  var addressDictionary = {
    'placename': 'placename',
    'municipality': 'municipality',
    'municipalityCode': 'postalCode'
  };

  var organization = ['Feature', 'Sport'
  ];
  var capacity = [50, 80, 100, 120, 160, 200];

  eventsData.forEach(function(element, index) {
    var rname = utils.fixedEncodeURIComponent(
      eventsData[index].documentName);

    var attr = {
      'type': EVENT_TYPE,
      'id': utils.generateId(rname),
      'address': {
        'type': POSTAL_ADDRESS_TYPE,
        'value': {}
      },
      'name': {
        'value': rname
      },
      'department': {
        'value': selectOrganization(rname),
      },
      'capacity': {
        'type': PROPERTY_VALUE_TYPE,
        'value': utils.randomElement(capacity)
      },
      'occupancyLevels': {
        'metadata': {
          'timestamp': {
            'type': DATE_TYPE,
            'value': new Date().toISOString()
          }
        },
        'type': PROPERTY_VALUE_TYPE,
        'value': 0
      }
    };

    Object.keys(eventsData[index]).forEach(function(element) {
      var val = eventsData[index][element];
      if (val) {
        if (element in addressDictionary) {
          element = utils.fixedEncodeURIComponent(
            utils.replaceOnceUsingDictionary(addressDictionary, element));
          attr.address.value[element] = utils.fixedEncodeURIComponent(val);
        } else if (element in dictionary) {
          element = utils.fixedEncodeURIComponent(
            utils.replaceOnceUsingDictionary(dictionary, element));
          if (element == 'priceRange') {
            attr[element] = {
              'value': parseFloat(val)
            };
          } else {
            attr[element] = {
              'value': utils.fixedEncodeURIComponent(
                utils.convertHtmlToText(val))
            };
          }
        }
      }
    });
    sendEvent(attr);
  });
}

/**
 * Function that sends the information to Orion Context Broker
 *
 * @param {String} event - event to load
*/
function sendEvent(event) {
  var fwHeaders = JSON.parse(JSON.stringify(fiwareHeaders));
  utils.getListByType('Event', event.id, fwHeaders)
  .then(function(data) {
    logProgress(event.id);
  })
  .catch(function(err) {
    if (err.statusCode == '404') {
      if (event.department.value) {
        fwHeaders['fiware-servicepath'] = '/' + event.department.value;
      }
      event = utils.addGeolocation(event, geoData[event.id]);
      event = utils.completeAddress(event, geoData[event.id]);
      utils.sendRequest('POST', event, null, fwHeaders)
      .then(logProgress(null))
      .catch(function(err) {
        console.error(err);
      });
    }
  });
}

parseArgs();
loadEventData();
loadGeoData();
feedOrionEvents();