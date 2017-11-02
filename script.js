require('dotenv').config()
const wdk = require('wikidata-sdk')
const rp = require('request-promise');
const { MongoClient } = require('mongodb');


const getCityInfo = async (cityName) => {
	// Connect to database
	const db = await MongoClient.connect(process.env.MLAB_URL);

	// Request cityName information and country
	const authorQid = 'Q535'
	const sparql = `
		SELECT ?item ?label ?population WHERE {
		  ?item wdt:P31 wd:Q515.
		  ?item rdfs:label ?label.
		  ?item wdt:P1082 ?population. 
		  FILTER CONTAINS(LCASE(?label), "${cityName.toLowerCase()}").
		  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
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

	// print out results
	// console.log(`raw data :\n`, JSON.stringify(data));
	const data_results = wdk.simplifySparqlResults(data)[0];
	console.log(data_results);
	for (var key in data_results) {
		if (data_results.hasOwnProperty(key)) {           
        console.log(key, data_results[key]);
    	}
	}

	db.close();
	return data;
}

getCityInfo('Liège')
