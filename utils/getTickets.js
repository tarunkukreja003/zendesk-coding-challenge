const fetch = require('node-fetch');
async function getTickets(ticketUrl, options){
	// we'll be using pagination APIs then we'll ask whether they would like to view the next 25 or previous 25 and show the tickets accordingly
	let response = await fetch(ticketUrl, options);
	return response;
};

module.exports.getTickets = getTickets;