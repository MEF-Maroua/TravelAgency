const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TravelAgency'
});

db.connect((err) => {
  if (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
  db.query('DESCRIBE tours', (err, results) => {
    if (err) {
      console.error('Query failed:', err);
    } else {
      console.log('Tours table structure:');
      console.table(results);
    }
    process.exit();
  });
});
