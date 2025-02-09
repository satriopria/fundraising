const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRole = require('../middlewares/authorizeRole')
const router = express.Router();

router.get('/user', verifyToken, authorizeRole('user'), (req, res) => {
    res.render('dashboard/index', {
        title: "Dashboard User",
        layout: "dashboard/dashboardTemplate",
        currentPath: req.path
    });
});

router.get('/admin', verifyToken, authorizeRole('admin'), (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Akses ditolak: Hanya admin yang bisa mengakses dashboard admin.');
    }
    res.render('dashboard/admin/index', {
        title: "Dashboard Admin",
        layout: "dashboard/admin/dashboardTemplate",
        currentPath: req.path
    });
});

router.get('/user/projects', verifyToken, authorizeRole('user'), (req, res) => {
    res.render('dashboard/projects', {
        title: "Proyek",
        layout: "dashboard/dashboardTemplate",
        currentPath: req.path,        
        isDemo: process.env.DEMO_PERIOD
    });
});

router.get('/admin/projects', verifyToken, authorizeRole('admin'), (req, res) => {
    res.render('dashboard/admin/projects', {
        title: "Proyek",
        layout: "dashboard/admin/dashboardTemplate",
        currentPath: req.path,
    });
});

router.get('/user/finances', verifyToken, authorizeRole('user'), async (req, res) => {
    // let paymentMethods, projects;
    // try {
    //     const paymentResponse = await fetch(`${process.env.BASE_URL}/api/payment/user`, {method: "POST"});
    //     paymentMethods = await paymentResponse.json();

    //     const projectResponse = await fetch(`${process.env.BASE_URL}/api/project/user`, {method: "POST"});
    //     projects = await projectResponse.json();
    // } catch (error) {
    //     console.error('Error fetching payment methods or projects:', error);
    //     return res.status(500).send('Internal Server Error');
    // }

    res.render('dashboard/finances', {
        title: "Keuangan",
        layout: "dashboard/dashboardTemplate",
        userId: req.user.id,
        currentPath: req.path
        // paymentMethods,
        // projects
    });
});

router.get('/user/setting', verifyToken, authorizeRole('user'), (req, res) => {
    res.render('dashboard/settings', {
        title: "Pengaturan",
        layout: "dashboard/dashboardTemplate",
        currentPath: req.path
    });
});

router.get('/user/invoice/:project_id', verifyToken, authorizeRole('user'), (req, res) => {
    const priceperday = process.env.PRICE_PER_DAY
    res.render('dashboard/invoiceProject', {
        title: 'invoice',
        layout: 'dashboard/dashboardTemplate',
        currentPath: req.path,
        priceperday,
    })
})

router.get('/user/profile', verifyToken, authorizeRole('user'), async (req, res) => {
    try {
        const userData = await fetch(`${process.env.BASE_URL}/api/users/${req.user.id}`, {method: "GET"});
        const user = await userData.json();
        res.render('dashboard/profile', {
            title: 'Profile',
            layout: 'dashboard/dashboardTemplate',
            currentPath: req.path,
            user
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).send('Internal Server Error');
    }
})

module.exports = router;