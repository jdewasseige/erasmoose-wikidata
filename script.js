require('dotenv').config()
const wdk = require('wikidata-sdk')
const rp = require('request-promise');
const { MongoClient } = require('mongodb');

const getCityInfo = async (cityName) => {
	// Connect to database
	// const db = await MongoClient.connect(process.env.MLAB_URL);

	// Request cityName information and country
	const authorQid = 'Q535'
	const sparql = `
		SELECT ?city ?cityLabel ?population ?area ?countryLabel WHERE {
		  ?city wdt:P31 wd:Q515.
		  ?city rdfs:label ?cityLabel.
		  ?city wdt:P1082 ?population;
		  		wdt:P17 ?country;
		  		wdt:P2046 ?area.
		  FILTER CONTAINS(LCASE(?cityLabel), "${cityName.toLowerCase()}").
		  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".}
		}
		LIMIT 1
	`
	// Pasers query into a url endpoint
	const url = wdk.sparqlQuery(sparql);

	// Makes request
	const data = await rp({
	  uri: url,
	  method: 'GET',
	  json: true,
	});

	console.log("#\n", data["results"]["bindings"][0]["countryLabel"]["value"])
	

	// print out results
	// console.log(`raw data :\n`, JSON.stringify(data));
	let data_results = wdk.simplifySparqlResults(data)[0];
	// console.log(data_results);
	for (var key in data_results) {
		if (data_results.hasOwnProperty(key)) {           
        // console.log(key, data_results[key]);
    	}
	}

	// db.close();
	return data_results;
}

function exportCitiesInfo(cities_list) {
	var citiesDescriptions = {};
	var nbCities = cities.length;
	var city;
	for (var i = 0; i < nbCities; i++) {
		city = cities_list[i];
		getCityInfo(city).then(function(result) {
			citiesDescriptions[city] = result;
			console.log(result);
		})
	}
	return citiesDescriptions;
}

var cities = ["Trondheim"]
cities_dict = exportCitiesInfo(cities);

const getUniInfo = async (uniName) => {
	// Connect to database
	// const db = await MongoClient.connect(process.env.MLAB_URL);

	// Request cityName information and country
	const authorQid = 'Q535'
	const sparql = `
		SELECT ?university ?universityLabel ?universityDescription
		WHERE {
			?university wdt:P31 wd:Q3918 ;
				wdt:P17 wd:Q31.
		    FILTER CONTAINS(LCASE(?universityLabel), "${uniName.toLowerCase()}").
			SERVICE wikibase:label {
				bd:serviceParam wikibase:language "en,fr" .
			}
		}
	`
		// SELECT ?city ?cityLabel ?population ?area ?countryLabel WHERE {
		//   ?city wdt:P31 wd:Q515.
		//   ?city rdfs:label ?cityLabel.
		//   ?city wdt:P1082 ?population;
		//   		wdt:P17 ?country;
		//   		wdt:P2046 ?area.
		//   FILTER CONTAINS(LCASE(?cityLabel), "${cityName.toLowerCase()}").
		//   SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
		// }
		// LIMIT 1
	// Pasers query into a url endpoint
	const url = wdk.sparqlQuery(sparql);

	// Makes request
	const data = await rp({
	  uri: url,
	  method: 'GET',
	  json: true,
	});	

	// print out results
	// console.log(`raw data :\n`, JSON.stringify(data));
	let data_results = wdk.simplifySparqlResults(data)[0];
	// console.log(data_results);
	for (var key in data_results) {
		if (data_results.hasOwnProperty(key)) {           
        console.log(key, data_results[key]);
    	}
	}

	// db.close();
	return data_results;
}

getUniInfo("Antwerp");










