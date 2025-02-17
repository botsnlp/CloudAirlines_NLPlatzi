'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const videowelcome = 'https://www.youtube.com/watch?v=U9hq83ryFj0';
const welcome = 'https://media3.giphy.com/media/9Y5dai0r8F9xb5FCrw/giphy.gif?cid=3640f6095c96e7c87a56424a41e5d14f';
const welcome2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCI7tShlyVeubGtVbh6XTCPNfZVlXFFYOEO55zskrSjLzwEKUQ';
const infovuelos = 'https://media3.giphy.com/media/atZII8NmbPGw0/giphy.gif?cid=790b76115ce5b0944366663159488200&rid=giphy.gif';

const admin = require('firebase-admin');
var firebaseConfig = {
  authDomain: "SU_ID",
    databaseURL: "SU_ID",
    projectId: "SU_ID",
    storageBucket: "SU_ID",
    messagingSenderId: "SU_ID"
  };

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
function welcome(agent) {
    agent.add(`Bienvenid@ te saluda Ted 🤖, la asistente virtual de Cloud Airliness`);
    agent.add(new Card({
        title: `NLP Demo `,
        imageUrl: welcome2,
        text: `Automatización de reservación de vuelos en una base datos en tiempo real en la nube.`,
        buttonText: 'Ver Video', 
        buttonUrl: videowelcome
      })
    );
    agent.add(`Recuerda que fui entrenada:`);
 agent.add(new Suggestion(`Reservar vuelos`));   
 agent.add(new Suggestion(`Códigos aeropuertos`));
	
   
  }
function fallback(agent) {
    agent.add(`Recuerda que fui entrenada en:`);
 agent.add(new Suggestion(`Reservar vuelos`));   
 agent.add(new Suggestion(`Códigos aeropuertos`));
  
  }
  
function booktype(agent) { 
 agent.add(`Excelente, que tipo de vuelo buscas?`);
 agent.add(new Suggestion(`Solo ida`));
 agent.add(new Suggestion(`Ida y vuelta`));
 agent.add(new Suggestion(`Multidestino`));   


}


function book (agent) {
    // Get parameter from Dialogflow with the string to add to the database
    const name = agent.parameters.name;
	const email = agent.parameters.email;
	const idpassport = agent.parameters.idpassport;
	const paispassport = agent.parameters.paispassport;
	const origin = agent.parameters.origin;
	const fecha1 = agent.parameters.fecha1;
	const destination = agent.parameters.destination;
	const fecha2 = agent.parameters.fecha2;
	const quant = agent.parameters.quant;
	const tyc = agent.parameters.tyc;

    // Get the database collection 'dialogflow' and document 'agent' and store
    // the document  {entry: "<value of database entry>"} in the 'agent' document
    const dialogflowAgentRef = db.collection('reservavuelos_roundtrip').doc();
    return db.runTransaction(t => {
      t.set(dialogflowAgentRef, { viiipaispassport: paispassport, viFecha2: fecha2, vDestino: destination, ivFecha1: fecha1, iiiOrigen:origin, iiEmail: email, iNombre: name});
	 

      return Promise.resolve('Write complete');
    }).then(doc => {
      agent.add(`Excellent "${name}" your flight was booked successfully. `);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      agent.add(`Failed to write "${name}" to the Firestore database.`);
    });
  }

function book2 (agent) {
    // Get parameter from Dialogflow with the string to add to the database
    const name = agent.parameters.name;
	const email = agent.parameters.email;
	const idpassport = agent.parameters.idpassport;
	const origin = agent.parameters.origin;
	const fecha1 = agent.parameters.fecha1;
	const destination = agent.parameters.destination;
	const quant = agent.parameters.quant;
	const tyc = agent.parameters.tyc;

    // Get the database collection 'dialogflow' and document 'agent' and store
    // the document  {entry: "<value of database entry>"} in the 'agent' document
    const dialogflowAgentRef = db.collection('reservavuelos_oneway').doc();
    return db.runTransaction(t => {
      t.set(dialogflowAgentRef, { vDestino: destination, ivFecha1: fecha1, iiiOrigen:origin, iiEmail: email, iNombre: name});
	 

      return Promise.resolve('Write complete');
    }).then(doc => {
      agent.add(`Excellent "${name}" your flight was booked successfully. `);
    }).catch(err => {
      console.log(`Error writing to Firestore: ${err}`);
      agent.add(`Failed to write "${name}" to the Firestore database.`);
    });
  }
  
 

  let intentMap = new Map();
intentMap.set('Default Welcome Intent', welcome);
intentMap.set('Default Fallback Intent', fallback);
intentMap.set('book', booktype);
intentMap.set('book.roundtrip', book);
intentMap.set('book.oneway', book2);
  
  agent.handleRequest(intentMap);
});
