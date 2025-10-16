# 🚀 Project README

## 📦 Development Environment

This project runs entirely in **Docker**.  
No local installation of Node.js, PostgreSQL, is required.

---

## 🧰 Requirements

Before starting, make sure you have installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

---

# SMTP for mailing

SMTP_USER=
SMTP_PASS=

# Run the Application

docker compose -f docker-compose-dev.yaml build
docker compose -f docker-compose-dev.yaml up

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
