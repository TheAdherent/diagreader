var fs = require('fs')
var unzip = require('unzip')
var concat = require('concat-stream')

var filename = "./DroboDiag_DRB123401900000_20131118-000000.zip"

fs.createReadStream(filename)
  .pipe(unzip.Parse())
  .on('entry', function (entry) {

	var write = concat(function(contents){

		console.log(typeof contents, "\n")
		if (typeof contents === string){
			console.log(contents)
		}

	})
})

	// entry.setEncoding('utf8')



	// entry.pipe(write)
 //    var filepath = entry.path;
