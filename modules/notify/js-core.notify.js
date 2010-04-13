/*
	JS-Core Notify Plugin, version 1.1
	Todo: Поправить ошибку при отрисовке более одного notify-окна.
*/
core.notify = {
	show: function(t,bgcolor,timeout) {
		var jscnt = window.setTimeout(function() {$("js-core-notify").remove();if(jscni)clearInterval(jscni);}, timeout);
		var jscnti = timeout/1000;
		var jscni = setInterval(function(){$('js-core-notify-other').text('Это сообщение самоликвидируется через ' + (jscnti - 1) + " секунд(ы)!");jscnti-=1; } , 1000);
		$(document.body).prepend('div').css("background",bgcolor).id('js-core-notify')
		$('js-core-notify').append('div').id('js-notify-close').append('a').attr({href:"#"}).html('&#8855;').click(
			function(e){ 
				clearInterval(jscni);
				clearTimeout(jscnt);
				$('js-core-notify').remove();
				$.stop(e);
			}
		);
		$('js-notify-close').css("visibility","hidden");
		$('js-core-notify').append('div').id('js-core-notify-text').html(t);
		$('js-core-notify').append('div').id('js-core-notify-other').text('Это сообщение самоликвидируется через ' + timeout / 1000 + " секунд(ы)!");
		$('js-core-notify').bind('mouseover',
			function(e) {
				$('js-notify-close').css("visibility","visible");
				$('js-core-notify').addClass('js-core-notify-unopacity');
				$.stop(e);
			}
		);
		$('js-core-notify').bind('mouseout',
			function(e) {
				$('js-notify-close').css("visibility","hidden");
				$('js-core-notify').removeClass('js-core-notify-unopacity');
				$('js-core-notify').addClass('js-core-notify-opacity');
				$.stop(e);
			}
		);
	}
}