require('dotenv').config()
const rp = require('request-promise');
const { MongoClient } = require('mongodb');

const getCityInfo = async (cityName) => {
	// Connect to database
	// const db = await MongoClient.connect(process.env.MLAB_URL);

    /******************************************************/
    console.log("--- Looking for city ---\n");
    const city = "brussels";
    console.log(city);
	const url = "https://api.teleport.org/api/cities/?search=" + city;

	const data = await rp({
	  uri: url,
	  method: 'GET',
	  json: true,
	});
    let city_id_url = data["_embedded"]["city:search-results"][0]["_links"]["city:item"]["href"];
	console.log(city_id_url)
    
    /******************************************************/
    console.log("--- Getting city data ---\n");
    const city_data = await rp({
        uri: city_id_url,
        method: 'GET',
        json: true,
    });
    // console.log(city_data);
    let population = city_data["population"];
    console.log("population : ", population);
    
    /******************************************************/
    console.log("--- Getting urban area data ---\n");
    // ERROR IF URBAN AREA UNDEFINED --> handle with try catch
    let urban_area_url = city_data["_links"]["city:urban_area"]["href"];
    console.log(urban_area_url);
    
    const urban_area_data = await rp({
        uri: urban_area_url,
        method: 'GET',
        json: true,
    });
        
    // console.log(urban_area_data);
    /******************************************************/
    console.log("--- Getting urban area scores ---\n");
    let ua_scores_url = urban_area_url + "scores/"
    const ua_scores_data = await rp({
        uri: ua_scores_url,
        method: 'GET',
        json: true,
    });
    let ratings = {
        "housing": ua_scores_data["categories"][0]["score_out_of_10"],
        "living_cost": ua_scores_data["categories"][1]["score_out_of_10"],
        "commute": ua_scores_data["categories"][5]["score_out_of_10"],
        "safety": ua_scores_data["categories"][7]["score_out_of_10"],
        "leisure": ua_scores_data["categories"][14]["score_out_of_10"]
    }
    for (var key in ratings) {
        ratings[key] = round2(ratings[key]);
    }
    let summary = ua_scores_data["summary"];
    let avg_score =  round2(ua_scores_data["teleport_city_score"]);
    
    /******************************************************/
    console.log("--- Summary ---\n");
    
    // console.log(ua_scores_data);
    console.log("housing score :", ratings["housing"]);
    console.log("living cost score :", ratings["living_cost"]);
    console.log("commute score :", ratings["commute"]);
    console.log("safety score :", ratings["safety"]);
    console.log("leisure score :", ratings["leisure"]);
    // console.log("summary :", summary);
    console.log("avg city score :", avg_score);
}

function round2(x) {
    return Math.round(x * 100) / 100;
}

getCityInfo()











