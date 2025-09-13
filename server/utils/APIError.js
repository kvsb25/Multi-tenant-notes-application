class APIError extends Error{
	constructor(status, message){
		this.status = status;
		this.message = message;
	}
}

module.exports = APIError;