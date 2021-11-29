
const readline = require('readline');
const { base64encode, base64decode } = require('nodejs-base64');
const credentials = require('dotenv').config();
const URLS = require('./constants/urls');
const STATUS_CODES = require('./constants/statusCodes');
let getTickets = require('./utils/getTickets');

let baseURL = URLS.URLS.BASE_URL;
let username = credentials.parsed.USERNAME;
let password = credentials.parsed.PASSWORD;





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




async function callgetTickets(ticketUrl){

	try{

	

		let getTicketsResponse = await getTickets.getTickets(ticketUrl, myTickets.options);
		if (getTicketsResponse.status == STATUS_CODES.STATUS_CODES.OK){
			let ticketsObj = await getTicketsResponse.json();

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

			throw new Error(`Problem fetching the tickets: ${getTicketsResponse} `);

		}
	}catch(error){
		console.error(error);
	}


}

async function getATicket(ticketUrl, options){
	try{
		let getTicketResponse = await getTickets.getATicket(ticketUrl, options);
		if (getTicketResponse.status == STATUS_CODES.STATUS_CODES.OK) {
			let ticketObj = await getTicketResponse.json();
			console.log(ticketDetails(ticketObj.ticket));
			recursiveShowMenu();
		}
		else{
			throw new Error(`Problem fetching the ticket: ${getTicketResponse}. Please enter a valid ticket number`);
		}
	}catch(err){
		console.error(err);
		recursiveShowMenu();
	}
    
};



function recursiveViewTickets(currentTicketsUrl) {

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
			callgetTickets(myTickets.url);
			
		
		}
		else if (responseNested == '2') {
			prompts.question("Please enter the ticket number to view: ", (ticketNumberResponse) => {

				let ticketUrl = baseURL + "/api/v2/tickets/" + ticketNumberResponse +".json";
				getATicket(ticketUrl, myTickets.options);
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




const prompts = readline.createInterface(process.stdin, process.stdout);



function recursiveQuestion(){


	prompts.question('Type menu to view options and quit to exit : ', (response) => {

		// check the response.
		if(response.toLocaleLowerCase() == 'menu') {
			recursiveShowMenu();
		}
		else if(response.toLocaleLowerCase() == 'quit') {
			process.exit();
		}
		else {
			console.log("Sorry, this option doesn't exist, please type either menu or quit \n");
			recursiveQuestion();
		}

	});

}



recursiveQuestion();



