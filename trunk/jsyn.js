$(document).ready(function () {
	$('pre.code').each(function () {
		for (var k = 'break,catch,class,continue,else,for,function,if,in,instanceof,namespace,private,protected,public,return,switch,throw,try,typeof,using,var,watch,while,new,static,abstract,throw',
				d = 'string,bool,boolean,date,datetime,int,int32,float,decimal,hashtable,array',
				r = [{c:'c',r:/(?:\/\*(.|[\n\r])*?\*\/)|(?:\/\/[^\n\r]+[\n\r])|(?:<![-]{2,3}([\s\S](?!>))+[-]{2,3}>)/},	// comments
					{c:'s',r:/(?:'(?:[^']|\\')*[^\\]')|(?:"[^"]*")/},	// strings
					{c:'n',r:/(?:\d+\.?\d*[%]?)/}, // numbers
					{c:'k',r:(new RegExp('(?:' + k.split(',').join('\\s)|(?:') + ')'))}, // keywords
					{c:'d',r:(new RegExp('(?:' + d.split(',').join('\\s)|(?:') + ')'))}, // datatypes
					{c:'w',r:/(?:[A-Za-z_-]\w*)/}, // word (variables)
					{c:'f',r:/(?:[\[\]\(\)\{\}\/]+)/} // flow operators
				],is = $(this).text(),os = '',re = '',rec = 0,rel = r.length; rec < rel; rec++ ) {
			re += (re ? '|' : '') + r[rec].r.source;
		}
		for (var t = new RegExp(re,'gmi'),pi = 0,a = true,c = 0,of = 0,sl = is.length; c < sl && (a = t.exec(is)); c++) {
			for (rec = 0; rec < rel; rec++) {
				if (r[rec].r.test(a[0])) {
					os += is.substring(pi,(t.lastIndex - a[0].length)).replace(/</g,'&lt;').replace(/>/g,'&gt;') +'<p class="'+ r[rec].c +'">'+ a[0].replace(/</g,'&lt;').replace(/>/g,'&gt;') +'</p>';
					pi = t.lastIndex;
					break;
				}
			}
		}
		$(this).replaceWith('<pre class="'+ this.className +'">'+ os + is.substring(pi,is.length) +'</pre>');
	});
});
