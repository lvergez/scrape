var table = new Array();
var array=new Array();
var lab;
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) return i;
        }
        return -1;
    };
}
function asyncLoop(arr, obj, fn, fend){
	var i=1, step=20; 
	var floop = function () {
		var b = step;
		while ((i<arr.length) && (b>0)) {
			fn.call(arr[i]);		
			i++; b--;
		}
		if (i<arr.length) setTimeout(floop, 1)
		else if (fend) fend.call();
	}
	setTimeout(floop, 1);
}

function populateSelect(){
	var colspan=document.getElementById("fltbl").innerHTML.substr(document.getElementById("fltbl").innerHTML.toLowerCase().indexOf("colspan")+8,2).match(/\d/);
	lab="";
	for(var l=0;l<3;l++){
	try{
		var label=document.getElementById("flHead").getElementsByTagName("th").item(l).innerHTML.substring(3);
		label=label.substring(0,label.length-4);
		lab=lab+label+"^";
	}
	catch(err){}
	}
	if (document.getElementById('ctrl').innerHTML.indexOf("tbody")>=0)	var control=document.getElementById('ctrl').innerHTML.split("tbody")[0];
	else	var control=document.getElementById('ctrl').innerHTML.split("TBODY")[0];
	
	control=control+'tbody>'+"\n"+'<tr style="background-color: #E4E9ED;"><td><input type="text" id="0" maxlength="5" title="'+lab.split('^')[0]+'" name="'+lab.split('^')[0]+'" class="input" onKeyUp="filter();"></td>'+"\n"+'<td><input type="text" id="1" title="'+lab.split('^')[1]+'" name="'+lab.split('^')[1]+'" maxlength="7" class="input" onKeyUp="filter();"></td>'+"\n"+'<td id="select"><span id="selSpan" class="selLoad"></span><select></select></td>'+"\n"+'<td></td>'+"\n"+'<td colspan="'+(colspan-3)+'">&nbsp;</td></tr>'+"\n"+'</tbody>'+"\n"+'</table>';
	
	document.getElementById('ctrl').innerHTML=control;
	document.getElementById('fltbl').style.top="61px";
	var i=0;
	var h=getHour()+":";
	var scr=true;
	var scrTop=250;
	asyncLoop($("tr"), null, function(){ 	
		table[i]=new Array();
		var j=0;
		$(this).find('td').each(function(){
			var html=this.innerHTML;
			if (scr &&j==0&& html.indexOf(h)==0){
				scr=false;
				scrTop=this.parentNode.offsetTop;
			}
			table[i][j]=html;
			j++;
		});
		i++;
	}, function(){
		var index = 2;
		var s = new Array('<span id="selSpan" class="select">&nbsp;</span><select id="'+index+'" title="'+lab.split('^')[2]+'" name="'+lab.split('^')[2]+'" onChange="filter();"><option value=""></option>');
		var seloptions = new Array(); 	
		for (var j=1;j<table.length;j++){
			if (seloptions.indexOf(table[j][2])<0&&table[j].length>4)	seloptions.push(table[j][2]);
		} 	
		seloptions.sort();
		for(var i=0;i<seloptions.length;i++)
			s.push('<option value="'+seloptions[i]+'">'+seloptions[i]+'</option>');
		s.push("</select>");
		
		document.getElementById("select").innerHTML=s.join("\n");		
		if (document.cookie.indexOf(lab)>=0){
			var vals=document.cookie.substring(document.cookie.indexOf(lab))
			vals=vals.substring(0,vals.indexOf(";"));
			if (vals.indexOf("autorefresh")>=0){
			document.getElementById("4").checked=true;
			setTimeout("autoRefresh()",120000);
			}
		}
		document.getElementById("fltbl").scrollTop=scrTop-150;
		if (document.cookie.indexOf(lab)>=0){
			var string=document.cookie.substring(document.cookie.indexOf(lab)+lab.length+1);
			string=string.substr(0,string.indexOf(':'));
			if(string.length>0){
				document.getElementById(0).value=string.split("^")[0]
				document.getElementById(1).value=string.split("^")[1];
				var sel=document.getElementById(2);
				for (var i =0; i<sel.length-1;i++){
					if (sel.options[i].value==string.split("^")[2].split(":")[0]){
						sel.options[i].selected=true;
						i=sel.length;
					}
				}
				filter();
			}
		}
	});
}

function filter(){
	var html=document.getElementById("fltbl").innerHTML;
	var colspan=html.substr(html.toLowerCase().indexOf("colspan")+8,2).match(/\d/);
	var odd=true;
	array=new Array();
		if (html.indexOf("\<tr")>0)
		var tablestr=html.split("\<tr")[0];
	else
		var tablestr=html.split("\<TR")[0];
	
	for(var l=0;l<3;l++){
	try{
		var value=document.getElementById(l).value;
		array.push(value);
		}
	catch(err){}
	}
	var steps=20;
	var b=steps;
	var abuf=[tablestr];
	for (var i =1; i<table.length;i++){
		if (table[i].length==1){
			abuf.push('<tr class="dt"><td colspan="'+colspan+'">')
			abuf.push(table[i][0]);
			abuf.push('</td></tr>')
		} else{
			if((array[0]==""||table[i][0].indexOf(array[0])==0)&&(array[1]==""||table[i][1].indexOf(array[1].toUpperCase())>=0)&&(array[2]==""||table[i][2].indexOf(array[2])>=0)){
				if (odd){
					abuf.push('<tr class="odd">');
					odd=false;
				}else{
					abuf.push("<tr>");
					odd=true;}
				for (var j =0; j<(table[i].length);j++){
					abuf.push("<td");
					if (j==4||j==table[i].length-2)
					abuf.push(' class="right"');
					if (j==table[i].length-1)
					abuf.push(' class="track"');
					abuf.push(">"); abuf.push(table[i][j]); abuf.push("</td>");
				}
				abuf.push("</tr>");
			}
		}
		b--;
		if (b==0){
			b=steps;
			setTimeout("", 1);
		}
	}
	abuf.push("</tbody></table>");
	document.getElementById("fltbl").innerHTML=abuf.join('');
	var sel=document.getElementById("2");

	document.getElementById("selSpan").innerHTML=sel.options[sel.selectedIndex].value;
	setTimeout("gaevent();",3000);
}
function cookie(val){
	var autorefresh="";
	if (document.getElementById("4").checked) 	 autorefresh="autorefresh";
	else 	autorefresh="off";
	var str=lab+"="+val+":"+autorefresh;
	document.cookie=str;
}
function pageRefresh(){
	window.location.reload();
}
function autoRefresh(){
	gaevent();
	setTimeout("if(document.getElementById('4').checked)pageRefresh();",1000);
}
function showTT(){
	document.getElementById("tooltip").style.display="block";
}
function hideTT(){
	document.getElementById("tooltip").style.display="none";
}
function getHour(){
	var now=new Date();
	var start, end, h;
	for (var i=25;i<32;i++){
		var d= new Date(now.getFullYear(),2,i,1,0,0,0);
		if (d.getDay()==0)		start=d;
		d= new Date(now.getFullYear(),9,i,1,0,0,0);
		if (d.getDay()==0)		end=d;
	}
	var timezone=1;
	if (now.getTime()>=start && now<end)	timezone++;
	h=now.getUTCHours()+timezone
	if (h>9)	return h;
	else	return "0"+h;
}
function gaevent(){
	var s=document.cookie.substring(document.cookie.indexOf(lab)+lab.length+1);
	var val=array.join('^');
	if ((val!='^^') && (s.indexOf(val)!=0) && parent.gaEvent ){
		parent.gaEvent(lab, val);
	}
	cookie(val);
}
