# simple-dbms-project

# Steps to run

# 1 Install Node 
# 2 Install PostgrSQL

# 3 Clone the project and open in VS Code
Then in terminal execute command "npm install"

Once done execute command "node app.js"

Now you can use below URLs to CRAETE, GET, UPDATE or DELETE customers

GET customers:   http://localhost:3000/customers

POST customers:   http://localhost:3000/customers 
Body Json : 

{
  "name": "USername",
  "email": "email@mail.com"
}

UPDATE customers:   http://localhost:3000/customers 
Body Json : 

{
  "name": "USername",
  "email": "email@mail.com"
}

DELETE customers:   http://localhost:3000/customers/{id} 
