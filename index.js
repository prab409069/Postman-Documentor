const fs=require('fs');
var generatePdf=require("./pdfgenerator.js");
module.exports=function filereader(filepath) 
{
	console.log("Creating documentation......");
	fs.readFile(filepath, 'utf-8', (err, data) => 
	{
		if(err)
		{
			console.log(err);
		}
		let jsonData=JSON.parse(data);
		let collection_name=jsonData.info.name;
		let collection_desc=jsonData.info.description;
		let allrequests=[];
		jsonData.item.forEach(subelem=> 
	    {
	    	if(subelem.item)
	    	{
			    subelem.item.forEach(reqitem=> 
			    {
			    	let req_name=reqitem.name;
			    	let req_method=reqitem.request.method;
			    	var req_headers=[];
			    	var req_auth=[];
			    	reqitem.request.header.forEach(headeritem=>
			    	{
			    		let header_key=headeritem.key;
			    		let header_val=headeritem.value;
			    		let header_obj=
			    		{
			    			key:header_key,
			    			value:header_val
			    		}
			    		req_headers.push(header_obj);
			    	});
			    	if(reqitem.request.auth)
			    	{
				    	var auth_type=reqitem.request.auth.type;
				    	reqitem.request.auth[auth_type].forEach(authitem=>
				    	{
				    		let auth_key=authitem.key;
				    		let auth_val=authitem.value;
				    		let auth_type=authitem.type;
				    		let auth_obj=
				    		{
				    			key:auth_key,
				    			value:auth_val,
				    			type:auth_type
				    		}
				    		req_auth.push(auth_obj);
				    	});
			    	}
			    	var req_body;
			    	if(reqitem.request.body)
			    	{
				    	let body_mode=reqitem.request.body.mode;	
				    	req_body=reqitem.request.body[body_mode];
		    		}
		    		let req_url=reqitem.request.url.raw;
		    		let req_desc=reqitem.request.description;
		    		let req_obj=
		    		{
		    			name:req_name,
		    			header:req_headers,
		    			auth:req_auth,
		    			method:req_method,
		    			body:req_body,
		    			url:req_url,
		    			desc:req_desc
		    		};
		    		allrequests.push(req_obj);
			    });	
		    }	    	                                                            
		});
		var html=
		"<html><body style='background-color:#f5f5f5'><h1 style='text-align: center;'><span>"+
		"<u>"+collection_name+" Documentation </u></span></h1><p style='font-size:23px'>"+collection_desc+"</p>";
	    allrequests.forEach(reqitem=>
	    {
	    	if(reqitem.desc==undefined)
	    	{
	    		var desc="-";
	    	}
	    	else
	    	{
	    		var desc=reqitem.desc;
	    	}
	    	if(reqitem.body==undefined)
	    	{
	    		var body="-";
	    	}
	    	else
	    	{
	    		var body=reqitem.body;
			}
			var header_html="";

			reqitem.header.forEach(elem=> 
			{
				let sub="<p><span style='font-size: 21px;'>&quot;"+elem.key+"&quot; : &quot;"+elem.value+"&quot;,</span></p>";
				header_html+=sub;			
			});
			if(reqitem.auth.length>0)
			{
				var auth_html="<p style='font-size: 23px;'><strong>Auth :&nbsp;</strong></p>";						
				reqitem.auth.forEach(elem=> 
				{
					let sub="<p><span style='font-size: 21px;'>key : "+elem.key+", value : "+elem.value+", type : "+elem.type+"</span></p>";
					auth_html+=sub;			
				});
			}
			else
			{
				var auth_html="";
			}
			let subhtml="<h2><strong><span style='color: rgb(226, 80, 65);'>"+
			"Request Name - "+reqitem.name+"</span></strong></h2>"+
			"<h2><strong>"+desc+"</strong></h2>"+
			"<p style='font-size: 23px;'><strong>URL :&nbsp;</strong>"+reqitem.url+"</p>"+
			"<p style='font-size: 23px;'><strong>Method :&nbsp;</strong> "+reqitem.method+"</p>"+
			"<p style='font-size: 23px;'><strong>Headers :&nbsp;</strong></p>"+
			header_html+auth_html+"<p style='font-size: 23px;'><strong>Body :&nbsp;</strong></p>"+
			"<p style='font-size: 23px;'>"+body+"</p>"+
			"<p><p><br></p><hr>";
			html+=subhtml;
	    });
	    html+="</body></html>"
	    generatePdf(html,"documentation.pdf");
	});
	console.log("Finished creating documentation......");
};
