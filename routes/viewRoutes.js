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
    res.render('auth/register', {
        title: "register",
        layout: "auth/authTemplate"
    });
});

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgotPassword', {
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

router.get('/finances', verifyToken, (req, res) => {
    res.render('dashboard/finances', {
        title: "finances",
        layout: "dashboard/dashboardTemplate",
        userId: req.user.id
    });
});

router.get('/setting', verifyToken, (req, res) => {
    res.render('dashboard/settings', {
        title: "setting",
        layout: "dashboard/dashboardTemplate",
        userId: req.user.id
    });
});

router.get('/', async (req, res) => {
    const search = req.query.search || '';
    let projectList;
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/project`);
        projectList = await response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
    res.render('index', {
        title: "index",
        layout: "indexLayout",
        search,
        projectList,
    });
});

router.get('/project-detail/:id', async (req, res) => {
    const { id } = req.params;
    let response, projectDetail, collectedDonation, paymentMethod
    try {
        response = await fetch(`${process.env.BASE_URL}/api/project/${id}`);
        projectDetail = await response.json();

        response = await fetch(`${process.env.BASE_URL}/api/finance/collect/${id}`, {method: "POST"})
        collectedDonation = await response.json();

        response = await fetch(`${process.env.BASE_URL}/api/payment/list/${projectDetail.user_id}`);
        paymentMethod = await response.json();
    } catch (error) {
        console.error('Error fetching project detail:', error);
    }
    
    res.render('projectDetail', {
        title: "detail",
        layout: "indexLayout",
        projectDetail,
        collectedDonation: collectedDonation.total_donations,
        paymentMethod
    })
})

module.exports = router;