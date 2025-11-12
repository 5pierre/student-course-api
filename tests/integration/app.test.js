const request = require('supertest');
const app = require('../../src/app');

describe('Student-Course API integration', () => {
  beforeEach(() => {
    require('../../src/services/storage').reset();
    require('../../src/services/storage').seed();
  });

  test('GET /students should return seeded students', async () => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(res.body.students.length).toBe(3);
    expect(res.body.students[0].name).toBe('Alice');
  });

  test('POST /students should create a new student', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'David', email: 'david@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('David');
  });

  test('POST /students shouldnt not allow duplicate email', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'Eve', email: 'alice@example.com' });
    expect(res.statusCode).toBe(400);
  });

  test('DELETE /courses/:id shouldnt delete a course if students are enrolled', async () => {
    const courses = await request(app).get('/courses');
    const courseId = courses.body.courses[0].id;
    await request(app).post(`/courses/${courseId}/students/1`);
    const res = await request(app).delete(`/courses/${courseId}`);
    expect(res.statusCode).toBe(400);
  });
});

test('GET /students/:id should return a student', async () => {
  const res = await request(app).get('/students/1');
  expect(res.statusCode).toBe(200);
  expect(res.body.student.name).toBe('Alice');
});

test('GET /students/:id should return 404 if student not found', async () => {
  const res = await request(app).get('/students/999');
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Student not found');
});

test('PUT /students/:id should update a student', async () => {
  const res = await request(app)
    .put('/students/1')
    .send({ name: 'Alice Smith', email: 'alice.smith@example.com' });
  expect(res.statusCode).toBe(200);
  expect(res.body.name).toBe('Alice Smith');
});

test('PUT /students/:id should return 404 if student not found', async () => {
  const res = await request(app)
    .put('/students/999')
    .send({ name: 'Unknown', email: 'unknown@example.com' });
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Student not found');
});

test('DELETE /students/:id should return 404 if student not found', async () => {
  const res = await request(app).delete('/students/999');
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Student not found');
});
