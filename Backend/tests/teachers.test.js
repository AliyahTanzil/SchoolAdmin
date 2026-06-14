process.env.USE_SQLITE_IN_MEMORY = '1'
const request = require('supertest')
const app = require('../src/index')
const { setupTestDB } = require('./helper')

describe('teachers API', () => {
  let adminToken

  beforeAll(async () => {
    await setupTestDB()
    await request(app).post('/api/auth/register').send({ username: 'admin', password: 'password', role: 'super_admin' })
    const loginRes = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'password' })
    adminToken = loginRes.body.accessToken
  })

  test('create -> get -> update -> delete teacher', async () => {
    // create
    const createRes = await request(app)
      .post('/api/teachers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ 
        name: 'John Smith',
        email: 'john@example.com',
        subject: 'Math'
      })
    expect(createRes.status).toBe(201)
    expect(createRes.body.name).toBe('John Smith')
    const id = createRes.body.id

    // get
    const getRes = await request(app)
      .get(`/api/teachers/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(getRes.status).toBe(200)
    expect(getRes.body.name).toBe('John Smith')
    expect(getRes.body.subject).toBe('Math')

    // update
    const upd = await request(app)
      .put(`/api/teachers/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ subject: 'Advanced Math' })
    expect(upd.status).toBe(200)
    expect(upd.body.subject).toBe('Advanced Math')

    // delete
    const del = await request(app)
      .delete(`/api/teachers/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(del.status).toBe(200)
    expect(del.body.id).toBe(id)

    // verify deleted
    const getAfterDel = await request(app)
      .get(`/api/teachers/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(getAfterDel.status).toBe(404)
  })
})
