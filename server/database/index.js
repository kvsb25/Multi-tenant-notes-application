const mongoose = require('mongoose');
const Tenant = require('./tenants.js');
const noteSchema = require('./notes.js');
// const Notes = require('./notes.js');
const userSchema = require('./users.js');
// const Users = require('./users.js');
const { DBError } = require('../utils');

const tenantConnections = {};

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('db connected');
}

async function getTenantDbConnection(slug) {
    try {

        if (tenantConnections[slug]) return tenantConnections[slug];

        const tenant = await Tenant.find({ slug });
        if (!tenant) throw new DBError("tenant", "tenant not found");

        const conn = mongoose.createConnection(tenant.dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        conn.model('user', userSchema);
        conn.model('note', noteSchema);

        tenantConnections[slug] = conn;
        return conn;

    } catch (err) {
        
        throw err;
    }

}

module.exports = {
    Tenant,
    getTenantDbConnection
}