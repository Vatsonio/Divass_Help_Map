//routes/index.js
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');
var Requests = require('../models/requestSchema');
const saltRounds = 10;


// Функція для обробки помилок
function handleError(res, err, message) {
    console.error(err);
    res.status(500).send(message);
}

// Головна сторінка
router.get('/', function(req, res) {
    User.findOne({ unique_id: req.session.userId }, function(err, user) {
        if (err) {
            console.error(err);
            user = null;
        }
        Requests.find({}, function(err, requests) {
            if (err) {
                return handleError(res, err, "Помилка при отриманні заявок.");
            }
            res.render('index', { user: user, requests: requests });
        });
    });
});


// Завантаження Сторінки Реєстрація
router.get('/register', function(req, res, next) {
    User.findOne({ unique_id: req.session.userId }, function(err, user) {
        if (err) {
            console.error(err);
            user = null;
        }
        Requests.find({}, function(err, requests) {
            if (err) {
                return handleError(res, err, "Помилка при отриманні заявок.");
            }
            res.render('register', { user: user, requests: requests });
        });
    });
});


// Реєстрація
router.post('/register', function(req, res) {
    var personInfo = req.body;

    if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf || !personInfo.role) {
        return res.send();
    }

    if (personInfo.password != personInfo.passwordConf) {
        return res.send({ "Success": "password is not matched" });
    }

    User.findOne({ email: personInfo.email }, function(err, data) {
        if (err) {
            return handleError(res, err, "Помилка при реєстрації.");
        }
        if (data) {
            return res.redirect('/register');
        }

        var c;
        User.findOne({}, function(err, data) {
            if (data) {
                c = data.unique_id + 1;
            } else {
                c = 1;
            }

            bcrypt.hash(personInfo.password, saltRounds, function(err, hash) {
                var newPerson = new User({
                    unique_id: c,
                    email: personInfo.email,
                    username: personInfo.username,
                    lastname: personInfo.lastname,
                    password: hash,
                    passwordConf: hash,
                    role: personInfo.role
                });

                newPerson.save(function(err) {
                    if (err) {
                        return handleError(res, err, "Помилка при реєстрації.");
                    }
                    res.redirect('/login');
                });
            });
        }).sort({ _id: -1 }).limit(1);
    });
});


// Завантаження Сторінки з логіном
router.get('/login', function(req, res, next) {
    User.findOne({ unique_id: req.session.userId }, function(err, user) {
        if (err) {
            console.error(err);
            user = null;
        }
        Requests.find({}, function(err, requests) {
            if (err) {
                return handleError(res, err, "Помилка при отриманні заявок.");
            }
            res.render('login.ejs', { user: user, requests: requests });
        });
    });
});

// Логін
router.post('/login', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, data) {
        if (err) {
            return handleError(res, err, "Помилка при вході.");
        }
        if (!data) {
            return res.send({ "Success": "This Email Is not regestered!" });
        }
        bcrypt.compare(req.body.password, data.password, function(err, result) {
            if (result == true) {
                req.session.userId = data.unique_id;
                res.redirect('/profile');
            } else {
                return res.send({ "Success": "Wrong password!" });
            }
        });
    });
});



// Створення нової заявки
router.post('/submit-request', function(req, res) {
    var newRequest = new VolunteerMap({
        unique_id: req.body.unique_id,
        volunteer_id: req.body.volunteer_id,
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        cords: {
            latitude: req.body.latitude,
            longitude: req.body.longitude
        },
        status: 'Open'
    });

    newRequest.save(function(err) {
        if (err) {
            return handleError(res, err, "Помилка при створенні заявки.");
        }
        res.redirect('/');
    });
});


// Отримання всіх заявок
router.get('/requests', function(req, res) {
    Requests.find({}, function(err, requests) {
        if (err) {
            return handleError(res, err, "Помилка при отриманні заявок.");
        }
        res.json(requests);
    });
});

router.get('/request-help', function(req, res, next) {
    User.findOne({ unique_id: req.session.userId }, function(err, user) {
        if (err) {
            console.error(err);
            user = null;
        }
        Requests.find({}, function(err, requests) {
            if (err) {
                return handleError(res, err, "Помилка при отриманні заявок.");
            }
            // Передаємо заявки до шаблону
            res.render('request-help.ejs', { user: user, requests: requests });
        });
    });
});


// Завантаження Сторінки з контактною формою
router.get('/contact', function(req, res, next) {
    User.findOne({ unique_id: req.session.userId }, function(err, user) {
        if (err) {
            console.error(err);
            user = null;
        }
        Requests.find({}, function(err, requests) {
            if (err) {
                return handleError(res, err, "Помилка при отриманні заявок.");
            }
            res.render('contact.ejs', { user: user, requests: requests });
        });
    });
});

router.get('/about', function(req, res, next) {
    User.findOne({ unique_id: req.session.userId }, function(err, user) {
        if (err) {
            console.error(err);
            user = null;
        }
        Requests.find({}, function(err, requests) {
            if (err) {
                return handleError(res, err, "Помилка при отриманні заявок.");
            }
            res.render('about.ejs', { user: user, requests: requests });
        });
    });
});

router.get('/map', function(req, res, next) {
    User.findOne({ unique_id: req.session.userId }, function(err, user) {
        if (err) {
            console.error(err);
            user = null;
        }
        Requests.find({}, function(err, requests) {
            if (err) {
                return handleError(res, err, "Помилка при отриманні заявок.");
            }
            res.render('map', { user: user, requests: requests });
        });
    });
});



function calculateRequestsTaken(user) {
    return new Promise((resolve, reject) => {
        Requests.countDocuments({ volunteer_id: user._id }, function(err, count) {
            if (err) {
                console.error(err);
                reject(0);
            } else {
                resolve(count);
            }
        });
    });
}

function calculateRequestsSubmitted(user) {
    return new Promise((resolve, reject) => {
        Requests.countDocuments({ user_id: user._id }, function(err, count) {
            if (err) {
                console.error(err);
                reject(0);
            } else {
                resolve(count);
            }
        });
    });
}


router.get('/profile', function(req, res, next) {
    console.log("profile");
    User.findOne({ unique_id: req.session.userId }, function(err, data) {
        if (err) {
            console.error(err);
            return res.status(500).send("Помилка при отриманні профілю користувача.");
        }
        console.log("data");
        console.log(data);
        if (!data) {
            res.redirect('/');
        } else {
            Promise.all([calculateRequestsTaken(data), calculateRequestsSubmitted(data)]).then(function(results) {
                var requestsTaken = results[0];
                var requestsSubmitted = results[1];

                return res.render('data.ejs', {
                    "name": data.username,
                    "email": data.email,
                    "role": data.role,
                    "requestsTaken": requestsTaken,
                    "requestsSubmitted": requestsSubmitted
                });
            }).catch(function(err) {
                console.error(err);
                res.status(500).send("Помилка при отриманні даних заявок.");
            });
        }
    });
});


router.get('/logout', function(req, res, next) {
    console.log("logout")
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
        });
    }
});

// Завантаження Сторінки "Forgen Pass"
router.get('/forgetpass', function(req, res, next) {
    User.findOne({ unique_id: req.session.userId }, function(err, user) {
        if (err) {
            console.error(err);
            user = null;
        }
        Requests.find({}, function(err, requests) {
            if (err) {
                return handleError(res, err, "Помилка при отриманні заявок.");
            }

            res.render('forget.ejs', { user: user, requests: requests });
        });
    });
});

router.post('/forgetpass', function(req, res, next) {
    User.findOne({ email: req.body.email }, function(err, data) {
        console.log(data);
        if (!data) {
            res.send({ "Success": "This Email Is not regestered!" });
        } else {
            if (req.body.password == req.body.passwordConf) {
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    data.password = hash;
                    data.passwordConf = hash;

                    data.save(function(err, Person) {
                        if (err)
                            console.log(err);
                        else
                            console.log('Success');
                        res.redirect('/login');
                    });
                });
            } else {
                res.send({ "Success": "Password does not matched! Both Password should be same." });
            }
        }
    });
});

module.exports = router;