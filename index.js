const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const port = 3000;

const app = express();

let removeObjIfNoProp = (obj, bool) => {
	let keys = Object.keys(obj);
	let result = {};
	for (let key of keys) {
		if (obj[key] !== null && obj[key] !== undefined) result[key] = obj[key];
	}
	if (bool) {
		delete result.login;
		result = Object.assign({
			next: ''
		}, result)
	}
	return result;
}

let formParams = (email, pass, data) => {
	let obj = {}
	let $ = cheerio.load(data)
	obj.lsd = $('form').children('input[name=lsd]').attr('value')
	obj.fb_dstg = $('form').children('input[name=fb_dtsg]').attr('value')
	obj.nux_source = $('form').children('input[name=nux_source]').attr('value')
	obj.flow = $('form').children('input[name=flow]').attr('value')
	obj.jazoest = $('form').children('input[name=jazoest]').attr('value')
	obj.m_ts = $('form').children('input[name=m_ts]').attr('value')
	obj.li = $('form').children('input[name=li]').attr('value')
	obj.try_number = $('form').children('input[name=try_number]').attr('value')
	obj.unrecognized_tries = $('form').children('input[name=unrecognized_tries]').attr('value')
	//VISIBLE PARAMS
	obj.email = email
	obj.pass = pass
	obj.login = 'Log In'
	obj.bi_xrwh = $('form').children('input[name=bi_xrwh]').attr('value')
	return obj
}

let arr2obj = (arr) => {
	let result = arr.reduce((acc, current) => {
		let keyValue = current.split('=');
		acc[keyValue[0]] = keyValue[1];
		return acc;
	}, {});
	return result;
}

app.get('/', (req, res) => {
	res.send("This API was made by HackMeSenpai.")
})

app.get('/fbcookie', async function(req, res) {
	let user = req.query.user;
	let pass = req.query.pass;
	try {
		if (!user) throw new Error('"user" parameter cannot be empty!');
		if (!pass) throw new Error('"pass" parameter cannot be empty!');
		let r1 = await axios.get('https:/\/mbasic.facebook.com/login')
		let cookie1 = r1.headers['set-cookie'].map(e => e.split(';')[0] + ';').join('')
		let config = formParams(user, pass, r1.data)
		config = removeObjIfNoProp(config)
		let r2 = await axios.post('https:/\/mbasic.facebook.com/login/device-based/regular/login/?refsrc=deprecated&lwv=100&refid=8', new URLSearchParams(config), {
			maxRedirects: 0,
			validateStatus: (status) => status >= 200 && status < 400,
			headers: {
				'cookie': cookie1
			}
		})
		let cookie2 = r2.headers['set-cookie'].map(e => e.split(';')[0] + ';')
		cookie2.shift()
		cookie2 = cookie2.join('')
		let r3 = await axios.get(r2.headers.location, {
			maxRedirects: 0,
			validateStatus: (status) => status >= 200 && status < 400,
			headers: {
				'cookie': cookie1 + cookie2
			}
		})
		let cookie3 = r3.headers['set-cookie'].map(e => e.split(';')[0] + ';').join('')
		let datr = cookie1.split(';')
		let c2 = cookie2.split(';')
		let mpagevoice = cookie3.split(';')
		datr.pop()
		c2.pop()
		mpagevoice.pop()
		c1 = arr2obj(datr)
		c2 = arr2obj(c2)
		c3 = arr2obj(mpagevoice)
		let fbstate = [{
			"key": "sb",
			"value": c1.sb,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "c_user",
			"value": c2.c_user,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "xs",
			"value": c2.xs,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "fr",
			"value": c2.fr,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "m_page_voice",
			"value": c3.m_page_voice,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "ps_n",
			"value": "1",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "ps_l",
			"value": "1",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "locale",
			"value": "en_US",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "vpd",
			"value": "v1%3B634x360x2",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "fbl_st",
			"value": "100624173%3BT%3A28612000",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "wl_cbv",
			"value": "v2%3Bclient_version%3A2510%3Btimestamp%3A1716720049",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}]
		res.json(fbstate);
	} catch (e) {
		if (!e.response) {
			res.send({
				error: e.message
			});
		} else {
			res.send({
				error: `${e.response.status} ${e.response.statusText}`,
				data: e.response.data.message
			});
		}
	}
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
