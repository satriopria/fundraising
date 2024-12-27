const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: "login",
        layout: "auth/authTemplate"
    });
});

router.get('/register', (req, res) => {
    res.render('auth/register',{
        title: "register",
        layout: "auth/authTemplate"
    });
});

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgotPassword',{
        title: "forgot password",
        layout: "auth/authTemplate"
    });
});

router.get('/dashboard', verifyToken, (req, res) => {
    res.render('dashboard/index', {
        title: "dashboard",
        layout: "dashboard/dashboardTemplate",
    });
});

router.get('/projects', verifyToken, (req, res) => {
    res.render('dashboard/projects', {
        title: "projects",
        layout: "dashboard/dashboardTemplate",        
        userId: req.user.id
    });
});

router.get('/', (req, res) => {
    res.render('index', { title: 'entrypoint' });
});

module.exports = router;