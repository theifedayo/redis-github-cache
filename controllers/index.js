const fetch = require('node-fetch')
const redis = require('redis')
var express = require('express');
var router = express.Router();
const csrf = require('csurf')
const csrfProtection = csrf()
router.use(csrfProtection)




exports.getHome = (req, res)=>{
	res.render('index', {csrfToken: req.csrfToken()})
}


exports.getRepos = async (req, res)=>{
	try{
		const { username } = req.params
		const response = await fetch(`https://api.github.com/users/${username}`)

		const data = await response.json()

		const repos = data.public_repos

		client.setex(username, 3600, repos)
		res.render('repos', {username: username, repos: repos})
	}catch(err){
		res.render('500')
	}
}