process.env.USE_SQLITE_IN_MEMORY = '1'
const request = require('supertest')
const app = require('../src/index')
const { markPresent, getAttendance } = require('../src/controllers/attendance');
const { createStudent } = require('../src/controllers/students');

describe('attendance controller', () => {
  let studentId;

  beforeAll(() => {
    const s = createStudent({ name: 'Test Student' });
    studentId = s.id;
  });

  test('markPresent sets presence and getAttendance returns true', () => {
    const r = markPresent(studentId);
    expect(r.studentId).toBe(studentId);
    const g = getAttendance(studentId);
    expect(g.present).toBe(true);
  });

  test('missing studentId throws', () => {
    expect(() => markPresent()).toThrow('studentId required');
    expect(() => getAttendance()).toThrow('studentId required');
  });
});
