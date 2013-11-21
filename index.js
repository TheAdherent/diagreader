var fs = require('fs')
var unzip = require('unzip')
var concat = require('concat-stream')
var basename = require('path').basename

var filename = "./DroboDiag_DRB123401900000_20131118-000000.zip"

var filesToPayAttentionTo = /^vx.*/
var stringsWeCareAbout = ['USB reset', "something that isn't in there", 'Test']

fs.createReadStream(filename)
  .pipe(unzip.Parse())
  .on('entry', forEveryEntryInZipFile)

function forEveryEntryInZipFile(entry) {
	var filename = basename(entry.path)

	if (filesToPayAttentionTo.test(filename)) {
		var write = concat(function(contents) {
			countNumberOfInputsFoundInString(contents, filename)
		})
		entry.setEncoding('utf8')
		entry.pipe(write)
	}
}

function countNumberOfInputsFoundInString(contents, filename) {
	var stringsFound = {}

	stringsWeCareAbout.forEach(function(stringToSearchFor) {
		var searchRegex = new RegExp(stringToSearchFor, "g")

		stringsFound[stringToSearchFor] = 0

		while (searchRegex.test(contents)) {
			stringsFound[stringToSearchFor] = stringsFound[stringToSearchFor] + 1
		}
	})
	prettyPrint(stringsFound, filename)
}

function prettyPrint(wordCounts, filename) {
	console.log("----------------------")
	console.log("Found in " + filename)
	console.log("======================")
	Object.keys(wordCounts).map(function(word) {
		return { word: word, count: wordCounts[word] }
	}).filter(function(countObject) {
		return countObject.count > 0
	}).forEach(function(countObject) {
		console.log("Found " + countObject.count + " of " + countObject.word)
	})
}