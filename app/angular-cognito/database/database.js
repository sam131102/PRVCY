const mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'prvcy-main-db.cjrkirabesjd.ca-central-1.rds.amazonaws.com',
  user     : 'prvcy-main-db',
  password : 'admin499',
  port     : '13306'
});

// Connect to the MySQL server
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database: ' + error.stack);
    return;
  }
  console.log('Connected to database with ID: ' + connection.threadId);
});