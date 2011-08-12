(function() {
	var addListener = function() {
		if (window.addEventListener) {
			return function(el, eventName, fn, capture) {
				el.addEventListener(eventName, fn, !!capture);
			};
		} else {
			if (window.attachEvent) {
				return function(el, eventName, fn, capture) {
					el.attachEvent("on" + eventName, fn);
				};
			} else {
				return function() {
				};
			}
		}
	}(), removeListener = function() {
		if (window.removeEventListener) {
			return function(el, eventName, fn, capture) {
				el.removeEventListener(eventName, fn, (capture));
			};
		} else {
			if (window.detachEvent) {
				return function(el, eventName, fn) {
					el.detachEvent("on" + eventName, fn);
				};
			} else {
				return function() {
				};
			}
		}
	}();
	var EV = Ext.lib.Event;
	var MIM;
	var MASK_TARGET = "x-frame-mask-target";
	Ext.ux.ManagedIFrame = function() {
		var args = Array.prototype.slice.call(arguments, 0), el = Ext
				.get(args[0]), config = args[0];
		if (el && el.dom && el.dom.tagName == "IFRAME") {
			config = args[1] || {};
		} else {
			config = args[0] || args[1] || {};
			el = config.autoCreate ? Ext.get(Ext.DomHelper.append(
					config.autoCreate.parent || Ext.getBody(), Ext.apply({
								tag : "iframe",
								frameborder : 0,
								src : (Ext.isIE && Ext.isSecure)
										? Ext.SSL_SECURE_URL
										: "about:blank"
							}, config.autoCreate))) : null;
			if (el && this.unsupportedText) {
				Ext.DomHelper.append(el.dom.parentNode, {
							tag : "noframes",
							html : this.unsupportedText
						});
			}
		}
		if (!el || el.dom.tagName != "IFRAME") {
			return el;
		}
		el.dom.name || (el.dom.name = el.dom.id);
		el.dom.ownerEl = el;
		this.addEvents({
					"focus" : true,
					"blur" : true,
					"unload" : true,
					"domready" : true,
					"documentloaded" : true,
					"exception" : true,
					"message" : true
				});
		if (config.listeners) {
			this.listeners = config.listeners;
			Ext.ux.ManagedIFrame.superclass.constructor.call(this);
		}
		Ext.apply(el, this);
		el.addClass("x-managed-iframe");
		if (config.style) {
			el.applyStyles(config.style);
		}
		Ext.apply(el, {
			disableMessaging : config.disableMessaging === true,
			loadMask : !!config.loadMask ? Ext.apply({
						msg : "Loading..",
						maskEl : null,
						hideOnReady : false,
						disabled : false
					}, config.loadMask) : false,
			_windowContext : null,
			eventsFollowFrameLinks : typeof config.eventsFollowFrameLinks == "undefined"
					? true
					: config.eventsFollowFrameLinks
		});
		if (el.loadMask) {
			el.loadMask.maskEl
					|| (el.loadMask.maskEl = el.parent("." + MASK_TARGET)
							|| el.parent());
			el.loadMask.maskEl.addClass(MASK_TARGET);
		}
		var um = el.updateManager = new Ext.UpdateManager(el, true);
		um.showLoadIndicator = config.showLoadIndicator || false;
		Ext.ux.ManagedIFrame.Manager.register(el);
		if (config.src) {
			el.setSrc(config.src);
		} else {
			var content = config.html || config.content || false;
			if (content) {
				el.reset(null, function(frame) {
							frame.update.apply(el, [].concat(content));
						});
			}
		}
		return el;
	};
	Ext.extend(Ext.ux.ManagedIFrame, Ext.util.Observable, {
		src : null,
		CSS : null,
		manager : null,
		disableMessaging : true,
		domReadyRetries : 7500,
		resetUrl : (function() {
			if (Ext.isIE && Ext.isSecure) {
				return Ext.SSL_SECURE_URL;
			} else {
				return "about:blank";
			}
		})(),
		unsupportedText : "Inline frames are NOT enabled/supported by your browser.",
		setSrc : function(url, discardUrl, callback, scope) {
			if (url && typeof url == "object") {
				callback = url.callback || false;
				discardUrl = url.discardUrl || false;
				url = url.url || false;
				scope = url.scope || null;
			}
			var src = url || this.src || this.resetUrl;
			this._windowContext = null;
			this._unHook();
			this._frameAction = this.frameInit = this._domReady = false;
			this.showMask();
			var s = this._targetURI = typeof src == "function"
					? src() || ""
					: src;
			try {
				this._frameAction = true;
				this._callBack = typeof callback == "function" ? callback
						.createDelegate(scope) : null;
				this.dom.src = s;
				this.frameInit = true;
				this.checkDOM();
			} catch (ex) {
				this.fireEvent("exception", this, ex);
			}
			if (discardUrl !== true) {
				this.src = src;
			}
			return this;
		},
		setLocation : function(url, discardUrl, callback, scope) {
			if (url && typeof url == "object") {
				callback = url.callback || false;
				discardUrl = url.discardUrl || false;
				url = url.url || false;
				scope = url.scope || null;
			}
			var src = url || this.src || this.resetUrl;
			this._windowContext = null;
			this._unHook();
			this._frameAction = this.frameInit = this._domReady = false;
			this.showMask();
			var s = this._targetURI = typeof src == "function"
					? src() || ""
					: src;
			try {
				this._frameAction = true;
				this._callBack = typeof callback == "function" ? callback
						.createDelegate(scope) : null;
				this.getWindow().location.replace(s);
				this.frameInit = true;
				this.checkDOM();
			} catch (ex) {
				this.fireEvent("exception", this, ex);
			}
			if (discardUrl !== true) {
				this.src = src;
			}
			return this;
		},
		reset : function(src, callback, scope) {
			this._unHook();
			var loadMaskOff = false;
			if (this.loadMask) {
				loadMaskOff = this.loadMask.disabled;
				this.loadMask.disabled = false;
			}
			this._callBack = function(frame) {
				if (frame.loadMask) {
					frame.loadMask.disabled = loadMaskOff;
				}
				frame._frameAction = false;
				frame.frameInit = true;
				this._isReset = false;
				if (callback) {
					callback.call(scope || window, frame);
				}
			};
			this.hideMask(true);
			this._frameAction = false;
			this.frameInit = true;
			this._isReset = true;
			var s = src;
			if (typeof src == "function") {
				s = src();
			}
			s = this._targetURI = Ext.isEmpty(s, true) ? this.resetUrl : s;
			this.getWindow().location.href = s;
			return this;
		},
		scriptRE : /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/gi,
		update : function(content, loadScripts, callback, scope) {
			loadScripts = loadScripts || this.getUpdateManager().loadScripts
					|| false;
			content = Ext.DomHelper.markup(content || "");
			content = loadScripts === true ? content : content.replace(
					this.scriptRE, "");
			var doc;
			if ((doc = this.getDocument()) && !!content.length) {
				this._unHook();
				this._windowContext = this.src = null;
				this._targetURI = location.href;
				this.src = null;
				this.frameInit = true;
				this.showMask();
				this._callBack = typeof callback == "function" ? callback
						.createDelegate(scope) : null;
				doc.open();
				this._frameAction = true;
				doc.write(content);
				doc.close();
				this.checkDOM();
			} else {
				this.hideMask(true);
				if (callback) {
					callback.call(scope, this);
				}
			}
			return this;
		},
		disableMessaging : true,
		_XFrameMessaging : function() {
			var tagStack = {
				"$" : []
			};
			var isEmpty = function(v, allowBlank) {
				return v === null || v === undefined
						|| (!allowBlank ? v === "" : false);
			};
			var apply = function(o, c, defaults) {
				if (defaults) {
					apply(o, defaults);
				}
				if (o && c && typeof c == "object") {
					for (var p in c) {
						o[p] = c[p];
					}
				}
				return o;
			};
			window.sendMessage = function(message, tag, origin) {
				var MIF;
				if (MIF = arguments.callee.manager) {
					if (message._fromHost) {
						var fn, result;
						var compTag = message.tag || tag || null;
						var mstack = !isEmpty(compTag) ? tagStack[compTag
								.toLowerCase()]
								|| [] : tagStack["$"];
						for (var i = 0, l = mstack.length; i < l; i++) {
							if (fn = mstack[i]) {
								result = fn.apply(fn.__scope, arguments) === false
										? false
										: result;
								if (fn.__single) {
									mstack[i] = null;
								}
								if (result === false) {
									break;
								}
							}
						}
						return result;
					} else {
						message = {
							type : isEmpty(tag) ? "message" : "message:"
									+ tag.toLowerCase().replace(/^\s+|\s+$/g,
											""),
							data : message,
							domain : origin || document.domain,
							uri : document.documentURI,
							source : window,
							tag : isEmpty(tag) ? null : tag.toLowerCase()
						};
						try {
							return MIF.disableMessaging !== true
									? MIF.fireEvent.call(MIF, message.type,
											MIF, message)
									: null;
						} catch (ex) {
						}
						return null;
					}
				}
			};
			window.onhostmessage = function(fn, scope, single, tag) {
				if (typeof fn == "function") {
					if (!isEmpty(fn.__index)) {
						throw "onhostmessage: duplicate handler definition"
								+ (tag ? " for tag:" + tag : "");
					}
					var k = isEmpty(tag) ? "$" : tag.toLowerCase();
					tagStack[k] || (tagStack[k] = []);
					apply(fn, {
								__tag : k,
								__single : single || false,
								__scope : scope || window,
								__index : tagStack[k].length
							});
					tagStack[k].push(fn);
				} else {
					throw "onhostmessage: function required";
				}
			};
			window.unhostmessage = function(fn) {
				if (typeof fn == "function" && typeof fn.__index != "undefined") {
					var k = fn.__tag || "$";
					tagStack[k][fn.__index] = null;
				}
			};
		},
		getHistory : function() {
			var h = null;
			try {
				h = this.getWindow().history;
			} catch (eh) {
			}
			return h;
		},
		get : function(el) {
			return MIM.El.get(this, el);
		},
		fly : function(el, named) {
			named = named || "_global";
			el = this.getDom(el);
			if (!el) {
				return null;
			}
			if (!MIM._flyweights[named]) {
				MIM._flyweights[named] = new Ext.Element.Flyweight();
			}
			MIM._flyweights[named].dom = el;
			return MIM._flyweights[named];
		},
		getDom : function(el) {
			var d;
			if (!el || !(d = this.getDocument())) {
				return null;
			}
			return el.dom ? el.dom : (typeof el == "string" ? d
					.getElementById(el) : el);
		},
		select : function(selector, unique) {
			var d;
			return (d = this.getDocument()) ? Ext.Element.select(selector,
					unique, d) : null;
		},
		query : function(selector) {
			var d;
			return (d = this.getDocument())
					? Ext.DomQuery.select(selector, d)
					: null;
		},
		getDoc : function() {
			return this.get(this.getDocument());
		},
		removeNode : function(node) {
			MIM.removeNode(this, this.getDom(node));
		},
		_unHook : function() {
			var elcache, h = MIM.getFrameHash(this) || {};
			if (this._hooked) {
				if (h && (elcache = h.elCache)) {
					for (var id in elcache) {
						var el = elcache[id];
						if (el.removeAllListeners) {
							el.removeAllListeners();
						}
						delete elcache[id];
					}
					if (h.docEl) {
						h.docEl.removeAllListeners();
						h.docEl = null;
						delete h.docEl;
					}
				}
				var w;
				if (this._frameProxy && (w = this.getWindow())) {
					removeListener(w, "focus", this._frameProxy);
					removeListener(w, "blur", this._frameProxy);
					removeListener(w, "resize", this._frameProxy);
					removeListener(w, "unload", this._frameProxy);
				}
			}
			this._hooked = this._domReady = this._domFired = this._frameAction = false;
			MIM._flyweights = {};
			this.CSS = this.CSS ? this.CSS.destroy() : null;
		},
		_renderHook : function() {
			this._windowContext = null;
			this.CSS = this.CSS ? this.CSS.destroy() : null;
			this._hooked = false;
			try {
				if (this
						.writeScript('(function(){(window.hostMIF = parent.Ext.get("'
								+ this.dom.id
								+ '"))._windowContext='
								+ (Ext.isIE
										? "window"
										: "{eval:function(s){return eval(s);}}")
								+ ";})();")) {
					this._frameProxy
							|| (this._frameProxy = MIM.eventProxy
									.createDelegate(this));
					var w;
					if (w = this.getWindow()) {
						addListener(w, "focus", this._frameProxy);
						addListener(w, "blur", this._frameProxy);
						addListener(w, "resize", this._frameProxy);
						addListener(w, "unload", this._frameProxy);
					}
					if (this.disableMessaging !== true) {
						this.loadFunction({
									name : "XMessage",
									fn : this._XFrameMessaging
								}, false, true);
						var sm;
						if (sm = w.sendMessage) {
							sm.manager = this;
						}
					}
					this.CSS = new CSSInterface(this.getDocument());
				}
			} catch (ex) {
				console.warn(ex);
			}
			return (this._hooked = this.domWritable());
		},
		sendMessage : function(message, tag, origin) {
			var win;
			if (this.disableMessaging !== true && (win = this.getWindow())) {
				tag || (tag = message.tag || "");
				tag = tag.toLowerCase();
				message = Ext.applyIf(message.data ? message : {
							data : message
						}, {
							type : Ext.isEmpty(tag) ? "message" : "message:"
									+ tag,
							domain : origin || document.domain,
							uri : document.documentURI,
							source : window,
							tag : tag || null,
							_fromHost : this
						});
				return win.sendMessage ? win.sendMessage.call(null, message,
						tag, origin) : null;
			}
			return null;
		},
		_windowContext : null,
		getDocument : function() {
			var win = this.getWindow(), doc = null;
			try {
				doc = (Ext.isIE && win ? win.document : null)
						|| this.dom.contentDocument
						|| window.frames[this.id].document || null;
			} catch (gdEx) {
				return false;
			}
			return doc;
		},
		getBody : function() {
			var d;
			return (d = this.getDocument()) ? d.body : null;
		},
		getDocumentURI : function() {
			var URI, d;
			try {
				URI = this.src && (d = this.getDocument())
						? d.location.href
						: null;
			} catch (ex) {
			}
			return URI
					|| (typeof this.src == "function" ? this.src() : this.src);
		},
		getWindowURI : function() {
			var URI, w;
			try {
				URI = (w = this.getWindow()) ? w.location.href : null;
			} catch (ex) {
			}
			return URI
					|| (typeof this.src == "function" ? this.src() : this.src);
		},
		getWindow : function() {
			var dom = this.dom, win = null;
			try {
				win = dom.contentWindow || window.frames[dom.name] || null;
			} catch (gwEx) {
			}
			return win;
		},
		print : function() {
			var win;
			try {
				if (win = this.getWindow()) {
					if (Ext.isIE) {
						win.focus();
					}
					win.print();
				}
			} catch (ex) {
				throw "print exception: "
						+ (ex.description || ex.message || ex);
			}
		},
		destroy : function() {
			this.removeAllListeners();
			if (this.loadMask) {
				this.hideMask(true);
				Ext.apply(this.loadMask, {
							masker : null,
							maskEl : null
						});
			}
			if (this.dom) {
				Ext.ux.ManagedIFrame.Manager.deRegister(this);
				this.dom.ownerEl = this._windowContext = null;
				if (Ext.isIE && this.dom.src) {
					this.dom.src = "javascript:false";
				}
				this._maskEl = null;
				this.remove();
			}
		},
		domWritable : function() {
			return !!this._windowContext;
		},
		execScript : function(block, useDOM) {
			try {
				if (this.domWritable()) {
					if (useDOM) {
						this.writeScript(block);
					} else {
						return this._windowContext.eval(block);
					}
				} else {
					throw "execScript:non-secure context";
				}
			} catch (ex) {
				this.fireEvent("exception", this, ex);
				return false;
			}
			return true;
		},
		writeScript : function(block, attributes) {
			attributes = Ext.apply({}, attributes || {}, {
						type : "text/javascript",
						text : block
					});
			try {
				var head, script, doc = this.getDocument();
				if (doc && typeof doc.getElementsByTagName != "undefined") {
					if (!(head = doc.getElementsByTagName("head")[0])) {
						head = doc.createElement("head");
						doc.getElementsByTagName("html")[0].appendChild(head);
					}
					if (head && (script = doc.createElement("script"))) {
						for (var attrib in attributes) {
							if (attributes.hasOwnProperty(attrib)
									&& attrib in script) {
								script[attrib] = attributes[attrib];
							}
						}
						return !!head.appendChild(script);
					}
				}
			} catch (ex) {
				this.fireEvent("exception", this, ex);
			}
			return false;
		},
		loadFunction : function(fn, useDOM, invokeIt) {
			var name = fn.name || fn;
			var fn = fn.fn || window[fn];
			this.execScript(name + "=" + fn, useDOM);
			if (invokeIt) {
				this.execScript(name + "()");
			}
		},
		mask : function(msg, msgCls, maskCls) {
			this._mask && this.unmask();
			var p = this.parent("." + MASK_TARGET) || this.parent();
			if (p.getStyle("position") == "static"
					&& !p.select("iframe,frame,object,embed").elements.length) {
				p.addClass("x-masked-relative");
			}
			p.addClass("x-masked");
			this._mask = Ext.DomHelper.append(p, {
						cls : maskCls || "ext-el-mask"
					}, true);
			this._mask.setDisplayed(true);
			this._mask._agent = p;
			var delay = (this.loadMask ? this.loadMask.delay : 0) || 10;
			if (typeof msg == "string") {
				this._maskMsg = Ext.DomHelper.append(p, {
							cls : msgCls || "ext-el-mask-msg x-mask-loading",
							style : {
								visibility : "hidden"
							},
							cn : {
								tag : "div",
								html : msg
							}
						}, true);
				this._maskMsg.setVisibilityMode(Ext.Element.VISIBILITY);
	(function	() {
					this._mask && this._maskMsg
							&& this._maskMsg.center(p).setVisible(true);
				}).defer(delay, this);
			}
			if (Ext.isIE && !(Ext.isIE7 && Ext.isStrict)
					&& this.getStyle("height") == "auto") {
				this._mask.setSize(undefined, this._mask.getHeight());
			}
			return this._mask;
		},
		unmask : function() {
			var a;
			if (this._mask) {
				(a = this._mask._agent)
						&& a.removeClass(["x-masked-relative", "x-masked"]);
				if (this._maskMsg) {
					this._maskMsg.remove();
					delete this._maskMsg;
				}
				this._mask.remove();
				delete this._mask;
			}
		},
		showMask : function(msg, msgCls, maskCls) {
			var lmask = this.loadMask;
			if (lmask && !lmask.disabled && !this._mask) {
				this.mask(msg || lmask.msg, msgCls || lmask.msgCls, maskCls
								|| lmask.maskCls);
			}
		},
		hideMask : function(forced) {
			var tlm = this.loadMask;
			if (tlm && !!this._mask) {
				if (forced || (tlm.hideOnReady && this._domReady)) {
					this.unmask();
				}
			}
		},
		submitAsTarget : function(submitCfg) {
			var opt = submitCfg || {}, D = document;
			var form = opt.form || Ext.DomHelper.append(D.body, {
						tag : "form",
						cls : "x-hidden"
					});
			form = Ext.getDom(form.form || form);
			form.target = this.dom.name;
			form.method = opt.method || "POST";
			opt.encoding
					&& (form.enctype = form.encoding = String(opt.encoding));
			opt.url && (form.action = opt.url);
			var hiddens, hd;
			if (opt.params) {
				hiddens = [];
				var ps = typeof opt.params == "string" ? Ext.urlDecode(params,
						false) : opt.params;
				for (var k in ps) {
					if (ps.hasOwnProperty(k)) {
						hd = D.createElement("input");
						hd.type = "hidden";
						hd.name = k;
						hd.value = ps[k];
						form.appendChild(hd);
						hiddens.push(hd);
					}
				}
			}
			this._callBack = typeof opt.callback == "function" ? opt.callback
					.createDelegate(opt.scope) : null;
			this._frameAction = this.frameInit = true;
			this._targetURI = location.href;
			this.showMask();
	(function() {
				form.submit();
				hiddens && Ext.each(hiddens, Ext.removeNode, Ext);
				Ext.fly(form, "_dynaForm").hasClass("x-hidden")
						&& Ext.removeNode(form);
				this.hideMask(true);
			}).defer(100, this);
		},
		loadHandler : function(e, target) {
			target || (target = {});
			var rstatus = (e && typeof e.type !== "undefined"
					? e.type
					: this.dom.readyState);
			if (!this.frameInit
					|| (!this._frameAction && !this.eventsFollowFrameLinks)) {
				return;
			}
			switch (rstatus) {
				case "domready" :
					var M;
					try {
						M = this.getWindow() ? this.getWindow().hostMIF : null;
					} catch (access) {
					}
					if (this._frameAction && !M) {
						this.frameInit
								&& this._renderHook()
								&& this.fireEvent.defer(1, this, ["domready",
												this]);
						this._domFired = this._hooked;
					}
				case "domfail" :
					this._domReady = true;
					this.hideMask();
					break;
				case "load" :
				case "complete" :
					if (!this._domFired) {
						this.loadHandler({
									type : "domready",
									id : this.id
								}, this.dom);
					}
					Ext.isIE && this.getWindow() && this.getWindow().focus();
					if (this._frameAction || this.eventsFollowFrameLinks) {
						this.fireEvent.defer(1, this, ["documentloaded", this]);
						if (this._callBack) {
							this._callBack.defer(1, null, [this]);
						}
					}
					this._frameAction = this.frameInit = false;
					if (this.eventsFollowFrameLinks) {
						this._domFired = this._domReady = false;
					}
					this.hideMask(true);
					break;
				default :
			}
			this.frameState = rstatus;
		},
		checkDOM : function(win) {
			if (Ext.isOpera || Ext.isGecko || !this._frameAction) {
				return;
			}
			var n = 0, manager = this, domReady = false, b, l, d, max = this.domReadyRetries, polling = false, startLocation = (this
					.getDocument() || {
				location : {}
			}).location.href;
	(function() {
				d = manager.getDocument() || {
					location : {}
				};
				polling = (d.location.href !== startLocation || d.location.href === manager._targetURI);
				if (!manager._frameAction || manager._domReady) {
					return;
				}
				domReady = polling
						&& ((b = manager.getBody()) && !!(b.innerHTML || "").length)
						|| false;
				if (d.location.href && !domReady && (++n < max)) {
					setTimeout(arguments.callee, 2);
					return;
				}
				manager.loadHandler({
							type : domReady ? "domready" : "domfail"
						});
			})();
		}
	});
	var styleCamelRe = /(-[a-z])/gi;
	var styleCamelFn = function(m, a) {
		return a.charAt(1).toUpperCase();
	};
	var CSSInterface = function(hostDocument) {
		var doc;
		if (hostDocument) {
			doc = hostDocument;
			return {
				rules : null,
				destroy : function() {
					return doc = null;
				},
				createStyleSheet : function(cssText, id) {
					var ss;
					if (!doc) {
						return;
					}
					var head = doc.getElementsByTagName("head")[0];
					var rules = doc.createElement("style");
					rules.setAttribute("type", "text/css");
					if (id) {
						rules.setAttribute("id", id);
					}
					if (Ext.isIE) {
						head.appendChild(rules);
						ss = rules.styleSheet;
						ss.cssText = cssText;
					} else {
						try {
							rules.appendChild(doc.createTextNode(cssText));
						} catch (e) {
							rules.cssText = cssText;
						}
						head.appendChild(rules);
						ss = rules.styleSheet
								? rules.styleSheet
								: (rules.sheet || doc.styleSheets[doc.styleSheets.length
										- 1]);
					}
					this.cacheStyleSheet(ss);
					return ss;
				},
				removeStyleSheet : function(id) {
					if (!doc) {
						return;
					}
					var existing = doc.getElementById(id);
					if (existing) {
						existing.parentNode.removeChild(existing);
					}
				},
				swapStyleSheet : function(id, url) {
					this.removeStyleSheet(id);
					if (!doc) {
						return;
					}
					var ss = doc.createElement("link");
					ss.setAttribute("rel", "stylesheet");
					ss.setAttribute("type", "text/css");
					ss.setAttribute("id", id);
					ss.setAttribute("href", url);
					doc.getElementsByTagName("head")[0].appendChild(ss);
				},
				refreshCache : function() {
					return this.getRules(true);
				},
				cacheStyleSheet : function(ss) {
					if (this.rules) {
						this.rules = {};
					}
					try {
						var ssRules = ss.cssRules || ss.rules;
						for (var j = ssRules.length - 1; j >= 0; --j) {
							this.rules[ssRules[j].selectorText] = ssRules[j];
						}
					} catch (e) {
					}
				},
				getRules : function(refreshCache) {
					if (this.rules == null || refreshCache) {
						this.rules = {};
						if (doc) {
							var ds = doc.styleSheets;
							for (var i = 0, len = ds.length; i < len; i++) {
								try {
									this.cacheStyleSheet(ds[i]);
								} catch (e) {
								}
							}
						}
					}
					return this.rules;
				},
				getRule : function(selector, refreshCache) {
					var rs = this.getRules(refreshCache);
					if (!Ext.isArray(selector)) {
						return rs[selector];
					}
					for (var i = 0; i < selector.length; i++) {
						if (rs[selector[i]]) {
							return rs[selector[i]];
						}
					}
					return null;
				},
				updateRule : function(selector, property, value) {
					if (!Ext.isArray(selector)) {
						var rule = this.getRule(selector);
						if (rule) {
							rule.style[property.replace(styleCamelRe,
									styleCamelFn)] = value;
							return true;
						}
					} else {
						for (var i = 0; i < selector.length; i++) {
							if (this.updateRule(selector[i], property, value)) {
								return true;
							}
						}
					}
					return false;
				}
			};
		}
	};
	var tools = [{
			id : 'gear',
			handler : function() {
				Ext.Msg.alert('Message', 'The Settings tool was clicked.');
			}
		}, {
			id : 'close',
			handler : function(e, target, panel) {
				panel.ownerCt.remove(panel, true);
			}
		}];
	Ext.ux.ManagedIframePanel = Ext.extend(Ext.Panel, {
		defaultSrc : null,
		bodyStyle : {
			position : "relative"
		},
		tools : tools,
		frameStyle : {
			overflow : "auto"
		},
		frameConfig : null,
		hideMode : !Ext.isIE ? "nosize" : "display",
		shimCls : "x-frame-shim",
		shimUrl : null,
		loadMask : false,
		stateful : false,
		animCollapse : Ext.isIE && Ext.enableFx,
		autoScroll : false,
		closable : true,
		ctype : "Ext.ux.ManagedIframePanel",
		showLoadIndicator : false,
		unsupportedText : "Inline frames are NOT enabled/supported by your browser.",
		initComponent : function() {
			var f = this.frameConfig ? this.frameConfig.autoCreate
					|| this.frameConfig : {};
			var frCfg = Ext.apply(f, {
						id : f.id || Ext.id()
					});
			frCfg.name = f.name || frCfg.id;
			if (Ext.isIE && Ext.isSecure) {
				frCfg.src = Ext.SSL_SECURE_URL;
			}
			var frameTag = Ext.apply({
						tag : "iframe",
						frameborder : 0,
						cls : "x-managed-iframe",
						style : this.frameStyle || f.style || {}
					}, frCfg);
			var unsup = this.unsupportedText ? {
				tag : "noframes",
				html : this.unsupportedText
			} : [];
			this.bodyCfg || (this.bodyCfg = {
				cls : this.baseCls + "-body",
				children : this.contentEl ? [] : [frameTag].concat(unsup)
			});
			this.autoScroll = false;
			this.items = null;
			if (this.stateful !== false) {
				this.stateEvents || (this.stateEvents = ["documentloaded"]);
			}
			Ext.ux.ManagedIframePanel.superclass.initComponent.call(this);
			this.monitorResize || (this.monitorResize = !!this.fitToParent);
			this.addEvents({
						documentloaded : true,
						domready : true,
						message : true,
						exception : true,
						blur : true,
						focus : true
					});
			this.addListener = this.on;
		},
		doLayout : function() {
			if (this.fitToParent && !this.ownerCt) {
				var pos = this.getPosition(), size = (Ext.get(this.fitToParent) || this
						.getEl().parent()).getViewSize();
				this.setSize(size.width - pos[0], size.height - pos[1]);
			}
			Ext.ux.ManagedIframePanel.superclass.doLayout
					.apply(this, arguments);
		},
		beforeDestroy : function() {
			if (this.rendered) {
				if (this.tools) {
					for (var k in this.tools) {
						Ext.destroy(this.tools[k]);
					}
				}
				if (this.header && this.headerAsText) {
					var s;
					if (s = this.header.child("span")) {
						s.remove(true, true);
					}
					this.header.update("");
				}
				Ext.each(["iframe", "shim", "header", "topToolbar",
								"bottomToolbar", "footer", "loadMask", "body",
								"bwrap"], function(elName) {
							if (this[elName]) {
								if (typeof this[elName].destroy == "function") {
									this[elName].destroy();
								} else {
									Ext.destroy(this[elName]);
								}
								this[elName] = null;
								delete this[elName];
							}
						}, this);
			}
			Ext.ux.ManagedIframePanel.superclass.beforeDestroy.call(this);
		},
		onDestroy : function() {
			Ext.Panel.superclass.onDestroy.call(this);
		},
		afterRender : function(container) {
			var html = this.html;
			delete this.html;
			Ext.ux.ManagedIframePanel.superclass.afterRender.apply(this,
					arguments);
			if (this.iframe = this.body.child("iframe")) {
				this.iframe.ownerCt = this;
				if (this.loadMask) {
					var mEl;
					if (mEl = this.loadMask.maskEl) {
						(this[mEl] || mEl || this.body).addClass(MASK_TARGET);
					}
					this.loadMask = Ext.apply({
								disabled : false,
								hideOnReady : false
							}, this.loadMask);
				}
				this.getUpdater().showLoadIndicator = this.showLoadIndicator || false;
				var ownerCt = this.ownerCt;
				while (ownerCt) {
					ownerCt.on("afterlayout", function(container, layout) {
								var MIM = Ext.ux.ManagedIFrame.Manager, st = false;
								Ext.each(["north", "south", "east", "west"],
										function(region) {
											var reg;
											if ((reg = layout[region])
													&& reg.splitEl) {
												st = true;
												if (!reg.split._splitTrapped) {
													reg.split.on(
															"beforeresize",
															MIM.showShims, MIM);
													reg.split._splitTrapped = true;
												}
											}
										}, this);
								if (st && !this._splitTrapped) {
									this.on("resize", MIM.hideShims, MIM);
									this._splitTrapped = true;
								}
							}, this, {
								single : true
							});
					ownerCt = ownerCt.ownerCt;
				}
				this.shim = Ext.get(this.body.child("." + this.shimCls))
						|| Ext.DomHelper.append(this.body, {
									tag : "img",
									src : this.shimUrl || Ext.BLANK_IMAGE_URL,
									cls : this.shimCls,
									galleryimg : "no"
								}, true);
				var El = Ext.Element;
				var mode = El[this.hideMode.toUpperCase()] || "x-hide-nosize";
				Ext.each([this[this.collapseEl],
								this.floating ? null : this.getActionEl(),
								this.iframe], function(el) {
							if (el) {
								el.setVisibilityMode(mode);
							}
						}, this);
				if (this.iframe = new Ext.ux.ManagedIFrame(this.iframe, {
							loadMask : this.loadMask,
							showLoadIndicator : this.showLoadIndicator,
							disableMessaging : this.disableMessaging,
							style : this.frameStyle,
							src : this.defaultSrc,
							html : html
						})) {
					this.loadMask = this.iframe.loadMask;
					this.iframe.ownerCt = this;
					this.relayEvents(this.iframe, ["blur", "focus", "unload",
									"documentloaded", "domready", "exception",
									"message"].concat(this._msgTagHandlers
									|| []));
					delete this._msgTagHandlers;
				}
			}
		},
		sendMessage : function() {
			if (this.iframe) {
				this.iframe.sendMessage.apply(this.iframe, arguments);
			}
		},
		filterOptRe : /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
		on : function(name) {
			var tagRE = /^message\:/i, n = null;
			if (typeof name == "object") {
				for (var na in name) {
					if (!this.filterOptRe.test(na) && tagRE.test(na)) {
						n || (n = []);
						n.push(na.toLowerCase());
					}
				}
			} else {
				if (tagRE.test(name)) {
					n = [name.toLowerCase()];
				}
			}
			if (this.getFrame() && n) {
				this.relayEvents(this.iframe, n);
			} else {
				this._msgTagHandlers || (this._msgTagHandlers = []);
				if (n) {
					this._msgTagHandlers = this._msgTagHandlers.concat(n);
				}
			}
			Ext.ux.ManagedIframePanel.superclass.on.apply(this, arguments);
		},
		setSrc : function(url, discardUrl, callback, scope) {
			url = url || this.defaultSrc || false;
			if (url && this.rendered && this.iframe) {
				this.iframe.setSrc.call(this.iframe, url, discardUrl, callback,
						scope);
			}
			return this;
		},
		setLocation : function(url, discardUrl, callback, scope) {
			url = url || this.defaultSrc || false;
			if (url && this.rendered && this.iframe) {
				this.iframe.setLocation.call(this.iframe, url, discardUrl,
						callback, scope);
			}
			return this;
		},
		getState : function() {
			var URI = this.iframe ? this.iframe.getDocumentURI() || null : null;
			return Ext.apply(Ext.ux.ManagedIframePanel.superclass.getState
							.call(this)
							|| {}, URI ? {
						defaultSrc : typeof URI == "function" ? URI() : URI
					} : null);
		},
		getUpdater : function() {
			return this.rendered
					? (this.iframe || this.body).getUpdater()
					: null;
		},
		getFrame : function() {
			return this.rendered ? this.iframe : null;
		},
		getFrameWindow : function() {
			return this.rendered && this.iframe
					? this.iframe.getWindow()
					: null;
		},
		getFrameDocument : function() {
			return this.rendered && this.iframe
					? this.iframe.getDocument()
					: null;
		},
		getFrameDoc : function() {
			return this.rendered && this.iframe ? this.iframe.getDoc() : null;
		},
		getFrameBody : function() {
			return this.rendered && this.iframe ? this.iframe.getBody() : null;
		},
		load : function(loadCfg) {
			var um;
			if (um = this.getUpdater()) {
				if (loadCfg && loadCfg.renderer) {
					um.setRenderer(loadCfg.renderer);
					delete loadCfg.renderer;
				}
				um.update.apply(um, arguments);
			}
			return this;
		},
		doAutoLoad : function() {
			this.load(typeof this.autoLoad == "object" ? this.autoLoad : {
				url : this.autoLoad
			});
		}
	});
	Ext.ux.ManagedIFrame.Manager = MIM = function() {
		var frames = {};
		var implementation = {
			readyHandler : function(e) {
				try {
					var $frame = e.target.ownerEl;
					if ($frame && $frame._frameAction) {
						$frame.loadHandler.call($frame, {
									type : "domready"
								});
					}
				} catch (rhEx) {
					return;
				}
			},
			shimCls : "x-frame-shim",
			register : function(frame) {
				frame.manager = this;
				frames[frame.id] = frames[frame.dom.name] = {
					ref : frame,
					elCache : {}
				};
				frame.dom[Ext.isIE ? "onreadystatechange" : "onload"] = frame.loadHandler
						.createDelegate(frame);
				return frame;
			},
			deRegister : function(frame) {
				frame._unHook();
				frame.dom.onload = frame.dom.onreadystatechange = null;
				delete frames[frame.id];
				delete frames[frame.dom.name];
			},
			hideShims : function() {
				if (!this.shimApplied) {
					return;
				}
				Ext.select("." + this.shimCls, true).removeClass(this.shimCls
						+ "-on");
				this.shimApplied = false;
			},
			showShims : function() {
				if (!this.shimApplied) {
					this.shimApplied = true;
					Ext.select("." + this.shimCls, true).addClass(this.shimCls
							+ "-on");
				}
			},
			getFrameById : function(id) {
				return typeof id == "string" ? (frames[id] ? frames[id].ref
						|| null : null) : null;
			},
			getFrameByName : function(name) {
				return this.getFrameById(name);
			},
			getFrameHash : function(frame) {
				return frame.id ? frames[frame.id] : null;
			},
			eventProxy : function(e) {
				if (!e) {
					return;
				}
				e = Ext.EventObject.setEvent(e);
				var be = e.browserEvent || e;
				(e.type == "unload") && this._unHook();
				if (!be["eventPhase"]
						|| (be["eventPhase"] == (be["AT_TARGET"] || 2))) {
					return this.fireEvent(e.type, e);
				}
			},
			_flyweights : {},
			destroy : function() {
				if (document.addEventListener) {
					window.removeEventListener("DOMFrameContentLoaded",
							this.readyHandler, true);
				}
				delete this._flyweights;
			},
			removeNode : Ext.isIE ? function(frame, n) {
				frame = MIM.getFrameHash(frame);
				if (frame && n && n.tagName != "BODY") {
					d = frame.scratchDiv
							|| (frame.scratchDiv = frame.getDocument()
									.createElement("div"));
					d.appendChild(n);
					d.innerHTML = "";
				}
			} : function(frame, n) {
				if (n && n.parentNode && n.tagName != "BODY") {
					n.parentNode.removeChild(n);
				}
			}
		};
		if (document.addEventListener) {
			window.addEventListener("DOMFrameContentLoaded",
					implementation.readyHandler, true);
		}
		Ext.EventManager.on(window, "beforeunload", implementation.destroy,
				implementation);
		return implementation;
	}();
	MIM.showDragMask = MIM.showShims;
	MIM.hideDragMask = MIM.hideShims;
	MIM.El = function(frame, el, forceNew) {
		var frameObj;
		frame = (frameObj = MIM.getFrameHash(frame)) ? frameObj.ref : null;
		if (!frame) {
			return null;
		}
		var elCache = frameObj.elCache || (frameObj.elCache = {});
		var dom = frame.getDom(el);
		if (!dom) {
			return null;
		}
		var id = dom.id;
		if (forceNew !== true && id && elCache[id]) {
			return elCache[id];
		}
		this.dom = dom;
		this.id = id || Ext.id(dom);
	};
	MIM.El.get = function(frame, el) {
		var ex, elm, id, doc;
		if (!frame || !el) {
			return null;
		}
		var frameObj;
		frame = (frameObj = MIM.getFrameHash(frame)) ? frameObj.ref : null;
		if (!frame) {
			return null;
		}
		var elCache = frameObj.elCache || (frameObj.elCache = {});
		if (!(doc = frame.getDocument())) {
			return null;
		}
		if (typeof el == "string") {
			if (!(elm = frame.getDom(el))) {
				return null;
			}
			if (ex = elCache[el]) {
				ex.dom = elm;
			} else {
				ex = elCache[el] = new MIM.El(frame, elm);
			}
			return ex;
		} else {
			if (el.tagName) {
				if (!(id = el.id)) {
					id = Ext.id(el);
				}
				if (ex = elCache[id]) {
					ex.dom = el;
				} else {
					ex = elCache[id] = new MIM.El(frame, el);
				}
				return ex;
			} else {
				if (el instanceof MIM.El) {
					if (el != frameObj.docEl) {
						el.dom = frame.getDom(el.id) || el.dom;
						elCache[el.id] = el;
					}
					return el;
				} else {
					if (el.isComposite) {
						return el;
					} else {
						if (Ext.isArray(el)) {
							return frame.select(el);
						} else {
							if (el == doc) {
								if (!frameObj.docEl) {
									var f = function() {
									};
									f.prototype = MIM.El.prototype;
									frameObj.docEl = new f();
									frameObj.docEl.dom = doc;
								}
								return frameObj.docEl;
							}
						}
					}
				}
			}
		}
		return null;
	};
	Ext.apply(MIM.El.prototype, Ext.Element.prototype);
	Ext.ns("Ext.ux.panel", "Ext.ux.portlet");
	Ext.reg("iframepanel",
			Ext.ux.panel.ManagedIframe = Ext.ux.ManagedIframePanel);
	Ext.ux.ManagedIframePortlet = Ext.extend(Ext.ux.ManagedIframePanel, {
				anchor : "100%",
				frame : true,
				collapseEl : "bwrap",
				collapsible : true,
				draggable : true,
				cls : "x-portlet"
			});
	Ext.reg("iframeportlet",
			Ext.ux.portlet.ManagedIframe = Ext.ux.ManagedIframePortlet);
	Ext.apply(Ext.Element.prototype, {
		setVisible : function(visible, animate) {
			if (!animate || !Ext.lib.Anim) {
				if (this.visibilityMode == Ext.Element.DISPLAY) {
					this.setDisplayed(visible);
				} else {
					if (this.visibilityMode == Ext.Element.VISIBILITY) {
						this.fixDisplay();
						this.dom.style.visibility = visible
								? "visible"
								: "hidden";
					} else {
						this[visible ? "removeClass" : "addClass"](String(this.visibilityMode));
					}
				}
			} else {
				var dom = this.dom;
				var visMode = this.visibilityMode;
				if (visible) {
					this.setOpacity(0.01);
					this.setVisible(true);
				}
				this.anim({
							opacity : {
								to : (visible ? 1 : 0)
							}
						}, this.preanim(arguments, 1), null, 0.35, "easeIn",
						function() {
							if (!visible) {
								if (visMode == Ext.Element.DISPLAY) {
									dom.style.display = "none";
								} else {
									if (visMode == Ext.Element.VISIBILITY) {
										dom.style.visibility = "hidden";
									} else {
										Ext.get(dom).addClass(String(visMode));
									}
								}
								Ext.get(dom).setOpacity(1);
							}
						});
			}
			return this;
		},
		isVisible : function(deep) {
			var vis = !(this.hasClass(this.visibilityMode)
					|| this.getStyle("visibility") == "hidden" || this
					.getStyle("display") == "none");
			if (deep !== true || !vis) {
				return vis;
			}
			var p = this.dom.parentNode;
			while (p && p.tagName.toLowerCase() != "body") {
				if (!Ext.fly(p, "_isVisible").isVisible()) {
					return false;
				}
				p = p.parentNode;
			}
			return true;
		}
	});
	Ext.onReady(function() {
		var CSS = Ext.util.CSS, rules = [];
		CSS.getRule(".x-managed-iframe")
				|| (rules
						.push(".x-managed-iframe {height:100%;width:100%;overflow:auto;position:relative;}"));
		CSS.getRule("." + MASK_TARGET)
				|| (rules.push("." + MASK_TARGET
								+ "{position:relative;zoom:1;}", "."
								+ MASK_TARGET
								+ " .ext-el-mask-msg{z-index:101!important;} "));
		if (!CSS.getRule(".x-frame-shim")) {
			rules
					.push(".x-frame-shim {z-index:8500;position:absolute;top:0px;left:0px;background:transparent!important;overflow:hidden;display:none;}");
			rules
					.push(".x-frame-shim-on{width:100%;height:100%;display:block;zoom:1;}");
			rules
					.push(".ext-ie6 .x-frame-shim{margin-left:5px;margin-top:3px;}");
		}
		CSS.getRule(".x-hide-nosize")
				|| (rules
						.push(".x-hide-nosize,.x-hide-nosize *{height:0px!important;width:0px!important;border:none;}"));
		if (!!rules.length) {
			CSS.createStyleSheet(rules.join(" "));
		}
	});
})();
if (Ext.provide) {
	Ext.provide("miframe");
}