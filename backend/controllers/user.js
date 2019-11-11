const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        console.log(user.firstname)
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching user failed!"
      });
    });
};

exports.addUserExperience = (req, res, next) => {
  const experience = {
    jobtitle: req.body.title,
    companyname: req.body.companyname,
    companylocation: req.body.location,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    jobdescription: req.body.content,
  };
  User.findOne({ _id: req.params.id })
    .then(result => {
      result.workexperience.push(experience);
      User.updateOne({
        _id: req.params.id
      }, {
        $set: { "workexperience": result.workexperience }
      }).then(result => {
        res.status(201).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.updateUserExperience = (req, res, next) => {
  const experience = {
    _id: req.body.id,
    jobtitle: req.body.title,
    companyname: req.body.companyname,
    companylocation: req.body.location,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    jobdescription: req.body.content,
  };
  let fetchedUser;
  let resultantexperience = [];
  User.findOne({ _id: req.params.id })
    .then(result => {
      fetchedUser = result;
      for (let i = 0; i < fetchedUser.workexperience.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.workexperience[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === req.body.id) {
          resultantexperience.push(experience);
        }else {
          resultantexperience.push(fetchedUser.workexperience[i]);
        }
      }
      User.updateOne({
        _id: req.params.id
      }, {
        $set: { "workexperience": resultantexperience }
      }).then(result => {
        res.status(201).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.deleteExperience = (req, res, next) => {
  let fetchedUser;
  let resultantexperience = [];
  User.findOne({ _id: req.params.userId })
    .then(result => {
      fetchedUser = result;
      for (let i = 0; i < fetchedUser.workexperience.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.workexperience[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === req.params.experienceId) {
          console.log("True");
        }else {
          resultantexperience.push(fetchedUser.workexperience[i]);
        }
      }
      User.updateOne({
        _id: req.params.userId
      }, {
        $set: { "workexperience": resultantexperience }
      }).then(result => {
        res.status(201).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getExperience = (req, res, next) => {
  const userId = req.params.userId;
  const experience = req.params.experienceId;
  let fetchedUser;
  console.log(userId);
  User
    .findOne({ _id: userId })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.workexperience.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.workexperience[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === experience) {
          res.status(200).json(fetchedUser.workexperience[i]);
        }
      }
    });
};

exports.addUserEducation = (req, res, next) => {
  const experience = {
    degree: req.body.degree,
    schoolname: req.body.schoolname,
    schoollocation: req.body.location,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    description: req.body.description,
    fieldofstudy: req.body.fieldofstudy,
    grades: req.body.grades
  };
  User.findOne({ _id: req.params.id })
    .then(result => {
      result.education.push(experience);
      User.updateOne({
        _id: req.params.id
      }, {
        $set: { "education": result.education }
      }).then(result => {
        res.status(201).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.updateUserEducation = (req, res, next) => {
  const experience = {
    _id: req.body.id,
    degree: req.body.degree,
    schoolname: req.body.schoolname,
    schoollocation: req.body.location,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    description: req.body.description,
    fieldofstudy: req.body.fieldofstudy,
    grades: req.body.grades
  };
  let fetchedUser;
  let resultanteducation = [];
  User.findOne({ _id: req.params.id })
    .then(result => {
      fetchedUser = result;
      for (let i = 0; i < fetchedUser.education.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.education[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === req.body.id) {
          resultanteducation.push(experience);
        }else {
          resultanteducation.push(fetchedUser.education[i]);
        }
      }
      User.updateOne({
        _id: req.params.id
      }, {
        $set: { "education": resultanteducation }
      }).then(result => {
        res.status(201).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.deleteEducation = (req, res, next) => {
  let fetchedUser;
  let resultanteducation = [];
  User.findOne({ _id: req.params.userId })
    .then(result => {
      fetchedUser = result;
      for (let i = 0; i < fetchedUser.education.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.education[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === req.params.educationId) {

        }else {
          resultanteducation.push(fetchedUser.education[i]);
        }
      }
      console
      User.updateOne({
        _id: req.params.userId
      }, {
        $set: { "education": resultanteducation }
      }).then(result => {
        res.status(201).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getEducation = (req, res, next) => {
  const userId = req.params.userId;
  const education = req.params.educationId;
  let fetchedUser;
  console.log(userId);
  User
    .findOne({ _id: userId })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.education.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.education[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === education) {
          res.status(200).json(fetchedUser.education[i]);
        }
      }
    });
};
