// import the readline module for work with stdin, or stdout.
const readline = require('readline');
const { base64encode, base64decode } = require('nodejs-base64');
const fetch = require('node-fetch');
const credentials = require('dotenv').config();
const URLS = require('./constants/urls');
const STATUS_CODES = require('./constants/statusCodes');

// create a readline object to work with the stream.
// pass the stdin, or stdout in the current process.

// put urls in some const files
// clean the code

let baseURL = URLS.URLS.BASE_URL;
let username = credentials.parsed.USERNAME;
let password = credentials.parsed.PASSWORD;




// the limit is currently 25 tickets per page but an extension would be to customise this by asking the user of how many tickets do they want to view or we can ask the user for the range of ticket numbers they would like to view

let urlGetTickets = new URL(baseURL + "api/v2/tickets.json"),params = {"page[size]":25}

Object.keys(params).forEach(key => urlGetTickets.searchParams.append(key, params[key]))

let myTickets = {
	url: urlGetTickets,
	options: {
		method: "GET",
		headers: { 
			"Content-Type": "application/json" ,
			'Authorization': 'Basic ' + base64encode(username + ":" + password)
		}
	}
};


async function getTickets(ticketUrl, options){
	// we'll be using pagination APIs then we'll ask whether they would like to view the next 25 or previous 25 and show the tickets accordingly
	let response = await fetch(ticketUrl, options);
	return response;
	// let fetchedTicketsArr = tickets.tickets ;
	// return fetchedTicketsArr
};

async function callgetTickets(ticketUrl){

	let getTicketsResponse = await getTickets(ticketUrl, myTickets.options);
	if (getTicketsResponse.status == STATUS_CODES.STATUS_CODES.OK){
		let ticketsObj = await getTicketsResponse.json();
		// call the function here which will display the specific information of tickets

		for(let i=0; i<ticketsObj.tickets.length; i++){
			console.log(ticketDetails(ticketsObj.tickets[i]));
		}
		if (ticketsObj.meta.has_more){
			recursiveViewTickets(ticketsObj.links.next);
		}
		else {
			console.log('You have seen all the tickets, following is the menu \n');
			recursiveShowMenu();
		}
	}
	else {

		console.log('Hello');

	}


}



function recursiveViewTickets(currentTicketsUrl) {

	// Do for before link as well
	prompts.question('Would you like to view more tickets? (Yes/No) ', async function(responseYesOrNo) {
		if (responseYesOrNo.toLocaleLowerCase() == 'yes') {
			console.log('Following are the next tickets');
			callgetTickets(currentTicketsUrl)
			}
		else if (responseYesOrNo.toLocaleLowerCase() == 'no'){
			recursiveShowMenu();
		}
		else {
			console.log("Please enter either Yes or No");
			recursiveViewTickets(currentTicketsUrl);
		}
		});
	}

function recursiveShowMenu(){
			
		
	prompts.question('Menu options: \n * Press 1 to view all tickets \n * Press 2 to view a ticket \n * Press 3 to quit \n', async function(responseNested) {
		if (responseNested == '1') {
			// hit the API to view all the tickets
			callgetTickets(myTickets.url);
			
		
		}
		else if (responseNested == '2') {
			// first request the ticket number and check whether that ticket exists
			prompts.question("Please enter the ticket number to view: ", (ticketNumberResponse) => {
				// getTicketUrl(ticketNumberResponse);

				fetch(baseURL + "/api/v2/tickets/" + ticketNumberResponse +".json", myTickets.options)
				.then((res) => {
					if (res.status >= 200 && res.status <= 299) {
						return res.json();
					} else {
						throw Error(res.statusText);
					}
				})
				.then((ticket) => {
					 console.log(ticketDetails(ticket.ticket))
					 recursiveShowMenu();
				})
				.catch((err) => {
					let errorMessage = "Ticket: " + err + ". Please enter another number";
					console.log(errorMessage);
				});
			})
		}

		else if (responseNested == '3') {
			process.exit();
		}
		else {
			console.log("Sorry, this menu option doesn't exist, following is the menu \n");
			recursiveShowMenu();
		}
	});

}

function ticketDetails(ticket){
	let ticketId = ticket.id;
	let ticketStatus = ticket.status;
	let requesterId = ticket.requester_id;
	let assigneeId = ticket.assignee_id;

	let message = `Ticket number ${ticketId} is ${ticketStatus}. It is requested by ${requesterId} and assigned to ${assigneeId} `;

	return message;

}






// recursive function will break after it will reach its maximum recursion depth

const prompts = readline.createInterface(process.stdin, process.stdout);


// create a question or there handler.

// The code currently works for my account but we can get the user input for a different sub domain and the credentials for the subdomain, and authenticate the crdentials for that subdomain

function recursiveQuestion(){


	prompts.question('Type menu to view options and quit to exit : ', (response) => {

		// check the response.
		if(response.toLocaleLowerCase() == 'menu') {


			recursiveShowMenu();
		}
		else if(response.toLocaleLowerCase() == 'quit') {
			// console.log("You are a part of the very huge learning community.");
			process.exit();
		}
		else {
			console.log("Sorry, this option doesn't exist, please type either menu or quit \n");
			recursiveQuestion();
		}

		// after the all work is done want to terminate this process.

	});

}

recursiveQuestion();


module.exports.getTickets = getTickets;



