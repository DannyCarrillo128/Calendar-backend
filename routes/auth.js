const { Router } = require('express');
const { check } = require('express-validator');

const { signIn, signUp, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/field-validators');
const { validateJWT } = require('../middlewares/jwt-validators');

const router = Router();

router.post('/', [
  check('email', 'Please enter a valid email address.').isEmail(),
  check('password', 'Password must have at least 6 characters.').isLength({ min: 6 }),
  validateFields
], signIn);

router.post('/sign-up', [
  check('name', 'Name is a mandatory field.').not().isEmpty(),
  check('email', 'Please enter a valid email address.').isEmail(),
  check('password', 'Password must have at least 6 characters.').isLength({ min: 6 }),
  validateFields
], signUp);

router.get('/renew', validateJWT, renewToken);

module.exports = router;
