import express from "express"
import path from "path"
import parseUrl from "parseurl";
import session from "express-session"
import config from "~/config.json"

// fix the running dir
process.chdir(path.resolve(path.dirname(__filename)));

const app = express();

app.use(session({
	secret: '-this-is-my-secret-session-key-',
	resave: true,
	saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// public is visible by everybody
app.use("/public", express.static(path.join(__dirname, 'public')));

// main index: serve client files
app.use((req, res, next) => {

	// check that we have only GET or HEAD requests
	if (req.method !== 'GET' && req.method !== 'HEAD') {
		// method not allowed
		res.statusCode = 405
		res.setHeader('Allow', 'GET, HEAD')
		res.setHeader('Content-Length', '0')
		res.end()
		return;
	}

	const originalUrl = parseUrl.original(req)
	let pth = parseUrl(req).pathname

	// make sure redirect occurs at mount
	if (pth === '/' ) {
		pth = 'index.html'
	}

	const fname = path.join(__dirname, "../client", pth );
	res.sendFile(fname, { maxAge: 300 }, (err) => {
		if( err ) {
			if( (err as any).statusCode==404 ) {
				console.error("404:", req.url)
				res.status(404).end();
			}
			else {
				next( err );
			}
		}
	});
});

app.use((err: any, req, res: express.Response, next) => {
	console.error(err.stack);
	res.status(500).send('Internal serveur error');
})

app.listen(config.SERVER_PORT ?? 80, config.SERVER_HOST ?? "127.0.0.1", () => {
	process.stdout.write(`Server running in ${__dirname}\n`);
	process.stdout.write(`Server running on http://${config.SERVER_HOST ?? 80}:${config.SERVER_PORT}\n`,)
});





