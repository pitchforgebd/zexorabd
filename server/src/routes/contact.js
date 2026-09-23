const { Router } = require('express');
const { body } = require('express-validator');
const contactService = require('../services/contactMessages');
const { created } = require('../utils/response');
const validate = require('../middleware/validate');
const { formSubmitLimiter } = require('../middleware/rateLimiters');
const { sendMail } = require('../services/mail');

const router = Router();

router.post(
  '/',
  formSubmitLimiter,
  validate([
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('message').isString().trim().notEmpty().withMessage('Message is required'),
  ]),
  async (req, res, next) => {
    try {
      const { name, company, email, phone, subject, message } = req.body;
      const id = await contactService.create({ name, company, email, phone, subject, message });

      await sendMail({
        subject: `New Contact Message: ${subject || 'General Inquiry'}`,
        text: `Name: ${name}\nCompany: ${company || '-'}\nEmail: ${email}\nPhone: ${phone || '-'}\n\nMessage:\n${message}`,
      });

      return created(res, { id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
