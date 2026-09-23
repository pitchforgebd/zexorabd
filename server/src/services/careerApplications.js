const pool = require('../db/pool');

function mapApplication(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    position: row.position,
    education: row.education,
    experienceYears: row.experience_years,
    coverLetter: row.cover_letter,
    message: row.message,
    cvFilePath: row.cv_file_path,
    consent: !!row.consent,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function create({ fullName, email, phone, position, education, experienceYears, coverLetter, message, cvFilePath, consent }) {
  const [result] = await pool.query(
    `INSERT INTO career_applications
       (full_name, email, phone, position, education, experience_years, cover_letter, message, cv_file_path, consent, status)
     VALUES
       (:fullName, :email, :phone, :position, :education, :experienceYears, :coverLetter, :message, :cvFilePath, :consent, 'new')`,
    {
      fullName,
      email,
      phone,
      position: position || null,
      education: education || null,
      experienceYears: experienceYears ?? null,
      coverLetter: coverLetter || null,
      message: message || null,
      cvFilePath,
      consent: consent ? 1 : 0,
    }
  );
  return result.insertId;
}

async function listAll() {
  const [rows] = await pool.query('SELECT * FROM career_applications ORDER BY created_at DESC, id DESC');
  return rows.map(mapApplication);
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM career_applications WHERE id = :id LIMIT 1', { id });
  return rows[0] ? mapApplication(rows[0]) : null;
}

async function updateStatus(id, status) {
  await pool.query('UPDATE career_applications SET status = :status WHERE id = :id', { id, status });
}

async function remove(id) {
  await pool.query('DELETE FROM career_applications WHERE id = :id', { id });
}

module.exports = { create, listAll, getById, updateStatus, remove };
