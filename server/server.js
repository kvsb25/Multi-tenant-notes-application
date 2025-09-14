require('dotenv').config()
// console.log(process.env);
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const healthRouter = require('./routes/health.js');
const notesRouter = require('./routes/notes.js');
const tenantsRouter = require('./routes/tenant.js');
const authRouter = require('./routes/auth.js');
const { userAuth, verifyRole } = require('./middleware.js');
const APIError = require('./utils/APIError.js');

app.use(cors({
    origin: '*'
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userAuth);

app.use('/', authRouter);
app.use('/tenants', verifyRole("admin"), tenantsRouter);
app.use('/notes', verifyRole("member"), notesRouter);
app.use('/health', healthRouter);

app.use((err, req, res, next) => {

    if (err instanceof APIError) {

        console.error("APIError: ", err.status, ", messge: ", err.message);
        return res.status(err.status).send({ error: err.message });

    } else if (err instanceof DBError) {

        console.error("DBError: model: ", err.model, " message: ", err.message);
    }

    return res.status(500).send("Internal server error");
})

app.listen(process.env.PORT, () => { console.log("listening at ", process.env.PORT) });