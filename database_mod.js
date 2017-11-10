require('dotenv').config()
const wdk = require('wikidata-sdk')
const rp = require('request-promise');
const { MongoClient } = require('mongodb');

const modifyDB = async (cityName) => {
	// Connect to database
	const db = await MongoClient.connect(process.env.MLAB_URL);
	const University = db.collection("universities");
	const City = db.collection("cities");

	// const count = await University.find({country: "Netherlands"}).count();
	// console.log(count)

	const unis = await University.find().toArray();

	for (let i = 0; i < unis.length; i++) {
		let item = unis[i];
		const count = await City.find({name: item.city_name }).count();
		console.log(count);
		if (count <= 0) {
			const rec = await City.insertOne( { name: item.city_name, country: item.country } );
			console.log(rec);
		}
	}

	db.close();
}

// modifyDB();