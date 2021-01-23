var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const ScheduleDb = require("./../models/Schedule")
const nodemailer = require("nodemailer");
const SmtpDetails = {
  host:"",
  username:"",
  password:""
}
/* GET Schedule for listing . */
router.get('/', function (req, res, next) {

  ScheduleDb.find({}, function (err, apis) {
    console.log("err::", err);
    if (err) return res.status(401).send(err);

    res.send(apis);

  });

});



/* GET Schedule by id. */
router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  ScheduleDb.find({ _id: id }, function (err, apis) {

    if (err) return res.status(401).send(err);

    res.send(apis);

  });
});

router.post('/', body('email').isEmail(),
  body('name').isLength({ min: 2 }),
  body('sheduleDatetime').isNumeric()
  , function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const sheduleData = {
      "name": req.body.name,
      "email": req.body.email,
      "setSchedule": req.body.sheduleDatetime
    }
    console.log("weare here", sheduleData);
    var schedule_data = new ScheduleDb(sheduleData);
    console.log("weare here2");
    schedule_data.save(function (err, result) {
      //console.log("err :: ", err, "::result::", result);
      if (err) {
        return res.status(400).send(err);
      }

      else {
        return res.status(200).send(result);
      }
    });
    console.log("exit");
  });

/* update for  Schedule update. */
router.put('/:id', function (req, res, next) {
  const id = (req.params.id) ? req.params.id : null;
  ScheduleDb.find({ _id: id }, function (err, isData) {
    if (err) return res.status(401).send(err);
    if (isData.length > 0) {
      const sheduleData = {
        "name": req.body.name,
        "email": req.body.email,
        "setSchedule": req.body.sheduleDatetime
      }
      ScheduleDb.update({ _id: id }, sheduleData, {}, (err, data) => {
        if (err) return res.status(401).send({ err: err, message: "something went wrong !!!" });
        return res.status(200).send({ data: data, message: "Updated !!!" });
      });

    } else {
      res.status(401).send('no records found for update');
    }


  });
  //res.send('respond with a resource');
});


/* delete Schedule for remove. */
router.delete('/', function (req, res, next) {
  ScheduleDb.findOneAndDelete(req.params.id, (err, data) => {
    console.log("err :: ", err, "data ", data)
    if (err) {
      return res.status(401).send({ err: err, mess: "something want wrong" })
    }
    return res.status(200).send('succefully deleted')
  })
});

router.post('/sendMail', function (req, res, next) {
  ScheduleDb.find({
    setSchedule: {
      $gte: new Date(1611203908),
      $lt: new Date(1611376708)
    }
  }, (err, mailData) => {
    if (err) return res.status(401).send({ err: err, mess: "something want wrong" });
    if (data.length > 0) {
      let testAccount = nodemailer.createTestAccount((err, isconnected) => {
        let transporter = nodemailer.createTransport({
          host: SmtpDetails.host,
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: SmtpDetails.username, // generated ethereal user
            pass: SmtpDetails.password, // generated ethereal password
          },
        });
        const mailArr = [];
        mailData.forEach(schedule => {
          mailArr.push(schedule.email)
        });
        let info = transporter.sendMail({
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: mailArr,
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
        }, (err, isSend) => {
          if (err) return res.status(401).send({ err: err, mess: "something want wrong" });
          if (isSend) {
            return res.status(200).send({ mess: "mail sent" });
          }
        });

      });

    } else {
      res.status(200).send({ mess: "No records found to send mail" })
    }

  })
});



module.exports = router;
