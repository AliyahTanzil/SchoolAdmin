const attendance = new Map();

function markPresent(studentId) {
  if (!studentId) throw new Error('studentId required');
  const today = new Date().toISOString().slice(0, 10);
  const key = `${studentId}:${today}`;
  attendance.set(key, true);
  return { studentId, today, present: true };
}

function getAttendance(studentId) {
  if (!studentId) throw new Error('studentId required');
  const today = new Date().toISOString().slice(0, 10);
  const key = `${studentId}:${today}`;
  return { studentId, today, present: !!attendance.get(key) };
}

module.exports = { markPresent, getAttendance };
