const path = require("path");

module.exports = {
	entry: "./src/index.js", // Sesuaikan dengan file utama proyek
	output: {
		path: path.resolve(__dirname, "dist"), // Folder output
		filename: "bundle.js",
		library: "vixora", // Nama library
		libraryTarget: "umd", // Format agar bisa digunakan di browser & Node.js
		globalObject: "this",
	},
	mode: "production", // Gunakan "development" jika masih debugging
};
