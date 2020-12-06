var express = require('express');
var router = express.Router();


const csrf = require('csurf')

const csrfProtection = csrf()
router.use(csrfProtection)

const index = require('../controllers/index')





/* GET home page. */
router.get('/', index.getHome);

router.post('/', index.postHome);

router.get('/repos/:username', index.cache, index.getRepos)

module.exports = router;
