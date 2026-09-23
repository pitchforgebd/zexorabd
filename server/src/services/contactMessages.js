const pool = require('../db/pool');

function mapMessage(row) {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function create({ name, company, email, phone, subject, message }) {
  const [result] = await pool.query(
    `INSERT INTO contact_messages (name, company, email, phone, subject, message, status)
     VALUES (:name, :company, :email, :phone, :subject, :message, 'unread')`,
    { name, company: company || null, email, phone: phone || null, subject: subject || null, message }
  );
  return result.insertId;
}

async function listAll() {
  const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC');
  return rows.map(mapMessage);
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM contact_messages WHERE id = :id LIMIT 1', { id });
  return rows[0] ? mapMessage(rows[0]) : null;
}

async function updateStatus(id, status) {
  await pool.query('UPDATE contact_messages SET status = :status WHERE id = :id', { id, status });
}

async function remove(id) {
  await pool.query('DELETE FROM contact_messages WHERE id = :id', { id });
}

module.exports = { create, listAll, getById, updateStatus, remove };
