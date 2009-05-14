/* jsyn - ultralight syntax highlighter; Jim Palmer - jimpalmer@gmail.com; released under MIT License */
var nodes = document.getElementsByTagName('pre'), jsyn = function () {
	for (var node in nodes) {
		var n = nodes[node], newPre = document.createElement('pre');
		// only pre.code
		if ((n.className || '' ).indexOf('code') < 0) continue;
		// define syntax def types for tokenization
		var ext = new Date(), types = { web:{
				k:'break,case,catch,class,continue,delete,do,else,for,function,if,in,instanceof,new,private,protected,public,return,switch,throw,throw,try,typeof,var,watch,while',
				d:'array,bool,boolean,date,datetime,decimal,false,float,hashtable,int,int32,nan,null,string,true',
				c:/(?:\/\*(.|[\n\r])*?\*\/)|(?:\/\/[^\n\r]+[\n\r])|(?:<![-]{2,3}([\s\S](?!>))+[-]{2,3}>)/
			},sql:{
				k:'alter,begin,by,commit,create,delete,drop,exec,from,group,having,insert,join,like,on,order,rollback,select,set,table,transaction,trigger,truncate,union,update,values,where',
				d:'and,asc,between,desc,distinct,exists,inner,left,or,outer,right,top',
				c:/(?:\/\*(.|[\n\r])*?\*\/)|(?:--[^\n\r]+[\n\r])/
			}}, ct = types.web, dtab = 8, tabs = parseInt((n.className.match(/tab([0-9]+)/) || [])[1]) || dtab;
		// find extra type definitions - otherwise use default web
		for (var ty in types ) if (n.className.indexOf(types[ty]) >= 0) { ct = types[ty]; break; }
		// build the tokenizing regexp
		for (var os = [], r = [{c:'c',r:ct.c},	// comments
					{c:'s',r:/(?:\/\S+\/)|(?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*")/}, // regexp,strings
					{c:'n',r:/(?:\d+\.?\d*[%]?)/}, // numbers
					{c:'k',r:(new RegExp('(?:'+ ct.k.split(',').join('\\s)|(?:') +')'))}, // keywords
					{c:'d',r:(new RegExp('(?:'+ ct.d.split(',').join('\\s)|(?:') +')'))}, // datatypes
					{c:'w',r:/(?:[A-Za-z_-]\w*)/}, // word (variables)
					{c:'f',r:/(?:[\[\]\(\)\{\}:]+)/}, // flow operators
					{c:'t',r:(new RegExp(( tabs == dtab ? '' : '(?:\t)' )))} // reformatted tabs
				],is = n.firstChild.nodeValue,re = '',rec = 0,rel = r.length; rec < rel; rec++ ) {
			re += ( ( re && r[rec].r.source ) ? '|' : '' ) + r[rec].r.source;
		}
		// wrap each token with appropriate type for colorization - using low-footprint inline element
		for (var t = new RegExp(re,'gmi'),pi = 0,a = true,c = 0,of = 0,sl = is.length; c < sl && (a = t.exec(is)); c++) {
			for (rec = 0; rec < rel; rec++) {
				if (r[rec].r.source && r[rec].r.test(a[0])) {
					if (tabs != dtab && r[rec].c == 't')
						var mp = t.lastIndex - a[0].length - 1,
							rn = Math.max(is.lastIndexOf('\r', mp), is.lastIndexOf('\n', mp))
							to = tabs - ( ( mp - Math.max(is.lastIndexOf('\t', mp), rn) ) % tabs );
					// innerHTML method
					os.push( is.substring(pi,(t.lastIndex - a[0].length)).replace(/</g,'&lt;').replace(/>/g,'&gt;') +
						'<b class="'+ r[rec].c + ( r[rec].c == 't' && parseInt(to) != tabs ? to : '') +'">'+
						a[0].replace(/</g,'&lt;').replace(/>/g,'&gt;') +'</b>' );
/*
*/
/*
					// DOM method
					var nBlock = document.createElement('b');
					nBlock.className = r[rec].c + ( r[rec].c == 't' && parseInt(to) != tabs ? to : '');
					nBlock.appendChild(document.createTextNode(a[0]));
					newPre.appendChild(document.createTextNode(is.substring(pi,(t.lastIndex - a[0].length))));
					newPre.appendChild(nBlock);
*/
					pi = t.lastIndex;
					break;
				}
			}
		}
		// pre needed to render in IE6
		n.innerHTML = (/msie/i.test(navigator.userAgent) ? '<pre>':'') + os.join('') + is.substring(pi,is.length) + ((new Date()).getTime() - ext.getTime()) +'ms'+(/msie/i.test(navigator.userAgent) ? '</pre>':'');
/*
		// DOM methods
		n.removeChild(n.firstChild);
		n.appendChild(newPre);
		n.appendChild(document.createTextNode(is.substring(pi,is.length) + ((new Date()).getTime() - ext.getTime()) +'ms'));
*/
	}
};
$(jsyn);