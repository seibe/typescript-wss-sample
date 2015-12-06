/// <reference path="typings/tsd.d.ts" />
import https = require("https");
import fs = require("fs");
import ws = require("ws");

interface MainOptions {
	port:number;
	sslKey:string;
	sslCert:string;
}

class Main
{
	constructor(options:MainOptions)
	{
		let app = https.createServer({
			key: fs.readFileSync(options.sslKey),
			cert: fs.readFileSync(options.sslCert)
		}, (req, res) => {
			res.writeHead(200);
			res.end("All glory to WebSockets!\n");
		}).listen(options.port);
		
		let wss = new ws.Server({
			server: <any>app
		});
		wss.on("connection", (wsConnect) => {
			console.log("open");
			wsConnect.on("message", (message) => {
				console.log(message);
			});
			wsConnect.on("close", () => {
				console.log("close");
			})
		});
		
		console.log("listening " + options.port.toString());
	}
}

let main = new Main({
	port: 8082,
	sslKey: "/etc/letsencrypt/live/example.com/privkey.pem",
	sslCert: "/etc/letsencrypt/live/example.com/cert.pem"
});
