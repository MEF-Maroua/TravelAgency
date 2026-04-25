const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '',
  database: 'TravelAgency'
});

const tables = ['users', 'bookings', 'reviews', 'tours', 'agencies', 'newsletter'];

db.connect(async (err) => {
  if (err) return;
  for (let table of tables) {
    try {
      const [rows] = await db.promise().query(`SHOW CREATE TABLE ${table}`);
      console.log(rows[0]['Create Table']);
    } catch (e) {}
  }
  process.exit();
});
