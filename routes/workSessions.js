const express = require('express');
const {
    getAllWorkSessions,
    getWorkSession,
    createWorkSession,
    deleteWorksession,
    updateWorkSession,
    getNotClosedWorkSession
} = require('../controllers/workSessionsController')
//const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// require auth for all worksessions routes
//router.use(requireAuth);

// ROUTE HANDLERS

// two options
// 1. /:user_id - GET all work sessions for user
// 2. /:user_id?generatePdfReport=true - generate a PDF report 
router.get('/:user_id', getAllWorkSessions);

// GET a single work session
router.get('/single/:id', getWorkSession);

// GET a single work session that is not closed
router.get('/not_closed/:user_id', getNotClosedWorkSession); 

//POST(create) a new work session
router.post('/', createWorkSession);

//DELETE a work session
router.delete('/:id', deleteWorksession);

//PATCH (update) a work session
router.patch('/:id', updateWorkSession);

module.exports = router;