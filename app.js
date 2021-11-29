// import the readline module for work with stdin, or stdout.
const readline = require('readline');
const { base64encode, base64decode } = require('nodejs-base64');
const fetch = require('node-fetch');
const credentials = require('dotenv').config();


// create a readline object to work with the stream.
// pass the stdin, or stdout in the current process.

let baseURL = "https://zccstudentstarun003.zendesk.com/";
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


// let url = baseURL + "/api/v2/tickets/" + ticketNumberStr +".json"
// getTicket = {
// 	url: url,
// 	options: {
// 		method: "GET",
// 		headers: { 
// 			"Content-Type": "application/json" ,
// 			'Authorization': 'Basic ' + base64encode(username + ":" + password)
// 		}
// 	}
// };



// recursive function will break after it will reach its maximum recursion depth

const prompts = readline.createInterface(process.stdin, process.stdout);


// create a question or there handler.

// The code currently works for my account but we can get the user input for a different sub domain and the credentials for the subdomain, and authenticate the crdentials for that subdomain

function recursiveQuestion(){


	prompts.question('Type menu to view options and quit to exit : ', (response) => {

		// check the response.
		if(response.toLocaleLowerCase() == 'menu') {

			function recursiveShowMenu(){
				
			
				prompts.question('Menu options: \n * Press 1 to view all tickets \n * Press 2 to view a ticket \n * Press 3 to quit \n', function(responseNested) {
					if (responseNested == '1') {
						// hit the API to view all the tickets
						async function getTickets(){
							// we'll be using pagination APIs then we'll ask whether they would like to view the next 25 or previous 25 and show the tickets accordingly
							let ticketsData = await fetch(myTickets.url, myTickets.options);
							let tickets = await ticketsData.json();
							let fetchedTicketsArr = tickets.tickets ;
							console.log(fetchedTicketsArr[0]);

							function recursiveViewTickets(currentTicketsUrl) {

								prompts.question('Would you like to view more tickets? (Yes/No) ', (responseYesOrNo) => {
									if (responseYesOrNo.toLocaleLowerCase() == 'yes') {
										console.log('Following are the next tickets');

										fetch(currentTicketsUrl, myTickets.options)
										.then((ticketsData) => ticketsData.json())
										.then((ticketObj)=>{
											console.log(ticketObj.tickets[0])
											if (ticketObj.meta.has_more){
												recursiveViewTickets(ticketObj.links.next);
											}
											else{
												console.log('You have seen all the tickets, following is the menu \n');
												recursiveShowMenu();
											}
										})
										.catch((err)=>console.log(err));
										}
									else if (responseYesOrNo.toLocaleLowerCase() == 'no'){
										recursiveShowMenu();
									}
									});
								}	
								
							if (tickets.meta.has_more){
								recursiveViewTickets(tickets.links.next);
							}
							else {
								console.log('You have seen all the tickets, following is the menu \n');
								recursiveShowMenu();
							}
						
						}	

							
							
							
						

						getTickets();
						// .then(() => process.exit())
						// .catch((err)=> console.log(err));
						
						// at one time only 25 tickets can be shown, press enter then the next 25 tickets
						
					}
					else if (responseNested == '2') {
						// first request the ticket number and check whether that ticket exists
						prompts.question("Please enter the ticket number to view: ", (ticketNumberResponse) => {
							// getTicketUrl(ticketNumberResponse);

							fetch(baseURL + "/api/v2/tickets/" + ticketNumberResponse +".json", getTicket.options)
							.then((res) => {
								if (res.status >= 200 && res.status <= 299) {
									return res.json();
								} else {
									throw Error(res.statusText);
								}
							})
							.then((ticket) => console.log(ticket))
							.catch((err) => {
								let errorMessage = "Ticket: " + err + ". Please enter another number";
								console.log(errorMessage);
							});
						})
						// hit the API to view the details of the ticket 
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




