import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new Database(dbPath);

const newUsername = process.argv[2] || 'admin';
const newPassword = process.argv[3] || 'admin123';
const newEmail = process.argv[4] || `${newUsername}@crediblelight.in`;

console.log('--------------------------------------------------');
console.log('Credible Light - Admin Credentials Reset Utility');
console.log('--------------------------------------------------');
console.log(`Target Username : ${newUsername}`);
console.log(`Target Password : ${newPassword}`);
console.log(`Target Email    : ${newEmail}`);
console.log('--------------------------------------------------');

try {
  const hash = bcrypt.hashSync(newPassword, 10);

  // Check if admin user exists
  const existing = db.prepare('SELECT id, username FROM admin_users LIMIT 1').get();

  if (existing) {
    db.prepare(`
      UPDATE admin_users
      SET username = ?, email = ?, password_hash = ?
      WHERE id = ?
    `).run(newUsername, newEmail, hash, existing.id);
    console.log(`SUCCESS: Admin account (ID: ${existing.id}) updated to:`);
  } else {
    db.prepare(`
      INSERT INTO admin_users (username, email, password_hash, role)
      VALUES (?, ?, ?, 'superadmin')
    `).run(newUsername, newEmail, hash);
    console.log('SUCCESS: Created new Admin account:');
  }

  console.log(`Username : ${newUsername}`);
  console.log(`Password : ${newPassword}`);
  console.log(`Email    : ${newEmail}`);
  console.log('--------------------------------------------------');
  console.log('You can now log in to the admin panel with these credentials!');
  console.log('Tip: You can also edit database.sqlite directly, or change credentials from the Admin Panel Settings tab.');
} catch (error) {
  console.error('ERROR resetting admin credentials:', error.message);
  process.exit(1);
}
