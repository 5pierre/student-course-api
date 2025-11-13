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
// update
  test('POST /students shouldnt not allow duplicate email', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'Eve', email: 'alice@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email must be unique');
  });

  test('DELETE /courses/:id shouldnt delete a course if students are enrolled', async () => {
    const courses = await request(app).get('/courses');
    const courseId = courses.body.courses[0].id;
    await request(app).post(`/courses/${courseId}/students/1`);
    const res = await request(app).delete(`/courses/${courseId}`);
    expect(res.statusCode).toBe(400);
  });
  // new test
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

  // new test
  test('POST /courses should return 400 if missing title or teacher', async () => {
      const res = await request(app).post('/courses').send({ title: 'Biology' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('title and teacher required');
    });

    test('PUT /courses/:id should update course information', async () => {
      const courses = await request(app).get('/courses');
      const courseId = courses.body.courses[0].id;
      const res = await request(app).put(`/courses/${courseId}`).send({ teacher: 'Dr. New' });
      expect(res.statusCode).toBe(200);
      expect(res.body.teacher).toBe('Dr. New');
    });

    test('PUT /courses/:id should return 404 if course not found', async () => {
      const res = await request(app).put('/courses/999').send({ title: 'Nonexistent' });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Course not found');
    });

    test('DELETE /courses/:id should return 404 if course not found', async () => {
      const res = await request(app).delete('/courses/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Course not found');
    });

    test('DELETE /courses/:id should return 400 if students are enrolled', async () => {
      const courses = await request(app).get('/courses');
      const students = await request(app).get('/students');
      const courseId = courses.body.courses[0].id;
      const studentId = students.body.students[0].id;

      await request(app).post(`/courses/${courseId}/students/${studentId}`);
      const res = await request(app).delete(`/courses/${courseId}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Cannot delete course: students are enrolled');
    });


  test('PUT /courses/:id should not allow duplicate course title', async () => {
    const courses = await request(app).get('/courses');
    // const course1Id = courses.body.courses[0].id;
    const course2Id = courses.body.courses[1].id;

    const res = await request(app)
      .put(`/courses/${course2Id}`)
      .send({ title: 'Math' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Course title must be unique');
  });
  
  test('GET /courses/:id should return a course with its students', async () => {
    const res = await request(app).get('/courses/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.course).toBeDefined();
    expect(res.body.course.id).toBe(1);
    expect(Array.isArray(res.body.students)).toBe(true);
  });

  test('GET /courses/:id should return 404 if course not found', async () => {
    const res = await request(app).get('/courses/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Course not found');
  });

  //pour courses.js 
  test('DELETE /courses/:courseId/students/:studentId should unenroll a student from a course', async () => {
    const courses = await request(app).get('/courses');
    const students = await request(app).get('/students');
    const courseId = courses.body.courses[0].id;
    const studentId = students.body.students[0].id;

    await request(app).post(`/courses/${courseId}/students/${studentId}`);
    const res = await request(app).delete(`/courses/${courseId}/students/${studentId}`);
    expect(res.statusCode).toBe(204);
  });  

   test('GET /courses should filter courses by teacher', async () => {
    const res = await request(app).get('/courses?teacher=Dr');
    expect(res.statusCode).toBe(200);
    expect(res.body.courses.length).toBeGreaterThan(0);
  });

    test('DELETE /students/:id should return error when student is enrolled', async () => {
    const courses = await request(app).get('/courses');
    const courseId = courses.body.courses[0].id;
    const studentId = 1;
    await request(app).post(`/courses/${courseId}/students/${studentId}`);
    const res = await request(app).delete(`/students/${studentId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
  
  test('DELETE /students/:id retourne 400 si l’étudiant est inscrit à un cours', async () => {
    await request(app).post('/students').send({
      name: 'a',
      email: 'a@example.com',
    });
    await request(app).post('/courses').send({
      title: 'nouveau cours',
      teacher: 'prof a',
    });
    await request(app).post('/courses/1/students/4'); // On inscrit l’étudiant au cours

    const res = await request(app).delete('/students/4');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Cannot delete student: enrolled in a course');
  });
});
