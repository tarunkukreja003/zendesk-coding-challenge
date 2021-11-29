// import the readline module for work with stdin, or stdout.
const readline = require('readline');
const { base64encode, base64decode } = require('nodejs-base64');
const fetch = require('node-fetch');
const credentials = require('dotenv').config();


// create a readline object to work with the stream.
// pass the stdin, or stdout in the current process.

let urlBase = "https://{subdomain}.zendesk.com/";
let username = credentials.parsed.USERNAME;
let password = credentials.parsed.PASSWORD;

let urlGetTickets = new URL(urlBase + "api/v2/tickets.json"),params = {"page[size]":25}

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


let getTicket = {
	url: getTicketUrl,
    options: {
        method: "GET",
        headers: { 
          "Content-Type": "application/json" ,
          'Authorization': 'Basic ' + base64encode(username + ":" + password)
        }
    }
};

function getTicketUrl(ticketNumberStr) {
	let url = urlBase + "/api/v2/tickets/" + ticketNumberStr +".json"
	return url;
}



const prompts = readline.createInterface(process.stdin, process.stdout);


// create a question or there handler.
prompts.question('Type menu to view options and quit to exit : ', (response) => {

	// check the response.
	if(response.toLocaleLowerCase() == 'menu') {
		prompts.question('Menu options: \n * Press 1 to view all tickets \n * Press 2 to view a ticket \n * Press 3 to quit \n', (responseNested) => {
			if (responseNested == '1') {
				// hit the API to view all the tickets


				 
				async function getTickets(){
					// we'll be using pagination APIs then we'll ask whether they would like to view the next 25 or previous 25 and show the tickets accordingly
					let ticketsData = await fetch(myTickets.url, myTickets.options);
					let tickets = await ticketsData.json();
					let fetchedTicketsArr = tickets.tickets ;
					console.log(fetchedTicketsArr[0]);

					// we will run a while loop until user says Yes and there is has_more
					if (tickets.meta.has_more){
						// the following question will go up
						prompts.question('Would you like to view more tickets? (Yes/No) ', (responseYesOrNo) => {
							if (responseYesOrNo.toLocaleLowerCase() == 'yes') {

								fetch(tickets.links.next, myTickets.options)
								.then((ticketsData) => ticketsData.json())
								.then((tickets)=>console.log(tickets.tickets[0]))
								.catch((err)=>console.log(err));
								}
							});
						}	
					
					}	

					
			

				

				getTickets()
				// .then(() => process.exit())
				// .catch((err)=> console.log(err));
				
				// at one time only 25 tickets can be shown, press enter then the next 25 tickets
				// process.exit();
			}
			else if (responseNested == '2') {
				// first request the ticket number and check whether that ticket exists
				prompts.question("Please enter the ticket number to view: ", (ticketNumberResponse) => {
					// getTicketUrl(ticketNumberResponse);

					fetch(urlBase + "/api/v2/tickets/" + ticketNumberResponse +".json", getTicket.options)
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
			else {
				// process.exit();
			}

			// process.exit();
		});
	}
	else if(response.toLocaleLowerCase() == 'quit') {
		console.log("You are a part of the very huge learning community.");
	}
	else {
		console.log("Please type either menu or quit");
	}

	// after the all work is done want to terminate this process.
	// process.exit();
});


