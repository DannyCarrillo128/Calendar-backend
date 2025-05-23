const { Router } = require('express');
const { check } = require('express-validator');

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validateFields } = require('../middlewares/field-validators');
const { validateJWT } = require('../middlewares/jwt-validators');

const router = Router();

// All requests below will be affected by this middleware.
router.use(validateJWT);

router.get('/', getEvents);

router.post('/', [
  check('title', 'Title is a mandatory field.').not().isEmpty(),
  check('start', 'Start date is not a valid date.').custom(isDate),
  check('end', 'End date is not a valid date.').custom(isDate),
  validateFields
], createEvent);

router.put('/:id', [
  check('title', 'Title is a mandatory field.').not().isEmpty(),
  check('start', 'Start date is not a valid date.').custom(isDate),
  check('end', 'End date is not a valid date.').custom(isDate),
  validateFields
], updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;
