class DBError extends Error{
	constructor(model, message){
        this.model = model;
        this.message = message;
    }
}

module.exports = DBError;