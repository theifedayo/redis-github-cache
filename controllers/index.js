const fetch = require('node-fetch')
const redis = require('redis')


exports.getHome = (req, res)=>{
	res.render('index')
}


exports.getRepos = async (req, res)=>{
	try{
		const { username } = req.params
		const response = await fetch(`https://api.github.com/users/${username}`)

		const data = await response.json()

		res.send(data)
	}catch(err){
		res.render('500')
	}
}