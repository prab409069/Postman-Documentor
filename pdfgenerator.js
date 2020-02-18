var fs=require('fs');
var pdf=require('html-pdf');
module.exports=function pdfgen(html, file) 
{
	let filepath="./output/"+file;
	var options = 
	{ 
		format: 'A4',
		"border": "20px",
		"footer": 
		{
		    "height": "5mm",
		    "contents": '<div style="text-align: center">Created Via - Postman Documentor , Author - Prabhjot Singh Kainth</div>'
		}   
	};
	pdf.create(html, options).toFile(filepath, function(err, res) {
	  if (err) return console.log(err);
	  console.log(res);
	});
};