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
e.g. require('os');
-- os - fetching user info etc
-- PATH - path info etc
-- fs - create, read and write in file etc

-- Sync code and async code difference and impact - Callback hell
