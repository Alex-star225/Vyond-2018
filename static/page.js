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
			
                case '/charactercreator/': {
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
			
		case '/videomaker/full/': {
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

		case '/videos/': {
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
	res.end(`
	<head>
		<script>
			document.title='${title}',flashvars=${JSON.stringify(params.flashvars)}
		</script> 
                <script src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/js/common_combined.js.gz.js"></script>
                <script type="text/javascript" src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/js/../po/goserver_js-en_US.json.gz.json"></script>

                <script src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/js/jquery/jquery-ui-1.9.2.custom-core-interactions.min.js.gz.js"></script>
                <script src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/js/jquery/jquery.tmpl.min.js.gz.js"></script>
                <script src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/js/trial_upsell.js.gz.js"></script>
                <script src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/js/lib/moment.min.js.gz.js"></script>
                <script src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/js/sessionChecker.js.gz.js"></script>
                <script src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/js/amplitude/go_amp.js.gz.js"></script>
		<link href="https://josephcrosmanplays532.github.io/fonts/1/sailec.css" rel="stylesheet" type="text/css">
                <link href="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/css/common_combined.css.gz.css" rel="stylesheet" type="text/css">

                <link href="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/css/watermark.css.gz.css" rel="stylesheet" type="text/css">
                <link href="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/css/video.css.gz.css" rel="stylesheet" type="text/css">
                <link href="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/css/studio.css.gz.css" rel="stylesheet" type="text/css">
                <link href="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/css/video_export.css.gz.css" rel="stylesheet" type="text/css">
                <link href="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/css/vm5_alpha/banner.css.gz.css" rel="stylesheet" type="text/css">
		<style>
                table {
			width: 100%;
			max-width: 100%;
			margin-bottom: 0px;
			margin-right: auto;
			margin-left: auto;
			margin-top: 0px;
			background-color: transparent;
			border-collapse: collapse;
			border-spacing: 0;
			font-size: 14px;
		}

		@media(min-width: 768px) {
			table {
				width: 750px;
			}
		}

		@media(min-width: 992px) {
			table {
				width: 970px;
			}
		}

		@media(min-width: 400px) {
			table {
				width: 750px;
			}
		}

		thead {
			font-weight: 200;
		}

		td {
			padding: 8px;
			vertical-align: middle;
			line-height: 1.42857143;
		}

		thead {
			border-bottom: 2px solid #ddd;
			border-top: 1px solid #ddd;
		}

		tbody>tr {
			border-top: 0;
			border-bottom: 1px solid #ddd;
		}

		tbody>tr:hover {
			background-color: #f5f5f5;
		}

		tr>:nth-child(1) {
			width: 64px;
		}

		tr>:nth-child(1)>img {
			height: 36px;
		}

		tr>:nth-child(1) {
			word-break: break-word;
		}

		tr>:nth-child(2) {
			color: #999;
		}

		tr>:nth-child(3) {
			width: 250px;
		}

		tr>:nth-child(3)>* {
			display: inline-block;
			text-align: center;
			font-size: 12px;
			width: 8.5px;
		}

		tr>:nth-child(4) {
			font-family: 'GlyphiconsRegular';
			text-decoration: none;
			padding-top: 5px;
			font-size: 14px;
			width: 80px;
		}

		tr>:nth-child(4)>a {
			display: inline-block;
			text-decoration: none;
			padding-right: 10px;
			color: #474747;
		}

		tr>:nth-child(4)>a:hover {
			color: #2d9e88;
		}

		tr>:nth-child(4)>:nth-child(1)::before {
			content: '\E174';
		}

		tr>:nth-child(4)>:nth-child(2)::before {
			content: '\E235';
		}

		tr>:nth-child(4)>:nth-child(3)::before {
			content: '\E182';
		}

		tfoot>tr>td {
			text-align: center;
			border: none;
		}

		tfoot>tr>td>a {
			text-decoration: none;
			color: #474747;
			font-size: 14px;
		}
		@font-face {
			font-family: 'Sailec';
			font-weight: 100;
			src: url('/html/Sailec-Thin.woff') format('woff');
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 200;
			src: url('/html/Sailec-Light.woff') format('woff');
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 400;
			src: url('/html/Sailec-Regular.woff') format('woff');
		}

		@font-face {
			font-family: 'Sailec';
			font-weight: 500;
			src: url('/html/Sailec-Medium.woff') format('woff');
		}

		/* font weight 500 and font weight 700 (bold) are the same for better integration support */
		@font-face {
			font-family: 'Sailec';
			font-weight: 700;
			src: url('/html/Sailec-Medium.woff') format('woff');
		}

		@font-face {
			font-family: 'GlyphiconsRegular';
			src: url('/html/glyphicons-regular.woff') format('woff');
			font-weight: normal;
			font-style: normal;
		}
        </style>
	</head>
<header>
<div class="page-container">


<div class="site-header">
    <div class="navbar site-nav site-nav--legacy" role="navigation">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="/yourvideos" title="Vyond">
                      <img alt="Vyond" src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/img/vyond/vyond_logo_legacy.png">
                  </a>
            </div>

            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="nav navbar-nav navbar-right">
<li class="dropdown">
    <a class="dropdown-toggle" href="https://support.vyond.com" data-toggle="dropdown">Help<span class="dropdown-caret"></span></a>
    <ul class="dropdown-menu dropdown-menu-help">

        <li>
            <a href="#" onclick="zE.activate({hideOnClose: true});amplitudeTrackCtaHelp('quick_search');return false;">Quick Search</a>
        </li>
        <li>
            <a href="https://support.vyond.com" onclick="amplitudeTrackCtaHelp('help_center');" target="_blank">Help Center</a>
        </li>
        <li>
            <a href="https://josephcrosmanplays532.github.io/whatsnew" onclick="amplitudeTrackCtaHelp('whats_new');" target="_blank">What’s New</a>
        </li>
    </ul>
</li>

<script>
    $('.dropdown-menu-help').click(function(e) {
        e.stopPropagation();
    });
</script>
		    <li>
                        <a class="hidden-sm hidden-md hidden-lg" href="/videomaker">Make a Video</a>
                        <span class="site-nav-btn hidden-xs"><a class="btn btn-orange" href="/videomaker">Make a Video</a></span>
                    </li>
<li class="dropdown">
    <a class="dropdown-toggle" href="https://app.vyond.com/v2/profile" data-toggle="dropdown">
        <span class="hidden-sm hidden-md hidden-lg">Your Account</span>
        <div class="site-nav__profile-image">
            <div class="badge-circle">JA</div>
        </div><span class="dropdown-caret"></span>
    </a>
    <ul class="dropdown-menu dropdown-menu-user">
        <li class="dropdown-user-profile">
            <div class="dropdown-user-profile__display-name">
                Joseph Animate 2021 (Owner)            </div>
            <div class="dropdown-user-profile__status">
                Free trial | <a href="https://www.vyond.com/pricing">Upgrade now</a>            </div>
        </li>
        <li class="divider"></li>
        <li><a href="/profile/you.html">Profile Settings</a></li>
        <li><a href="https://app.vyond.com/v2/users/list">Users</a></li>
        <li><a href="https://app.vyond.com/v2/security">Security</a></li>
        <li><a href="https://app.vyond.com/v2/subscription">Subscription</a></li>
        <li class="divider"></li>
        <li><a href="https://app.vyond.com/video/list" onClick="amplitudeTrackSwitchVideoMaker('Go to Vyond Studio')">Go to Vyond Studio</a></li>
        <li class="divider"></li>
        <li><a class="gtm-logout" href="https://ga.vyond.com/logoff">Log Out</a></li>
    </ul>
</li>
</header>

	<body style="margin:0px">${toObjectString(attrs, params)
		}</body>${stuff.pages[url.pathname] || ''}`);
	return true;
}
