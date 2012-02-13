/**
 * Поиск текста в DOM-дереве без учета количества пробелов между словами.
 * @constructor
 * @argument {HTMLElement} rootContainer Элемент, внутри которого будет выполнен поиск.
 */
function $Finder(rootContainer) {
	this.collectTextNodes(rootContainer);
}

$Finder.prototype = {

	// восстанавливаем ссылку на конструктор
	constructor: $Finder,

	/**
	 * Информация о текстовых узлах внутри rootContainer.
	 * @type Array
	 */
	textNodes: [
		{
			/**
			 * Ссылка на текстовый узел.
			 * @type Text
			 */
			node: null,
			/**
			 * Индекс последнего символа относительно всего текста + 1.
			 * @type Number
			 */
			characterInterval: -1
		}
	],

	/**
	 * Индекс nodeType текстовых узлов.
	 * @const
	 * @type Number
	 */
	TEXT_NODE: 3,

	/**
	 * Экранирует символы в строке так, чтобы из неё можно было создать шаблон регулярного выражения.
	 * @argument {String} str Исходная строка.
	 * @type String
	 * @returns Строка с экранированными символами.
	 */
	escape: function (str) {
		return str.replace(/([?!^$.(){}:|=[\]+\-\/\\*])/g, "\\$1");
	},

	/**
	 * Создает шаблон регулярного выражения так, чтобы во время поиска не учитывалось количество пробелов между словами.
	 * @argument {String} text Исходная строка.
	 * @type String
	 * @returns Шаблон регулярного выражения.
	 */
	createSearchPattern: function (text) {
		// В некоторых браузерах неразрывный пробел (&nbsp; или \u00A0) не попадает под область действия метасимвола \s.
		// todo проработать все непечатные символы http://perfectionkills.com/whitespace-deviations/
		return this.escape(text).replace(/^[\s\u0A00]+|[\s\u0A00]+$/, "").split(/[\s\u0A00]+/).join("[\\s\\u00A0]+");
	},

	/**
	 * Рекурсивно обходит фрагмент DOM-дерева и собирает информацию о текстовых узлах.
	 * @argument {HTMLElement} rootContainer Элемент, внутри которого будет выполнен поиск.
	 */
	collectTextNodes: function (rootContainer, returnValue) {

		var TEXT_NODE = this.TEXT_NODE, textNodes = [], j = 0, str = "";

		(function (element) {
			var node, nodes = element.childNodes, length = nodes.length, i = -1;
			while (++i < length) {
				node = nodes[i];
				if (node.nodeType == TEXT_NODE && node.nodeValue) {
					str += node.nodeValue;
					textNodes[j++] = {
						node: node,
						characterInterval: str.length
					};
				} else if(node.hasChildNodes()) {
					arguments.callee(node); // рекурсия
				}
			}
		})(rootContainer);
		
		if (returnValue) {
			return {
				text: str,
				textNodes: textNodes
			};
		}

		this.text = str;
		this.textNodes = textNodes;
	},

	/**
	 * Выполняет поиск.
	 * @argument {String} searchText Искомый текст.
	 * @type Array
	 * @returns Массив объектов с информацией для работы с Range.
	 */
	find: function (searchText) {
		var ranges = [], regexp = new RegExp(this.createSearchPattern(searchText), "g"), lastMatch = regexp.exec(this.text), length;
		while (lastMatch) {
			length = lastMatch[0].length;
			ranges.push(this.computeRange(regexp.lastIndex - length, regexp.lastIndex));
			regexp.lastIndex -= length - 1;
			lastMatch = regexp.exec(this.text);
		}
		return ranges;
	},

	/**
	 * Вычисляет startContainer, endContainer, startOffset и endOffset для Range.
	 * @argument {Number} start Индекс символа, с которого начинается найденный текст, относительно всего текста.
	 * @argument {Number} end Индекс символа, на котором заканчивается найденный текст, относительно всего текста.
	 * @type Object
	 * @returns Объект, содержащий вышеперечисленные свойства.
	 */
	computeRange: function (start, end) {
		var startContainer = this.getInfo(start), endContainer = this.getInfo(end - 1);
		/*if (!endContainer) { // IE magic
			endContainer = this.getInfo(end - 1);
		}*/
		return {
			startContainer: startContainer.node,			
			endContainer: endContainer.node,
			startOffset: start - startContainer.characterInterval + startContainer.node.nodeValue.length,
			endOffset: end - endContainer.characterInterval + endContainer.node.nodeValue.length
		};
	},

	/**
	 * Определяет текстовый узел по индексу символа.
	 * @argument {Number} characterIndex Индекс символа относительно всего текста.
	 * @type Object
	 * @returns Объект с информацией о текстовом узле.
	 */
	getInfo: function (characterIndex) {
		for (var i = 0; i < this.textNodes.length; i++) {
			if (this.textNodes[i].characterInterval > characterIndex) {
				return this.textNodes[i];
			}
		}
		return null;
	}
};

/**
 * @see $Finder.prototype.collectTextNodes
 * @private
 */
$Finder.collectTextNodes = function (rootContainer) {
	return this.prototype.collectTextNodes(rootContainer, true);
};
