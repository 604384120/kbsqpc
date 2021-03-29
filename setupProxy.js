const proxy = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		proxy("/local", {
			// target: "http://beta.kaibanshenqi.net/",
			// target: "http://alpha.kaibanshenqi.net/",
			target: "http://gamma.kaibanshenqi.net/",
			//target: "http://192.168.128.1:20010",
			secure: true,
			changeOrigin: true,
			pathRewrite: {
				"^/local": "/",
			},
			//cookieDomainRewrite: "http://localhost:3000"
		})
	);
};
