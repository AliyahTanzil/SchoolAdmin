process.env.USE_SQLITE_IN_MEMORY = '1'
const request = require('supertest')
const app = require('../src/index')
const { setupTestDB } = require('./helper')

describe('students API', () => {
  let adminToken

  beforeAll(async () => {
    await setupTestDB()
    await request(app).post('/api/auth/register').send({ username: 'admin', password: 'password', role: 'super_admin' })
    const loginRes = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'password' })
    adminToken = loginRes.body.accessToken
  })

  test('create -> get -> update -> delete student', async () => {
    // create
    const createRes = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Alice' })
    expect(createRes.status).toBe(201)
    expect(createRes.body.name).toBe('Alice')
    const id = createRes.body.id

    // get (public read)
    const getRes = await request(app)
      .get(`/api/students/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(getRes.status).toBe(200)
    expect(getRes.body.name).toBe('Alice')

    // update
    const upd = await request(app)
      .put(`/api/students/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Alice Smith' })
    expect(upd.status).toBe(200)
    expect(upd.body.name).toBe('Alice Smith')

    // delete
    const del = await request(app)
      .delete(`/api/students/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(del.status).toBe(200)
    expect(del.body.id).toBe(id)
  })
})
