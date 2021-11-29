const fetch = require('node-fetch');
var chai = require('chai');  
const { base64encode, base64decode } = require('nodejs-base64');
var assert = chai.assert;   
var expect = chai.expect; 
const CREDENTIALS = require('dotenv').config(); 
const URLS = require('../constants/urls');
const STATUS_CODES = require('../constants/statusCodes');
let getTickets = require('../utils/getTickets');




/*
Tests

1) Check if we are successfully able to connect with the Zendesk API
2) Check for API unavailable

*/
const baseURL = URLS.URLS.BASE_URL;
const getTicketsOnAPageUrl = URLS.URLS.GET_TICKETS_ON_A_PAGE;
const username = CREDENTIALS.parsed.USERNAME;
const password = CREDENTIALS.parsed.PASSWORD;


let testAuthentication = {
    url: getTicketsOnAPageUrl,
    options: {
        method: 'GET',
        headers: {
			"Content-Type": "application/json"
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


describe('Connect to Zendesk API', function(){
    it('Error authenticating the agent/admin', async function(){
        let response = await fetch(testAuthentication.url, testAuthentication.options);
        assert.equal(STATUS_CODES.STATUS_CODES.UNAUTHORIZED, response.status);
    })

    


    describe('Fetch all the tickets from the Zendesk account after being authenticated', function(){


        it('Successfully fetched the tickets from to the Zendesk Ticket API', async function(){
            let responsegetTickets =  await getTickets.getTickets(fetchAllAccountTickets.url, fetchAllAccountTickets.options);
            assert.equal(STATUS_CODES.STATUS_CODES.OK, responsegetTickets.status);
        })

    })


})

