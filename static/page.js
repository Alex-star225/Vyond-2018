const sessions = require('../data/sessions');
const fUtil = require('../fileUtil');
const stuff = require('./info');

function toAttrString(table) {
	return typeof (table) == 'object' ? Object.keys(table).filter(key => table[key] !== null).map(key =>
		`${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`).join('&') : table.replace(/"/g, "\\\"");
}
function toParamString(table) {
	return Object.keys(table).map(key =>
		`<param name="${key}" value="${toAttrString(table[key])}">`
	).join(' ');
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs).map(key =>
		`${key}="${attrs[key].replace(/"/g, "\\\"")}"`
	).join(' ')}>${toParamString(params)}</object>`;
}

module.exports = function (req, res, url) {
	if (req.method != 'GET') return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case '/charactercreator/new_char/': {
			title = 'Character Creator';
			attrs = {
				data: process.env.SWF_URL + '/cc.swf', // data: 'cc.swf',
				type: 'application/x-shockwave-flash', id: 'char_creator', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'm_mode': 'school', 'bs': 'adam', 'isLogin': 'Y', 'isEmbed': '0', 'ctc': 'go', 'tlang': 'en_US',
					'storePath': process.env.STORE_URL + '/<store>',
					'clientThemePath': process.env.CLIENT_URL + '/<client_theme>', 'appCode': 'go', 'page': '', 'siteId': 'go', 
					'userId': '00EDZP3Cu0aw', 'themeId': 'family', 'ut': 30,
				},
				
				allowScriptAccess: 'always',
				movie: process.env.SWF_URL + '/cc.swf', // 'http://localhost/cc.swf'
			};
			break;
		}
			
                case '/charactercreator': {
			title = 'CC Browser';
			attrs = {
				data: process.env.SWF_URL + '/cc_browser.swf', // data: 'cc_browser.swf',
				type: 'application/x-shockwave-flash', id: 'ccbrowser', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'isEmbed': '0', 'ctc': 'go', 'tlang': 'en_US', 
					'storePath': process.env.STORE_URL + '/<store>', 
					'clientThemePath': process.env.CLIENT_URL + '/<client_theme>', 'appCode': 'go', 'siteId': 'school', 'st': '', 
					'userId': '0DyHqK6Yj9dM', 'ut': 23, 'uisa': 0, 'themeId': 'business', 
					'u_info_school': 'OjI6d1lZakM3SVUxak5YVU9rQWlueURFZ3ZTT1EwakFJYjczcGVCMzJTMiszcFYzVERQRDByQktlUElUTDlaeUdsSzJyRTZFZldHMVRXR1BtOTNwWm5vS2JscTFXTzVodndrVnpaRG9XNVppRU9pSnRpR3pnSEljPQ==',
				},

				allowScriptAccess: 'always',
				movie: process.env.SWF_URL + '/cc_browser.swf', // 'http://localhost/cc_browser.swf'
			};
			break;
		}
			
		case '/go_full': {
			let presave = query.movieId && query.movieId.startsWith('m') ? query.movieId :
				`m-${fUtil[query.noAutosave ? 'getNextFileId' : 'fillNextFileId']('movie-', '.xml')}`;
			title = 'Video Editor';
			attrs = {
				data: process.env.SWF_URL + '/go_full.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>', 'isEmbed': 1, 'ctc': 'go',
					'ut': 60, 'bs': 'default', 'appCode': 'go', 'page': '', 'siteId': 'go', 'lid': 13, 'isLogin': 'Y', 'retut': 1,
					'clientThemePath': process.env.CLIENT_URL + '/<client_theme>', 'themeId': 'business', 'tray': 'custom',
					'tlang': 'en_US',
					'presaveId': presave, 'goteam_draft_only': 1, 'isWide': 1, 'nextUrl': '/html/list.html',
				},
				allowScriptAccess: 'always',
			};
			sessions.set({ movieId: presave }, req);
			break;
		}

		case '/player': {
			title = 'Player';
			attrs = {
				data: process.env.SWF_URL + '/player.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>', 'ut': 60,
					'autostart': 1, 'isWide': 1, 'clientThemePath': process.env.CLIENT_URL + '/<client_theme>',
				},
				allowScriptAccess: 'always',
			};
			break;
		}

		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(`<script>document.title='${title}',flashvars=${JSON.stringify(params.flashvars)}</script><body style="margin:0px">${toObjectString(attrs, params)
		}</body>${stuff.pages[url.pathname] || ''}`);
	return true;
}
