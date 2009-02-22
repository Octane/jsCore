$.ready(function() {

	var examples = $.findClass('example');

	function args(example) {
		var	button = example.firstChild('span'),
				temp = example.firstChild('div'),
				dom = temp.child('span', true),
				javascript = temp.next('div').child('code', true),
				actions = example.firstChild('ol').child('li');
		return [button, dom, javascript, actions];
	}

	(function(button, dom, javascript, actions) {

		var	state = 0;

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				dom.item(state).addClass('active');
				javascript.item(state).addClass('active');
				actions.item(state).show('list-item');
				if(state == 2) dom.item(2).text('Пример');
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
				dom.item(2).text('Текст');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.item(0)));

	(function(button, dom, javascript, actions) {

		var	state = 0, li = dom.filter(function(i) { return i != 0; });

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				dom.item(state).addClass('active');
				javascript.item(state).addClass('active');
				actions.item(state).show('list-item');
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

	}).apply(this, args(examples.item(1)));

	(function(button, dom, javascript, actions) {

		var	state = 0, span = dom.filter(function(i) { return i != 0; });

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				dom.item(state).addClass('active');
				javascript.item(state).addClass('active');
				actions.item(state).show('list-item');
				if(state == 1) span.each('addClass', 'active');
				if(state == 2) span.item(0).removeClass('active');
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

	}).apply(this, args(examples.item(2)));

	(function(button, dom, javascript, actions) {

		var	state = 0;

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				javascript.item(state).addClass('active');
				actions.item(state).show('list-item');
				dom.item(0).addClass('active');
				if(state == 1) dom.item(3).addClass('active');
				if(state == 2) dom.item(3).html('&lt;span title=&quot;Подсказка&quot;&gt;');
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
				dom.item(3).html('&lt;span&gt;');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.item(3)));

	(function(button, dom, javascript, actions) {

		var	state = 0;

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				javascript.item(state).addClass('active');
				actions.item(state).show('list-item');
				if(state == 0) dom.item(3).addClass('active');
				if(state == 1) dom.item(1).addClass('active');
				if(state == 2) dom.item(1).html('&lt;div style=&quot;color:#f00&quot;&gt;');
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
				dom.item(1).html('&lt;div&gt;');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.item(4)));

	(function(button, dom, javascript, actions) {

		var	state = 0, h1;

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				javascript.item(state).addClass('active');
				actions.item(state).show('list-item');
				if(state == 0) dom.item(0).addClass('active');
				if(state == 1) h1 = dom.item(1).parent().before('code').addClass('tag').append('span').addClass('active').html('&lt;h1&gt;');
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

	}).apply(this, args(examples.item(5)));

	(function(button, dom, javascript, actions) {

		var	state = 0, pre = button.parent().lastChild('div').firstChild('pre');
		
		function show(response) {
			button.show();
			dom.item(1).text(response.substring(0, 18) + '…');
		};

		button.click(function() {
			if(state < 3) {
				button.text('Далее');
				javascript.item(state).addClass('active');
				actions.item(state).show('list-item');
				if(state == 0) dom.item(0).addClass('active');
				if(state == 1) {
					dom.item(1).text('Загрузка…').addClass('active');
					pre.text('Загрузка…');
				}
				if(state == 2) {
					pre.load({url: 'MIT-LICENSE.txt'}, show, show);
					button.hide();
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
				dom.item(1).text('Текст');
				pre.text('Текст');
				javascript.each('removeClass', 'active');
				actions.each('hide');
				state = 0;
				return;
			}
		});

	}).apply(this, args(examples.item(6)));
	
	// fix :hover and :active for IE6
	if($.ie == 6) $.findClass('button', 'span').each(function() {
		$(this).mouseover('addClass', 'hover').mouseout('removeClass', 'hover').mousedown('addClass', 'active').mouseup('removeClass', 'active');
	});

});