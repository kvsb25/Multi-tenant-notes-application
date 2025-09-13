const mongoose = require('mongoose');
const Tenant = require('./tenants');
const { DBError } = require('../utils');

const tenantConnections = {};

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_DB_URL);
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

        tenantConnections[slug] = conn;
        return conn;

    } catch (err) {

        if(err instanceof DBError){
            console.error("model: ", err.model," message: ", err.message);
        }
    }

}