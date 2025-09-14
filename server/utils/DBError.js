class DBError extends Error{
	constructor(model, message){
        super();
        this.model = model;
        this.message = message;
    }
}

module.exports = DBError;