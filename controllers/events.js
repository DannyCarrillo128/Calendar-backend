const { request, response } = require('express');

const Event = require('../models/Event');

// ----------------------------------------------------------------
//                            Get events                           
// ----------------------------------------------------------------
const getEvents = async (req = request, res = response) => {

  const events = await Event.find().populate('user', 'name');

  res.json({
    ok: true,
    events
  });

};

// ----------------------------------------------------------------
//                           Create event                          
// ----------------------------------------------------------------
const createEvent = async (req = request, res = response) => {

  const event = new Event(req.body);

  try {
    event.user = req.uid;
    
    const savedEvent = await event.save();

    res.json({
      ok: true,
      event: savedEvent
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: 'Something went wrong.'
    });
  }

};

// ----------------------------------------------------------------
//                           Update event                          
// ----------------------------------------------------------------
const updateEvent = async (req = request, res = response) => {

  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        message: 'Event not found.'
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized action.'
      });
    }

    const newEvent = { ...req.body, user: uid };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });

    res.json({
      ok: true,
      event: updatedEvent
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: 'Something went wrong.'
    });
  }

};

// ----------------------------------------------------------------
//                           Delete event                          
// ----------------------------------------------------------------
const deleteEvent = async (req = request, res = response) => {

  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        message: 'Event not found.'
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized action.'
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({
      ok: true,
      message: 'Event deleted.'
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: 'Something went wrong.'
    });
  }

};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
