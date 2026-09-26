const { Router } = require('express');
const careerService = require('../services/careerApplications');
const { created, fail, ApiError } = require('../utils/response');
const { createDocumentUpload, publicPathFor } = require('../middleware/documentUpload');
const { formSubmitLimiter } = require('../middleware/rateLimiters');
const { sendMail } = require('../services/mail');
const { renderNotificationEmail } = require('../services/emailTemplates');
const config = require('../config');

const router = Router();
const cvUpload = createDocumentUpload('cv');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', formSubmitLimiter, (req, res, next) => {
  cvUpload.single('cv')(req, res, async (err) => {
    if (err) return next(new ApiError(err.message, 400, 'UPLOAD_ERROR'));
    if (!req.file) return fail(res, 'Please upload your CV', 400, 'BAD_REQUEST');

    const { fullName, email, phone, position, education, experience, coverLetter, message, consent } = req.body;
    if (!fullName || !fullName.trim()) return fail(res, 'Full name is required', 422, 'VALIDATION_ERROR');
    if (!email || !EMAIL_RE.test(email)) return fail(res, 'A valid email is required', 422, 'VALIDATION_ERROR');
    if (!phone || !phone.trim()) return fail(res, 'Phone number is required', 422, 'VALIDATION_ERROR');

    try {
      const cvFilePath = publicPathFor('cv', req.file.filename);
      const id = await careerService.create({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position: position || null,
        education: education || null,
        experienceYears: experience ? Number(experience) : null,
        coverLetter: coverLetter || null,
        message: message || null,
        cvFilePath,
        consent: consent === 'true' || consent === true,
      });

      const html = await renderNotificationEmail({
        heading: 'New Job Application',
        intro: `${fullName} — ${position || 'General application'}`,
        rows: [
          { label: 'Name', value: fullName },
          { label: 'Email', value: email },
          { label: 'Phone', value: phone },
          { label: 'Position', value: position },
          { label: 'Education', value: education },
          { label: 'Experience', value: experience ? `${experience} years` : null },
          { label: 'Cover Letter', value: coverLetter, multiline: true },
          { label: 'Message', value: message, multiline: true },
          { label: 'CV / Resume', value: 'Download attached CV', href: `${config.siteUrl}${cvFilePath}` },
        ],
        cta: { label: 'View in Admin Panel', url: `${config.siteUrl}/admin/career-applications` },
      });
      await sendMail({
        subject: `New Job Application: ${fullName} (${position || 'General'})`,
        text: [
          `Name: ${fullName}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          `Position: ${position || '-'}`,
          `Education: ${education || '-'}`,
          `Experience: ${experience || '-'} years`,
          '',
          `Cover Letter:\n${coverLetter || '-'}`,
          '',
          `Message:\n${message || '-'}`,
          '',
          `CV: ${config.siteUrl}${cvFilePath}`,
        ].join('\n'),
        html,
      });

      return created(res, { id });
    } catch (dbErr) {
      return next(dbErr);
    }
  });
});

module.exports = router;
