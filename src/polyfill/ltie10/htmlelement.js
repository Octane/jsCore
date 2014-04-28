
"classList" in document.documentElement || Object.defineProperty(HTMLElement.prototype, "classList", {

	get: new function () {

		//todo InvalidCharacterError

		function DOMTokenList(getTokens, onChange) {
			this._getTokens = getTokens;
			this._onChange = onChange;
		}

		Object.assign(DOMTokenList.prototype, {

			_clear: function () {
				Array.splice(this, 0, this.length);
			},

			_push: function (tokens) {
				Array.prototype.push.apply(this, tokens);
			},

			_update: function () {
				this._clear();
				this._push(this._getTokens());
			},

			item: function (index) {
				this._update();
				return this[index] || null;
			},

			add: function () {
				var length;
				this._update();
				length = this.length;
				Array.forEach(arguments, function (token) {
					if (-1 == Array.indexOf(this, token)) {
						Array.push(this, token);
					}
				}, this);
				if (length != this.length) {
					this._onChange();
				}
			},

			remove: function () {
				var length;
				this._update();
				length = this.length;
				Array.forEach(arguments, function (token) {
					var index = Array.indexOf(this, token);
					if (-1 != index) {
						Array.splice(this, index, 1);
					}
				}, this);
				if (length != this.length) {
					this._onChange();
				}
			},

			toggle: function (token, force) {
				this._update();
				if (force === false || this.contains(token)) {
					this.remove(token);
					return false;
				}
				this.add(token);
				return true;
			},

			contains: function (token) {
				this._update();
				return -1 != Array.indexOf(this, token);
			},

			toString: function () {
				return Array.join(this, " ");
			}

		});

		function getClasses(className) {
			className = className.trim();
			return className ? className.split(/\s\s*/) : [];
		}

		return function () {
			var element = this;
			if (!element._classList) {
				element._classList = new DOMTokenList(
					function () {
						return getClasses(element.className);
					},
					function () {
						//no reflow if no changes
						//this → element._classList
						element.className = this.toString();
					}
				);
			}
			/*live update DOMTokenList
			element.addEventListener("DOMAttrModified", function (event) {
				if ("class" == event.attrName.toLowerCase()) {
					element._classList._update();
				}
			}, false);*/
			element._classList._update();
			return element._classList;
		};

	}

});
