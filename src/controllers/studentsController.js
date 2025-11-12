const s = require('../services/storage');

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Liste des étudiants
 *     description: Récupère la liste de tous les étudiants avec possibilité de filtrer, paginer et limiter les résultats.
 *     tags:
 *       - Students
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer les étudiants par nom
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrer les étudiants par email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre maximal d’étudiants à renvoyer par page
 *     responses:
 *       200:
 *         description: Liste des étudiants retournée avec succès
 */
exports.listStudents = (req, res) => {
  let students = s.list('students')
  const { name, email, page = 1, limit = 10 } = req.query;
  if (name) students = students.filter((st) => st.name.includes(name));
  if (email) students = students.filter((st) => st.email.includes(email));
  const start = (page - 1) * limit;
  const paginated = students.slice(start, start + Number(limit));
  res.json({ students: paginated, total: students.length });
};
/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Récupérer un étudiant par ID
 *     description: Retourne les informations d’un étudiant et la liste de ses cours inscrits.
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l’étudiant à récupérer
 *     responses:
 *       200:
 *         description: Étudiant trouvé avec succès
 *       404:
 *         description: Étudiant non trouvé
 */
exports.getStudent = (a, b) => {
  const c = s.get('students', a.params.id);
  if (!c) return b.status(404).json({ error: 'Student not found' });
  const courses = s.getStudentCourses(a.params.id);
  return b.json({ student: c, courses });
}
/**
 * @swagger
 * /students:
 *   post:
 *     summary: Créer un nouvel étudiant
 *     description: Ajoute un étudiant dans la base avec son nom et son email.
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom complet de l'étudiant
 *               email:
 *                 type: string
 *                 description: Adresse e-mail de l'étudiant
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Étudiant créé avec succès
 *       400:
 *         description: Paramètres manquants ou invalides
 */
exports.createStudent = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const result = s.create('students', { name, email });
  if (result.error) return res.status(400).json({ error: result.error });
  return res.status(201).json(result);
};
/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Supprimer un étudiant
 *     description: Supprime un étudiant à partir de son identifiant.
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant à supprimer
 *     responses:
 *       204:
 *         description: Étudiant supprimé avec succès
 *       400:
 *         description: Erreur lors de la suppression
 *       404:
 *         description: Étudiant non trouvé
 */
exports.deleteStudent = (req, res) => {
  const result = s.remove('students', req.params.id);
  if (result === false) return res.status(404).json({ error: 'Student not found' });
  if (result.error) return res.status(400).json({ error: result.error });
  return res.status(204).send()
};
/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Mettre à jour un étudiant
 *     description: Met à jour le nom ou l'email d’un étudiant existant.
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de l'étudiant
 *               email:
 *                 type: string
 *                 description: Nouvelle adresse e-mail (doit être unique)
 *     responses:
 *       200:
 *         description: Étudiant mis à jour avec succès
 *       400:
 *         description: Email déjà utilisé ou paramètres invalides
 *       404:
 *         description: Étudiant non trouvé
 */
exports.updateStudent = (req, res) => {
  const student = s.get('students', req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  const { name, email } = req.body;
  if (email && s.list('students').find((st) => st.email === email && st.id !== student.id)) {
    return res.status(400).json({ error: 'Email must be unique' });
  }
  if (name) student.name = name;
  if (email) student.email = email;
  return res.json(student);
};
