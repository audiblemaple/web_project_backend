const WorkSession = require('../models/workSessionModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const PDF_report = require('../utils/pdf-report');

    const checkObjectIdFormat = (id, res) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: 'fail',
                error: 'Invalid Object id - not in correct format'
            })
        }
    }

    // inner function to check if work session is null and then
    // generate a response accordingly
    const checkWorkSessionStatus = (workSession, res) => {
        if (!workSession) {
            return res.status(400).json({
                status: 'fail',
                error: 'No such work session'
            })
        }
        
        res.status(200).json({
            status: 'success',
            workSession
        });
    }

// get all work sessions
const getAllWorkSessions = async (req, res) => {
    // it's working but 
    // it's suppose to be from authorization header in browzer...
    const { user_id } = req.params;

    checkObjectIdFormat(user_id, res);

    try {
        const user = await User.findOne({ _id: user_id });

        if (!user) {
            throw Error('User does not exists');
        }

        // Get only work seesions from this current month
        const currentDate = new Date();
        const yearMonth = currentDate.toISOString().slice(0, 7);

        const workSessions = await WorkSession.find({ 
            user_id,
            yearMonth 
        }).sort({createdAt: -1});

        if (req.query.generatePdfReport === 'true') {
            // build work sessions report
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=${yearMonth}_attendence_report.pdf`,
            });
            PDF_report.buildPDF(
                user,
                workSessions,
                (chunk) => stream.write(chunk),
                () => stream.end()
            );
        }

        else {
            res.status(200).json({
            status: 'success',
            requstedAt: req.requestTime,
            workSessions
        });
        }

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

// get a single work session
const getWorkSession = async (req, res) => {
    const { id } = req.params
    console.log(id);
    
    checkObjectIdFormat(id, res)

    const workSession = await WorkSession.findById(id)

    checkWorkSessionStatus(workSession, res);
}

// get a single work session that is not closed
const getNotClosedWorkSession = async (req, res) => {
    const { user_id } = req.params;

    checkObjectIdFormat(user_id, res);

    try {
        const user = await User.findOne({ _id: user_id });

        if (!user) {
            throw Error('User does not exists');
        }

        const workSession = await WorkSession.findOne({ 
            user_id,
            clockOut: { $exists: false },
            duration: { $exists: false }
        });

        if (!workSession) {
            return res.status(200)
            .json({
                status: 'success',
                requstedAt: req.requestTime,
                message: 'No open work session for this user'
            });
        }

        res.status(200)
        .json({
            status: 'success',
            requstedAt: req.requestTime,
            message: 'user did not close last work session',
            workSession
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

// create a new work session
const createWorkSession = async (req, res) => {
    const {user_id, clockIn, yearMonth, day} = req.body;

    // add doc to DB
    try {
        const workSession = await WorkSession.create({user_id, clockIn, yearMonth, day});
        res.status(201).json({
            status: "success",
            workSession
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

// delete a work session
const deleteWorksession = async (req, res) => {
    const { id } = req.params

    checkObjectIdFormat(id, res)

    const workSession = await WorkSession.findOneAndDelete({_id: id})

    checkWorkSessionStatus(workSession, res);
}

// update a work session
const updateWorkSession = async (req, res) => {
    const { id } = req.params
    
    checkObjectIdFormat(id, res)

    const workSession = await WorkSession.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    checkWorkSessionStatus(workSession, res);
}

module.exports = {
    getAllWorkSessions,
    getWorkSession,
    createWorkSession,
    deleteWorksession,
    updateWorkSession,
    getNotClosedWorkSession
}