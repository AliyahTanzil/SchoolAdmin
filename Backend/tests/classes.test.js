process.env.USE_SQLITE_IN_MEMORY = '1'
const request = require('supertest')
const app = require('../src/index')
const { setupTestDB } = require('./helper')

describe('classes and enrollments API', () => {
  let teacherId, studentId, classId, adminToken, teacherToken

  beforeAll(async () => {
    jest.setTimeout(30000)
    await setupTestDB()
    // Setup Auth
    await request(app).post('/api/auth/register').send({ username: 'admin', password: 'password', role: 'super_admin' })
    const aLoginRes = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'password' })
    adminToken = aLoginRes.body.accessToken

    await request(app).post('/api/auth/register').send({ username: 'teacher1', password: 'password', role: 'teacher' })
    const tLoginRes = await request(app).post('/api/auth/login').send({ username: 'teacher1', password: 'password' })
    teacherToken = tLoginRes.body.accessToken

    // Setup: Create a teacher and a student
    const tRes = await request(app)
      .post('/api/teachers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Teacher 1' })
    teacherId = tRes.body.id
    
    const sRes = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Student 1' })
    studentId = sRes.body.id
  })

  test('create -> get -> update -> delete class', async () => {
    // create
    const createRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ 
        name: 'History 101',
        teacherId: teacherId
      })
    expect(createRes.status).toBe(201)
    expect(createRes.body.name).toBe('History 101')
    classId = createRes.body.id

    // get
    const getRes = await request(app)
      .get(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(getRes.status).toBe(200)
    expect(getRes.body.name).toBe('History 101')

    // update
    const upd = await request(app)
      .put(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Modern History' })
    expect(upd.status).toBe(200)
    expect(upd.body.name).toBe('Modern History')

    // delete
    const del = await request(app)
      .delete(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(del.status).toBe(200)
    expect(del.body.id).toBe(classId)
  })

  test('enrollment flow', async () => {
    // create class
    const cRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Math 101' })
    const cid = cRes.body.id

    // enroll
    const enrollRes = await request(app)
      .post(`/api/classes/${cid}/enroll`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ studentId })
    expect(enrollRes.status).toBe(200)

    // list students in class
    const listRes = await request(app)
      .get(`/api/classes/${cid}/students`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(listRes.status).toBe(200)
    expect(listRes.body.length).toBe(1)
    expect(listRes.body[0].id).toBe(studentId)

    // unenroll
    const unenrollRes = await request(app)
      .delete(`/api/classes/${cid}/enroll/${studentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(unenrollRes.status).toBe(200)

    // verify empty
    const listAfterRes = await request(app)
      .get(`/api/classes/${cid}/students`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(listAfterRes.body.length).toBe(0)
  })

  test('class-aware attendance', async () => {
    const cRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Science' })
    const cid = cRes.body.id

    // mark present in science class
    const attRes = await request(app)
      .post(`/api/attendance/${studentId}/present`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ classId: cid })
    expect(attRes.status).toBe(200)
    expect(attRes.body.classId).toEqual(cid)

    // get attendance for science
    const getAtt = await request(app)
      .get(`/api/attendance/${studentId}?classId=${cid}`)
      .set('Authorization', `Bearer ${teacherToken}`)
    expect(getAtt.status).toBe(200)
    expect(getAtt.body.present).toBe(true)

    // get attendance for another class (should be false)
    const getOtherAtt = await request(app)
      .get(`/api/attendance/${studentId}?classId=999`)
      .set('Authorization', `Bearer ${teacherToken}`)
    expect(getOtherAtt.status).toBe(200)
    expect(getOtherAtt.body.present).toBe(false)
  })
})
