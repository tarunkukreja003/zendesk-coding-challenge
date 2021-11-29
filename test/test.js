const fetch = require('node-fetch');
var chai = require('chai');  
const { base64encode, base64decode } = require('nodejs-base64');
var assert = chai.assert;   
var expect = chai.expect; 
const CREDENTIALS = require('dotenv').config(); 
const URLS = require('../constants/urls');
const STATUS_CODES = require('../constants/statusCodes');
let getTickets = require('../utils/getTickets');





const baseURL = URLS.URLS.BASE_URL;
const getTicketsOnAPageUrl = URLS.URLS.GET_TICKETS_ON_A_PAGE;
const username = CREDENTIALS.parsed.USERNAME;
const password = CREDENTIALS.parsed.PASSWORD;


let testAuthentication = {
    url: getTicketsOnAPageUrl,
    options: {
        method: 'GET',
        headers: {
			"Content-Type": "application/json",
			'Authorization': 'Basic ' + base64encode(username + ":" + password + "123")
        }
    }
}

let fetchAllAccountTickets = {
    url: getTicketsOnAPageUrl,
    options: {
        method: 'GET',
        headers: {
			"Content-Type": "application/json" ,
			'Authorization': 'Basic ' + base64encode(username + ":" + password)
        }
    }
};

let fetchAllAccountTicketsWrongUrl = {
    url: baseURL + '/tickeets',
    options: {
        method: 'GET',
        headers: {
			"Content-Type": "application/json" ,
			'Authorization': 'Basic ' + base64encode(username + ":" + password)
        }
    }
};

let fetchATicket = {
    url: baseURL + "/api/v2/tickets/1.json",
    options: {
        method: 'GET',
        headers: {
			"Content-Type": "application/json" ,
			'Authorization': 'Basic ' + base64encode(username + ":" + password)
        }
    }

};

let fetchInvalidTicket = {
    url: baseURL + "/api/v2/tickets/109.json",
    options: {
        method: 'GET',
        headers: {
			"Content-Type": "application/json" ,
			'Authorization': 'Basic ' + base64encode(username + ":" + password)
        }
    }

};




describe('Connect to Zendesk API', function(){
    /*

    First, one should not be authorized to view any tickets with wrong credentials

    */

    it('Error authenticating the agent/admin', async function(){
        let response = await fetch(testAuthentication.url, testAuthentication.options);
        assert.equal(STATUS_CODES.STATUS_CODES.UNAUTHORIZED, response.status);
    })

    
    /*

    Check if we are successfully able to connect with the Zendesk API

    */

    describe('Fetch all the tickets from the Zendesk account after being authenticated', function(){

            /*

            Once authenticated check if we can get all the tickets

            */

        it('Successfully fetched the tickets from to the Zendesk Ticket API', async function(){
            let responsegetTickets =  await getTickets.getTickets(fetchAllAccountTickets.url, fetchAllAccountTickets.options);
            assert.equal(STATUS_CODES.STATUS_CODES.OK, responsegetTickets.status);
        })
            /*

            Put an invalid URL and that should return 404

            */

        it('Failed fetching the tickets from the invalid Zendesk Ticket API', async function(){
            let responsegetTickets =  await getTickets.getTickets(fetchAllAccountTicketsWrongUrl.url, fetchAllAccountTicketsWrongUrl.options);
            
            assert.equal(STATUS_CODES.STATUS_CODES.NOT_FOUND, responsegetTickets);
        })
        

    })

    describe('Fetch a specific ticket from the Zendesk account after being authenticated', function(){
            /*

            Once authenticated check if we can get a specific ticket by providing the ticket number

            */

        it('Successfully fetched the ticket from to the Zendesk Ticket API', async function(){
            let responsegetTicket =  await getTickets.getATicket(fetchATicket.url, fetchATicket.options);
            assert.equal(STATUS_CODES.STATUS_CODES.OK, responsegetTicket.status);
        })

            /*

                Enter an invalid ticket number and that should return 404

            */

        it('Failed fetching the invalid ticket from the Zendesk Ticket API', async function(){
            let responsegetTicket =  await getTickets.getATicket(fetchInvalidTicket.url, fetchInvalidTicket.options);
            assert.equal(STATUS_CODES.STATUS_CODES.NOT_FOUND, responsegetTicket);
        })

    })




})

