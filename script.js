require('dotenv').config()
const wdk = require('wikidata-sdk')
const rp = require('request-promise');
const { MongoClient } = require('mongodb');

const getData = async () => {
	// Connect to database
	const db = await MongoClient.connect(process.env.MLAB_URL);

	// Sample query to mongoDB
	const count = await db.collection("universities").count();
	console.log(`there are ${count} universities`);

	// Sample requet to Wikidata API
	const authorQid = 'Q535'
	const sparql = `
		SELECT ?item ?label WHERE {
		  ?item wdt:P31 wd:Q515.
		  ?item rdfs:label ?label.
		  FILTER CONTAINS(LCASE(?label), "barcelona").
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
	console.log(wdk.simplifySparqlResults(data));
	
	db.close();
	return data;
}

getData()

