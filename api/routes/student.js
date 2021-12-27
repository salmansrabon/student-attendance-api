const express = require('express');
const router = express.Router();
const { todaysDate, attendanceTime, checkEmailIsValid } = require('../../utils');
const { Student } = require('./sequelizeModel/Student');

router.get('/', async function (req, res) {
    res.status(200).json({
        message: "Server is up"
    });
});

router.get('/list', async function (req, res) {
    const stuObj = await Student.findAll()

    res.json({
        count: stuObj.length,
        students: stuObj.length ? stuObj : []
    });

});
router.get('/list/email/:email', async function (req, res) {
    const email = req.params.email;
    const stuObj = await Student.findAll({ where: { email } })
    return res.json({
        count: stuObj.length,
        students: stuObj.length ? stuObj : []
    });

});
router.get('/email/:email', async (req, res, next) => {

    try {

        const { email } = req.params;
        const stuObj = await Student.findOne({ where: { email } }).then(data => {
            if (!data) {
                return false;
            }

            return data.email === email && data.datetime.includes(String(todaysDate()));
        });
        const newInfo = {
            email,
            datetime: attendanceTime()
        };
        if (stuObj) {
            res.status(200).json({
                message: 'Already submitted!'
            })
        }
        else {
            if (checkEmailIsValid(email)) {
                const start = 00 * 60 + 50;
                const end = 23 * 60 + 59;
                const date = new Date();
                const now = (date.getHours()) * 60 + date.getMinutes();
                if (date.getDay() == 1 || date.getDay() == 3 || date.getDay() == 6) {
                    if (start <= now && now <= end) {
                        await Student.create({ ...newInfo });
                        res.status(201).json({
                            message: "success",
                            Students: newInfo
                        });
                    }
                    else {
                        res.status(200).json({
                            message: '' + attendanceTime() + ' This is not class time! You can give attendance from 07:50 PM to 11:59 PM'
                        })
                    }
                }
                else {
                    res.status(200).json({
                        message: 'Today is not class day! Only Saturday, Monday and Wednesday are the scheduled class days'
                    })
                }

            }
            else {
                res.status(200).json({
                    message: 'Invalid email format'
                })
            }


        }

    } catch (e) {
        next(e);
    }

});

module.exports = router;