const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	mode: "development",
	devServer: {
		historyApiFallback: true,
		static: "./dist",
		hot: true,
		port: 3000,
		open: false,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
		}),
	],
};
