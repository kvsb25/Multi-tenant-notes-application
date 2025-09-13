require('dotenv').config()
console.log(process.env);
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const healthRoute = require('./routes/health.js');
const notesRouter = require('./routes/notes.js');
const tenantsRouter = require('./routes/tenants.js');
const {userAuth} = require('./middleware.js');

app.use(cors({
    origin: '*'
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userAuth);

app.use('/tenants', tenantsRouter);
app.use('/notes', tenantsRouter);
app.use('/health', tenantsRouter);

app.listen(process.env.PORT, ()=>{console.log("listening at ", process.env.PORT)});