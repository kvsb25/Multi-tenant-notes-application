const mongoose = require('mongoose');
const Tenant = require('./tenants');

const tenantConnections = {};

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL);
}

function initDb(){

}

function getDbConnection(slug){
    if (tenantConnections[slug]) return tenantConnections[slug];


}