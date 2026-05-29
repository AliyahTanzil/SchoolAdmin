const { markPresent, getAttendance } = require('../src/controllers/attendance');

describe('attendance controller', () => {
  test('markPresent sets presence and getAttendance returns true', () => {
    const id = 'student1';
    const r = markPresent(id);
    expect(r.studentId).toBe(id);
    const g = getAttendance(id);
    expect(g.present).toBe(true);
  });

  test('missing studentId throws', () => {
    expect(() => markPresent()).toThrow('studentId required');
    expect(() => getAttendance()).toThrow('studentId required');
  });
});
