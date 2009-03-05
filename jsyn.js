/* jsyn - ultralight syntax highlighter; Jim Palmer - jimpalmer@gmail.com; released under MIT License */
$(document).ready(function () {
	$('pre.code').each(function () {
		var ext = new Date(),typ=this.className.split(' ').pop(),typs = { web:{
				k:'break,case,catch,class,continue,delete,do,else,for,function,if,in,instanceof,new,'+
					'private,protected,public,return,switch,throw,throw,try,typeof,var,watch,while',
				d:'array,bool,boolean,date,datetime,decimal,false,float,hashtable,int,int32,nan,null,'+
					'string,true',
				c:/(?:\/\*(.|[\n\r])*?\*\/)|(?:\/\/[^\n\r]+[\n\r])|(?:<![-]{2,3}([\s\S](?!>))+[-]{2,3}>)/
			},sql:{
				k:'alter,begin,by,commit,create,delete,drop,exec,from,group,having,insert,join,like,'+
					'on,order,rollback,select,set,table,transaction,trigger,truncate,union,update,'+
					'values,where',
				d:'and,asc,between,desc,distinct,exists,inner,left,or,outer,right,top',
				c:/(?:\/\*(.|[\n\r])*?\*\/)|(?:--[^\n\r]+[\n\r])/
			}};
		for (var r = [{c:'c',r:(typs[typ] || typs.web).c},	// comments
					{c:'s',r:/(?:\/\S+\/)|(?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*")/}, // regexp,strings
					{c:'n',r:/(?:\d+\.?\d*[%]?)/}, // numbers
					{c:'k',r:(new RegExp('(?:'+ (typs[typ] || typs.web).k.split(',').join('\\s)|(?:') +')','i'))}, // keywords
					{c:'d',r:(new RegExp('(?:'+ (typs[typ] || typs.web).d.split(',').join('\\s)|(?:') +')','i'))}, // datatypes
					{c:'w',r:/(?:[A-Za-z_-]\w*)/}, // word (variables)
					{c:'f',r:/(?:[\[\]\(\)\{\}\/]+)/}, // flow operators
					{c:'t',r:/(?:[\t])/} // flow operators
				],is = $(this).text(),os = '',re = '',rec = 0,rel = r.length; rec < rel; rec++ ) {
			re += (re ? '|' : '') + r[rec].r.source;
		}
		for (var t = new RegExp(re,'gmi'),pi = 0,a = true,c = 0,of = 0,sl = is.length; c < sl && (a = t.exec(is)); c++) {
			for (rec = 0; rec < rel; rec++) {
				if (r[rec].r.test(a[0])) {
					os += is.substring(pi,(t.lastIndex - a[0].length)).replace(/</g,'&lt;').replace(/>/g,'&gt;') +
						'<span class="'+ r[rec].c +'">'+ a[0].replace(/</g,'&lt;').replace(/>/g,'&gt;') +'</span>';
					pi = t.lastIndex;
					break;
				}
			}
		}
		$(this).replaceWith('<pre class="'+ this.className +'">'+ os + is.substring(pi,is.length) +'</pre>');
			//+ ((new Date()).getTime() - ext.getTime()) +'ms');
	});
});
