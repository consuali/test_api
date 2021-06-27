const express = require('express');
const yelp = require('yelp-fusion');
const Current = require('node-clima').Current;
const port = 3000;
const weather = new Current('dccf5671d434cb039afb37c5c4ec9197');
const client = yelp.client('2pkqbgIPhsQ6ZUGOcimSn_yFeaEgWvAm7SFvBcakmJcJJ02T8aEYPe5SR7mVilcQ2iyto0buB6hmbIwoeUUImDNNuDwuoyvndwrNu2-xQM6POcK0c5uP-TjTobfRYHYx');
const app = express();

//CHIAMATA REST CHE PRENDE IL PARAMETRO RICHIESTO DALLA URL
app.get('/cities/:city', (req, res) => {
  getData(req.params.city).then(response => {
    res.json(response);
    return;
  })
});

//FUNZIONE ASINCRONA CHE SI INTERFACCIA CON LE API E MI RESTITUISCE I DATI RICHIESTI
async function getData(city) {
  const searchCities = ['rome', 'paris', 'london', 'turin', 'madrid']
  //creo un filtro sulle città 
  if (!searchCities.includes(city.toLowerCase())) {
    return "Non hai inserito una città valida.";
  }
  // creo un nuovo oggetto result in cui inserisco i risultati ottenuti dalle due api: il meteo e le città
  const result = new Object();
  result.meteo = await weather.byCityName(city)

  const yelpResult = await client.search({
    location: city
  });
  
  //uso la funzione map per ottenere soltanto quello che mi serve all'interno dell'oggetto businesses
  result.businesses = yelpResult.jsonBody.businesses.map(x => x.name)

  return result;
}

// attivazione server

app.listen(port, () => {
  console.log(`server attivato sulla porta: ${port}`);
})