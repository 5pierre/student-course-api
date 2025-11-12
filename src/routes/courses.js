const express = require('express');
const storage = require('../services/storage'); // <-- Move require to top

const {
  listCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} = require('../controllers/coursesController');

const router = express.Router();

router.get('/', listCourses);
router.get('/:id', getCourse);
router.post('/', createCourse);
router.delete('/:id', deleteCourse);


/**
 * @swagger
 * /{id_course}/courses/{id_student}:
 *  post:
 *    summary: Create a new course
 *    tags:
 *      - routes/Courses
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              teacher:
 *                type: string
 *    responses:
 *      201:
 *        description: Course created successfully
 *      400:
 *        description: Invalid request
 */

router.post('/:courseId/students/:studentId', (req, res) => {
  const result = storage.enroll(req.params.studentId, req.params.courseId); // use storage
  if (result.error) return res.status(400).json({ error: result.error });
  return res.status(201).json({ success: true });
});


/**
 * @swagger
 * /courses/{courseId}/students/{studentId}:
 *   delete:
 *     summary: Désinscrire un étudiant d’un cours
 *     description: Supprime l’inscription d’un étudiant spécifique à un cours donné.
 *     tags:
 *       - routes/Courses
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID du cours
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: ID de l’étudiant
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       204:
 *         description: Étudiant désinscrit avec succès
 *       404:
 *         description: Étudiant ou cours non trouvé
 */
router.delete('/:courseId/students/:studentId', (req, res) => {
  const result = storage.unenroll(req.params.studentId, req.params.courseId); // use storage
  if (result.error) return res.status(404).json({ error: result.error });
  return res.status(204).send();
});

router.put('/:id', updateCourse);

module.exports = router;