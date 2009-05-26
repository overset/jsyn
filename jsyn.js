/* jsyn - ultralight syntax highlighter; Jim Palmer - jimpalmer@gmail.com; released under MIT License */
var nodes = document.getElementsByTagName('pre'), jsyn = function () {
	for (var node in nodes) {
		var n = nodes[node],cnc = 0,cnl = ( n.childNodes != null ? n.childNodes.length : 0 ),is = n.nodeValue || '';
		if ((n.className || '' ).indexOf('code') < 0) continue; // limit to 'pre.code' selector
		for (;cnc < cnl; cnc++) is += n.childNodes.item(cnc).nodeValue; // capture all the content in the 'pre.code'
		var ext = new Date(),dtab = 8,tabs = parseInt((n.className.match(/tab([0-9]+)/) || [])[1]) || dtab,os = [],
			rec = 0,re = [],pi = 0,a = true,c = 0,of = 0,sl = is.length,newPre = document.createElement('pre'),
			/* language definitions */
			types = { common:{
				k:'break,case,catch,class,continue,delete,do,else,for,function,if,in,instanceof,new,private,protected,public,return,switch,throw,throw,try,typeof,var,watch,while',
				d:'array,bool,boolean,date,datetime,decimal,false,float,hashtable,int,int32,nan,null,string,true',
				c:/(?:\/\*(.|[\n\r])*?\*\/)|(?:\/\/[^\n\r]+[\n\r])|(?:<![-]{2,3}([\s\S](?!>))+[-]{2,3}>)/
			}, sql:{
				k:'alter,begin,by,commit,create,delete,drop,exec,from,group,having,insert,join,like,on,order,rollback,select,set,table,transaction,trigger,truncate,union,update,values,where',
				d:'and,asc,between,desc,distinct,exists,inner,left,or,outer,right,top',
				c:/(?:\/\*(.|[\n\r])*?\*\/)|(?:--[^\n\r]+[\n\r])/
			}},ct = types.common,
			/* token definitions */
			r = [{c:'c',r:ct.c}, // comments
				{c:'s',r:/(?:\/\S+\/)|(?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*")/}, // regexp,strings
				{c:'n',r:/(?:\d+\.?\d*[%]?)/}, // numbers
				{c:'k',r:(new RegExp('(?:'+ ct.k.split(',').join('\\s)|(?:') +')'))}, // keywords
				{c:'d',r:(new RegExp('(?:'+ ct.d.split(',').join('\\s)|(?:') +')'))}, // datatypes
				{c:'w',r:/(?:[A-Za-z_-]\w*)/}, // word (variables)
				{c:'f',r:/(?:[\[\]\(\)\{\}:]+)/}, // flow operators
				{c:'t',r:(new RegExp(( tabs == dtab ? '' : '(?:\t)' )))} // reformatted tabs
				],rel = r.length;
		// find first language definition in className - otherwise default to 'common'
		for (var ty in types) if (n.className.indexOf(types[ty]) >= 0) { ct = types[ty]; break; }
		// build the tokenizing regexp
		for (;rec < rel;rec++) re.push( ( ( rec && r[rec].r.source ) ? '|' : '' ) + r[rec].r.source );
		for (var t = new RegExp(re.join(''),'gmi'); c < sl && (a = t.exec(is)); c++) // iterate rexexp.exec tokens
			for (rec = 0; rec < rel; rec++) // loop through each regexp type to match on token
				if (r[rec].r.source && r[rec].r.test(a[0])) { // modify token if matched on any regexp 
					// tab manipulation if not default
					if (tabs != dtab && r[rec].c == 't')
						var mp = t.lastIndex - a[0].length - 1,
							rn = Math.max(is.lastIndexOf('\r', mp), is.lastIndexOf('\n', mp))
							to = tabs - ( ( mp - Math.max(is.lastIndexOf('\t', mp), rn) ) % tabs );
					// innerHTML method - wrap found token in appropriately matched regexp type
					os.push( is.substring(pi,(t.lastIndex - a[0].length)).replace(/</g,'&lt;').replace(/>/g,'&gt;') +
						'<b class="'+ r[rec].c + ( r[rec].c == 't' && parseInt(to) != tabs ? to : '') +'">'+
						a[0].replace(/</g,'&lt;').replace(/>/g,'&gt;') +'</b>' );
					pi = t.lastIndex;
					break;
				}
		// update the newly build innerhtml (pre needed to render in IE6 properly)
		n.innerHTML = (/msie/i.test(navigator.userAgent) ? '<pre>' : '') + os.join('') + is.substring(pi,sl) + ((new Date()).getTime() - ext.getTime()) +'ms'+ (/msie/i.test(navigator.userAgent) ? '</pre>' : '');
	}
};
// still tied to jquery document ready for now
$(jsyn);