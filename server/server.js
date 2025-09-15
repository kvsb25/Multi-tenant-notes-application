require('dotenv').config();
// console.log(process.env);
const express = require('express');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
const app = express();
const healthRouter = require('./routes/health.js');
const notesRouter = require('./routes/notes.js');
const tenantsRouter = require('./routes/tenant.js');
const authRouter = require('./routes/auth.js');
const { userAuth, verifyRole, setTenantDbConnection } = require('./middleware.js');
const {APIError, DBError} = require('./utils');

app.use(cors({
    origin: '*'
}));
// app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`🔍 REQUEST: ${req.method} ${req.path}`);
    next();
});

app.use('/', (req, res)=>{
    return res.status.send("working fine")
})
app.use('/health', healthRouter);
app.use('/auth', authRouter);

app.use(userAuth);
app.use(setTenantDbConnection);

app.use('/tenants',
    verifyRole("admin"),
    tenantsRouter
);

app.use('/notes',
    verifyRole("member"),
    async (req, res, next) => {
        req.model = req.db.model('note');
        next();
    },
    notesRouter
);

app.use('/', (req, res, next)=>{
    const err = new APIError(404, "NOT FOUND");
    next(err);
})

app.use((err, req, res, next) => {

    if (err instanceof APIError) {

        console.error("APIError: ", err.status, ", messge: ", err.message);
        return res.status(err.status).send({ error: err.message });

    } else if (err instanceof DBError) {

        console.error("DBError: model: ", err.model, " message: ", err.message);
    }
    console.error(err);
    return res.status(500).send("Internal server error");
})

// app.listen(process.env.PORT, () => { console.log("listening at ", process.env.PORT) });
module.exports = app;