const fs = require("fs");
const path = require("path");
//const cmd = require("node-cmd");
//node_modules\react-scripts\config\webpack.config.js

let watcherObj = path.join(__dirname, "./src/rust");
try {
	let status = false;
	let statusTimeout;
	let myWatcher = fs.watch(watcherObj, { encoding: "utf8", recursive: true }, (event, filename) => {
		//console.log(event);
	});
	myWatcher.on("change", function (err, filename) {
		if (filename.indexOf(".rs") > -1) {
			if (!status) {
				status = true;
				//cmd.run("npm run wasm");
				statusTimeout = setTimeout(() => {
					status = false;
					clearTimeout(statusTimeout);
				}, 5000);
			}
		}
	});
} catch (error) {
	//console.log("err");
}

module.exports = function override(config, env) {
	const wasmExtensionRegExp = /\.wasm$/;

	let ext = config.resolve.extensions;
	config.resolve.extensions = ext.concat([".ts", ".tsx", ".wasm", ".css"]);
	config.resolve.plugins.splice(1, 1);

	config.module.rules.forEach((rule) => {
		(rule.use || []).forEach((use) => {
			if (use.options && use.options.useEslintrc !== undefined) {
				use.options.useEslintrc = true;
			}
		});
		(rule.oneOf || []).forEach((oneOf) => {
			if (oneOf.options && oneOf.options.babelrc !== undefined) {
				oneOf.options.babelrc = true;
			}
			if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
				// Make file-loader ignore WASM files
				oneOf.exclude.push(wasmExtensionRegExp);
			}
		});
	});

	// Add a dedicated loader for WASM
	config.module.rules.push({
		test: wasmExtensionRegExp,
		include: path.resolve(__dirname, "src"),
		use: [{ loader: require.resolve("wasm-loader"), options: {} }],
	});

	config.optimization.splitChunks.minSize = 500000;
	config.optimization.splitChunks.maxSize = 1000000;

	return config;
};
