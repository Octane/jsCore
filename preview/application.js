// onDOMContentLoaded
$.ready(function() {

	// nav menu tooltip
	$('header').exist(function() {
		// create tooltip container
		var tooltip = $(document.body).append('div').hide().addClass('tooltip'), visible = false, move = false;
		function show() {
			visible = true;
			var link = $(this), position = tooltip.position().left;
			if(move && position > 0) {
				var destination = link.position().left, step = position < destination ? 5 : -5;
				$.timer(10, function(timer) {
					if(move && Math.abs(position - destination) > 5) {
						position += step;
						tooltip.css('left', position + 'px');
					} else {
						timer.stop();
						tooltip.text(link.attr('tooltip'));
					}
				}).start();
			}
			else {
				move = true;
				setTimeout(function() {
					tooltip.css('left', link.position().left + 'px').text(link.attr('tooltip')).show();
				}, 150);
			}
		}
		function hide() {
			visible = false;
			setTimeout(function() {
				if(!visible) {
					tooltip.hide();
					move = false;
				}
			}, 300);
		}
		$(this).first('ul').children('a').each(function() {
			$(this).focus(show).blur(hide).mouseover(show).mouseout(hide).attr('tooltip', this.title).node.removeAttribute('title');
		});
	});
	
	// get elements by class name
	var examples = $.findClass('example');

	function args(example) {
		var	button = example.first('button'),
				temp = example.first('div'),
				dom = temp.children('span'),
				javascript = temp.next('div').children('code'),
				actions = example.first('ol').child('li');
		return [button, dom, javascript, actions];
	}

	(function(button, dom, javascript, actions) {

		var	state = 0;

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				dom.get(state).addClass('active');
				javascript.get(state).addClass('active');
				actions.get(state).show('list-item');
				if(state == 2) dom.get(2).text('Пример');
				state++;
			}
			if(state == 3) {
				button.text('Сброс');
				state++;
				return;
			}
			if(state == 4) {
				button.text('Старт');
				dom.each('removeClass', 'active');
				dom.get(2).text('Текст');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.get(0)));

	(function(button, dom, javascript, actions) {

		var	state = 0, li = dom.filter(function(i) { return i != 0; });

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				dom.get(state).addClass('active');
				javascript.get(state).addClass('active');
				actions.get(state).show('list-item');
				if(state == 1) li.each('addClass', 'active');
				if(state == 2) li.each('html', '&lt;li class=&quot;some&quot;&gt;');
				state++;
			}
			if(state == 3) {
				button.text('Сброс');
				state++;
				return;
			}
			if(state == 4) {
				button.text('Старт');
				dom.each('removeClass', 'active');
				li.each('html', '&lt;li&gt;');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.get(1)));

	(function(button, dom, javascript, actions) {

		var	state = 0, span = dom.filter(function(i) { return i != 0; });

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				dom.get(state).addClass('active');
				javascript.get(state).addClass('active');
				actions.get(state).show('list-item');
				if(state == 1) span.each('addClass', 'active');
				if(state == 2) span.get(0).removeClass('active');
				state++;
			}
			if(state == 3) {
				button.text('Сброс');
				state++;
				return;
			}
			if(state == 4) {
				button.text('Старт');
				dom.each('removeClass', 'active');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.get(2)));

	(function(button, dom, javascript, actions) {

		var	state = 0;

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				javascript.get(state).addClass('active');
				actions.get(state).show('list-item');
				dom.get(0).addClass('active');
				if(state == 1) dom.get(3).addClass('active');
				if(state == 2) dom.get(3).html('&lt;span title=&quot;Подсказка&quot;&gt;');
				state++;
			}
			if(state == 3) {
				button.text('Сброс');
				state++;
				return;
			}
			if(state == 4) {
				button.text('Старт');
				dom.each('removeClass', 'active');
				dom.get(3).html('&lt;span&gt;');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.get(3)));

	(function(button, dom, javascript, actions) {

		var	state = 0;

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				javascript.get(state).addClass('active');
				actions.get(state).show('list-item');
				if(state == 0) dom.get(3).addClass('active');
				if(state == 1) dom.get(1).addClass('active');
				if(state == 2) dom.get(1).html('&lt;div style=&quot;color:#f00&quot;&gt;');
				state++;
			}
			if(state == 3) {
				button.text('Сброс');
				state++;
				return;
			}
			if(state == 4) {
				button.text('Старт');
				dom.each('removeClass', 'active');
				dom.get(1).html('&lt;div&gt;');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.get(4)));

	(function(button, dom, javascript, actions) {

		var	state = 0, h1;

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				javascript.get(state).addClass('active');
				actions.get(state).show('list-item');
				if(state == 0) dom.get(0).addClass('active');
				if(state == 1) h1 = dom.get(1).parent().before('code').addClass('tag').append('span').addClass('active').html('&lt;h1&gt;');
				if(state == 2) h1.append('code').addClass('text').append('span').addClass('active').text('Пример');
				state++;
			}
			if(state == 3) {
				button.text('Сброс');
				state++;
				return;
			}
			if(state == 4) {
				button.text('Старт');
				h1.remove();
				dom.each('removeClass', 'active');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.get(5)));

	(function(button, dom, javascript, actions) {

		var state = 0, pre = button.parent().last('div').first('pre');
		
		function show(response) {
			button.show();
			dom.get(1).text(response.substring(0, 18) + '…');
		};

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				javascript.get(state).addClass('active');
				actions.get(state).show('list-item');
				if(state == 0) dom.get(0).addClass('active');
				if(state == 1) {
					dom.get(1).text('Загрузка…').addClass('active');
					pre.text('Загрузка…');
				}
				if(state == 2) {
					button.hide();
					pre.load({url: 'MIT-LICENSE.txt'}, show, show);
				}
				state++;
			}
			if(state == 3) {
				button.text('Сброс');
				state++;
				return;
			}
			if(state == 4) {
				button.text('Старт');
				dom.each('removeClass', 'active');
				dom.get(1).text('Текст');
				pre.text('Текст');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.get(6)));

	// fix :hover and :active for IE6,7
	if($.ie < 8) $.tag('button').each(function() {
		if($.ie == 6) $(this).mouseover('addClass', 'hover').mouseout('removeClass', 'hover');
		$(this).focus('addClass', 'hover').blur('removeClass', 'hover').mousedown('addClass', 'active').mouseup('removeClass', 'active');
	});

});