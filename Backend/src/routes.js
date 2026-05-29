const router = require('express').Router();
const ctrl = require('./controllers/attendance');

router.post('/attendance/:id/present', (req, res) => {
  try {
    const result = ctrl.markPresent(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/attendance/:id', (req, res) => {
  try {
    const result = ctrl.getAttendance(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
