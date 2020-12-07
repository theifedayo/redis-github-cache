const fetch = require('node-fetch')
const redis = require('redis')
var express = require('express');
var router = express.Router();
const csrf = require('csurf')
const csrfProtection = csrf()
router.use(csrfProtection)





exports.cache = (req, res, next)=>{
	const startcache = new Date()
	const startcacheT = startcache.getTime()
	const { username } = req.params

	const REDIS_PORT = process.env.REDIS_URL || 6379

	const client = redis.createClient(REDIS_PORT)

	client.get(username, (err, data)=>{
		if(err) throw err
		if(data != null){
			const endcache = new Date()
			const endcacheT = endcache.getTime()
			responseT = (endcacheT - startcacheT)*100
			res.render('repos', {username: username, repos: data, responseT: responseT})
		}else {
			next()
		}
	})
}

exports.getHome = (req, res)=>{
	res.render('index', {csrfToken: req.csrfToken()})
}

exports.postHome = (req, res)=> {
	const username = req.body.username
	res.redirect(`/repos/${ username }`)
}


exports.getRepos = async (req, res)=>{
	try{
		const start = new Date()
		const startMill = start.getTime()
		console.log(startMill)
		console.log('fetching data........')
		const { username } = req.params
		console.log(username,'xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
		const response = await fetch(`https://api.github.com/users/${username}`)

		const REDIS_PORT = process.env.REDIS_URL || 6379

		const client = redis.createClient(REDIS_PORT)

		const data = await response.json()

		const repos = data.public_repos

		client.setex(username, 5400, repos, (err, reply) => {
		    if (err) {
		        console.error(err);
		        res.render('500')
		    } else {
		        console.debug(reply);
		        const end = new Date()
				const endMill = end.getTime()
				console.log(endMill)
				responseT = (endMill - startMill)*100
				res.render('repos', {username: username, repos: repos, responseT: responseT})
		    }
		})
	}catch(err){
		res.render('500')
	}
}