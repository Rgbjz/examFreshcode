# Project README

## Development Environment

### Running the Application Without Docker

To run the project without Docker, make sure you have Node.js, npm, MongoDB, and PostgreSQL installed locally. Use the `.env` and database configurations below to connect the application correctly.

**Note:** Docker is not working on my system, so the project was run locally using Node.js, npm, MongoDB, and PostgreSQL.
---

## Environment / Configuration

### Server `.env` file
```env

you must specify your data for: SMTP_USER, SMTP_PASSWORD

PORT=5000
SMTP_USER=
SMTP_PASS=

PostgreSQL configuration
{
  "development": {
    "username": "postgres",
    "password": "qwertyplayer19",
    "database": "todo-dev",
    "host": "localhost",
    "dialect": "postgres",
    "operatorsAliases": "Op",
    "seederStorage": "sequelize"
  },
  "test": {
    "username": "postgres",
    "password": "admin",
    "database": "squad-help-test",
    "host": "localhost",
    "dialect": "postgres",
    "operatorsAliases": "Op",
    "seederStorage": "sequelize"
  },
  "production": {
    "username": "postgres",
    "password": "admin",
    "database": "squad-help-prod",
    "host": "localhost",
    "dialect": "postgres",
    "operatorsAliases": "Op",
    "seederStorage": "sequelize"
  }
}

Start the server and client:

# Server
npm run dev

# Client
npm start

The application will be available at http://localhost:3000.

LAYOUT

the how-it-works page was created, the link from the user menu CONTESTS/How it Works leads to it

Added dynamic branding

added a link to "Event" to the "Event" page in the user menu

added a link to "ButtonGroup" to the "Button Group" page in the user menu

DB NO-SQL

Added db-no-sql directory to server/

It contains a query.mongodb query to count the number of records containing the word "locomotive" in the Messages collection.

DB SQL

Added db-sql directory to server/

Task Display the number of users by roles {admin: 40, customer: 22, ...} File: countOfUsers.sql

All users with the customer role who made orders during the New Year holidays from December 25 to January 14 must receive 10% cashback from all orders during this period. File: customerCashback.sql

For the creative role, you need to pay 3 users with the highest rating $ 10 to their accounts. File: payoutWithMaxRating.sql

developed a scheme for chat migration from NO-SQL to SQL, screenshot Screenshot_UML.png

NODEJS

Created error logger server/utils/

errorLogFunction

Created a schedule to copy and clear the contents of the error.log file, and move the data to a new file

errorLogSchedule

FULLSTACK

added new role Moderator

Added distribution of the moderator's decision to Creative's mail

MIGRATE CHAT FROM MONGO TO POSTGRES

described Sequelize models and migrations

changed the logic of requests on the server
