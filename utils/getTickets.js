const fetch = require('node-fetch');
const STATUS_CODES = require('../constants/statusCodes');

async function getTickets(ticketUrl, options){
    let response;
    try{
        response = await fetch(ticketUrl, options);
        if (response.status == STATUS_CODES.STATUS_CODES.OK){
	        return response;
        }else{
            throw new Error(response.status);
        }
    }catch(error){
        return response.status;
    }
	
};

async function getATicket(ticketUrl, options){
    let response;
    try{
        response = await fetch(ticketUrl, options);
        if (response.status == STATUS_CODES.STATUS_CODES.OK){
	        return response;
        }else{
            throw new Error(response.status);
        }
    }catch(error){
        return response.status;
    }
	
};





module.exports  = {
    getTickets: getTickets,
    getATicket: getATicket

}