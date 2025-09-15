const mongoose = require('mongoose');
const Tenant = require('./tenants.js');
const noteSchema = require('./notes.js');
// const Notes = require('./notes.js');
const userSchema = require('./users.js');
// const Users = require('./users.js');
const { DBError } = require('../utils');

const tenantConnections = {};

// main().catch(err => console.log(err));
// async function main() {
//     await mongoose.connect(process.env.MONGO_DB_URL);
//     console.log('db connected');
// }

let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
        serverSelectionTimeoutMS: 5000,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
    return conn;
}

async function getTenantDbConnection(slug) {
    try {
        // console.log("tenantConnections: ", tenantConnections[slug].name);

        if (tenantConnections[slug]) return tenantConnections[slug];

        const tenant = await Tenant.findOne({ slug });
        if (!tenant) throw new DBError("tenant", "tenant not found");
        console.log("tenant from DB: ", tenant);

        const conn = await mongoose.createConnection(tenant.dbUri).asPromise();

        conn.model('user', userSchema);
        conn.model('note', noteSchema);

        console.log("in index.js db", conn.name, "\n", "in index.js db db models", Object.keys(conn.models));

        tenantConnections[slug] = conn;
        return conn;

    } catch (err) {

        throw err;
    }

}

module.exports = {
    Tenant,
    getTenantDbConnection,
    connectToDatabase
}