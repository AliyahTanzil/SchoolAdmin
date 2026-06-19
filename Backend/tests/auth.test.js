process.env.USE_SQLITE_IN_MEMORY = '1'
const request = require('supertest')
const app = require('../src/index')

describe('Auth API', () => {
  const adminUser = { username: 'admin', password: 'password123', role: 'admin' }
  const teacherUser = { username: 'teacher', password: 'password123', role: 'teacher' }

  test('register -> login', async () => {
    // register admin
    const regRes = await request(app).post('/api/auth/register').send(adminUser)
    expect(regRes.status).toBe(201)
    expect(regRes.body.username).toBe(adminUser.username)

    // login admin
    const loginRes = await request(app).post('/api/auth/login').send({
      username: adminUser.username,
      password: adminUser.password
    })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body.token).toBeDefined()
    expect(loginRes.body.user.role).toBe('admin')

    const adminToken = loginRes.body.token

    // register teacher
    await request(app).post('/api/auth/register').send(teacherUser)
    const tLoginRes = await request(app).post('/api/auth/login').send({
      username: teacherUser.username,
      password: teacherUser.password
    })
    const teacherToken = tLoginRes.body.token

    // Test RBAC: Admin can create student
    const sRes = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Secure Student' })
    expect(sRes.status).toBe(201)

    // Test RBAC: Teacher cannot create student
    const sResFail = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Hacker Student' })
    expect(sResFail.status).toBe(403)

    // Test Auth: No token cannot create student
    const sResFail2 = await request(app)
      .post('/api/students')
      .send({ name: 'Ghost Student' })
    expect(sResFail2.status).toBe(401)
  }, 20000)

  test('validation errors', async () => {
    // short username
    const res1 = await request(app).post('/api/auth/register').send({ username: 'ab', password: 'password123' })
    expect(res1.status).toBe(400)
    expect(res1.body.error).toContain('Username')

    // short password
    const res2 = await request(app).post('/api/auth/register').send({ username: 'validuser', password: '123' })
    expect(res2.status).toBe(400)
    expect(res2.body.error).toContain('Password')

    // missing login fields
    const res3 = await request(app).post('/api/auth/login').send({ username: 'admin' })
    expect(res3.status).toBe(401) // Routes map login errors to 401
  })
})
