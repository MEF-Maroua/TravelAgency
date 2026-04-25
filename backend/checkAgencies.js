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
  db.query('SELECT * FROM agencies', (err, results) => {
    if (err) {
      console.error('Query failed:', err);
    } else {
      console.log('Agencies in DB:', results.length);
      console.log(JSON.stringify(results, null, 2));
    }
    process.exit();
  });
});
