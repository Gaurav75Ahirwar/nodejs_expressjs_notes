// Globals
-- **dirname
-- **filename
-- module
-- require
-- process

// Modules
-- Encapsulated Code(only share minimum)
-- Common JS, every file is a module(by default)
-- export(export onject) variables, datetypes and functions, and get using require( < path > ) in the file in which we want to import them
-- export the value using module.exports = { "Harry" } or directly setting the value using the . operator like module.exports.person = "Harry"
-- Built-in modules - OS, PATH, fs (FileSystem), HTTP
e.g. require('os'), require('path'), require('fs'), require('http')
-- os - fetching user info etc
-- PATH - path info etc
-- fs - create, read and write in file etc
-- HTTP - createServer((req, res) => {}) - res.write(), res.end() ; server.listen() ; req.url ;

-- Sync code and async code difference and impact - Callback hell

// npm - node package manager
-- Usefull libraries and functions
-- modules & dependencies - sharable JS code that can be used
-- modules can also contain bugs, so its better to look at the weekly downloads of that package
-- local dependency - use it only in a particular project - npm install <packagename>
-- global dependency - use it in any project - npm install -g <packagename>
-- npm commands ; npx command
-- package.json - manifest file(stores important info about project/package) - manual approach(create package.json in the root, create properties etc) or npm init(step by step process) or npm init -y(everything default)
