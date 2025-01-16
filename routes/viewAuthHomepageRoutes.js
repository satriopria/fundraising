const express = require('express');
const router = express.Router();



router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: "Login",
        layout: "auth/authTemplate"
    });
});

router.get('/register', (req, res) => {
    res.render('auth/register', {
        title: "Register",
        layout: "auth/authTemplate"
    });
});

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgotPassword', {
        title: "Forgot Password",
        layout: "auth/authTemplate"
    });
});

router.get('/', async (req, res) => {
    function removeTags(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();
        return str.replace(/(<([^>]+)>)/ig, '');
    }

    const search = req.query.search || '';
    let projectList;
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/project`);
        projectList = await response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
    }

    projectList.forEach(project => {
        project.description = removeTags(project.description);
    });

    res.render('index', {
        title: "index",
        layout: "indexLayout",
        search,
        projectList,
    });
});

router.get('/project-detail/:id', async (req, res) => {
    const { id } = req.params;
    let response, projectDetail, collectedDonation, paymentMethod, userDetail
    try {
        response = await fetch(`${process.env.BASE_URL}/api/project/${id}`);
        projectDetail = await response.json();
        projectDetail.budget = parseInt(projectDetail.budget)
        console.log(projectDetail)
        response = await fetch(`${process.env.BASE_URL}/api/finance/collect/${id}`, { method: "POST" })
        collectedDonation = await response.json();

        response = await fetch(`${process.env.BASE_URL}/api/payment/list/${projectDetail.user_id}`);
        paymentMethod = await response.json();

        response = await fetch(`${process.env.BASE_URL}/api/users/${projectDetail.user_id}`);
        userDetail = await response.json()
    } catch (error) {
        console.error('Error fetching project detail:', error);
    }

    res.render('projectDetail', {
        title: "detail",
        layout: "indexLayout",
        projectDetail,
        collectedDonation: collectedDonation,
        paymentMethod,
        organizer: userDetail
    })
})

router.get('/invoice/:id', async (req, res) => {
    res.render('invoice', {
        title: "Invoice",
        layout: "indexLayout",
    })
})


module.exports = router;