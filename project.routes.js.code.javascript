/**
 * Project Routes
 */

const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getStatistics,
    addTeamMember,
    uploadFile,
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protect all routes
router.use(protect);

// @route   GET /api/v1/projects
router.get('/', getProjects);

// @route   GET /api/v1/projects/statistics
router.get('/statistics', getStatistics);

// @route   POST /api/v1/projects/create
router.post('/create', createProject);

// @route   GET /api/v1/projects/:id
router.get('/:id', getProject);

// @route   PUT /api/v1/projects/:id
router.put('/:id', updateProject);

// @route   DELETE /api/v1/projects/:id
router.delete('/:id', deleteProject);

// @route   POST /api/v1/projects/:id/team
router.post('/:id/team', addTeamMember);

// @route   POST /api/v1/projects/:id/files
router.post('/:id/files', upload.single('file'), uploadFile);

module.exports = router;