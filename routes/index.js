var express = require('express');
var router = express.Router();


const csrf = require('csurf')

const csrfProtection = csrf()
router.use(csrfProtection)

const index = require('../controllers/index')





/* GET home page. */
router.get('/', (req, res)=>{
	res.render('index', {csrfToken: req.csrfToken()})
});


router.get('/repos/:username', index.getRepos)

module.exports = router;
