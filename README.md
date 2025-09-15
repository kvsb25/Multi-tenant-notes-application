# Multi-Tenant SaaS Notes Application

This project is a multi-tenant SaaS Notes application that supports multiple companies (tenants). Each tenant can securely manage their users and notes, with strict isolation between tenants. The application enforces role-based access and subscription limits.

---

## Environment Variables

The following environment variables must be configured for the backend to work properly:

- **MONGO_DB_URL**  
  The MongoDB connection string used by the application to connect to the database(s).  
  Example:  MONGO_DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net

- **ACCESS_TOKEN_SECRET**  
The secret key used for signing and verifying JWT access tokens.  
Example:  ACCESS_TOKEN_SECRET=your_secret_key

---

## Multi-Tenancy Approach

I have gone with the **Database-per-tenant** approach, as it has provided stricter data isolation compared to the schema-per-tenant strategy.  
The schema-per-tenant approach will create a bottleneck and a single point of failure for other tenants, but that will not be the case with the database-per-tenant model. In schema-per-tenant, one tenant’s corrupted data might fail the database and cause all tenants to suffer; hence, it may result in single point of failure.  

Therefore, the **Database-per-tenant architecture has been a better option**. Considering we have only two tenants for testing purposes, it has also been easier to manage a very small number of databases right now.