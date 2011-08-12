Ext.ns('Ext.ux.grid');
Ext.ux.grid.Search = function(config) {
	Ext.apply(this, config);
	Ext.ux.grid.Search.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.grid.Search, Ext.util.Observable, {
	searchText : 'Search',
	searchTipText : 'Type a text to search and press Enter',
	selectAllText : 'Select All',
	position : 'bottom',
	iconCls : 'icon-magnifier',
	checkIndexes : 'all',
	disableIndexes : [],
	dateFormat : undefined,
	showSelectAll : true,
	menuStyle : 'checkbox',
	minCharsTipText : 'Type at least {0} characters',
	mode : 'remote',
	width : 100,
	xtype : 'gridsearch',
	paramNames : {
		fields : 'fields',
		query : 'query'
	},
	tbPosition : 0,
	shortcutKey : 'r',
	shortcutModifier : 'alt',
	init : function(grid) {
		this.grid = grid;
		if ('string' === typeof this.toolbarContainer) {
			this.toolbarContainer = Ext.getCmp(this.toolbarContainer);
		}
		grid.onRender = grid.onRender.createSequence(this.onRender, this);
		grid.reconfigure = grid.reconfigure.createSequence(this.reconfigure,
				this);
	},
	onRender : function() {
		var panel = this.toolbarContainer || this.grid;
		var tb = 'bottom' === this.position ? panel.bottomToolbar
				: panel.topToolbar;
		this.menu = new Ext.menu.Menu();
		if ('right' === this.align) {
			tb.insert(this.tbPosition, '->');
		} else {
			tb.insert(this.tbPosition, '-');
		}
		this.tbPosition++;
		tb.insert(this.tbPosition, {
			text : this.searchText,
			menu : this.menu,
			iconCls : this.iconCls
		});
		this.tbPosition++;
		this.field = new Ext.form.TwinTriggerField( {
			width : this.width,
			selectOnFocus : undefined === this.selectOnFocus ? true
					: this.selectOnFocus,
			trigger1Class : 'x-form-clear-trigger',
			trigger2Class : this.minChars ? 'x-hidden'
					: 'x-form-search-trigger',
			onTrigger1Click : this.minChars ? Ext.emptyFn : this.onTriggerClear
					.createDelegate(this),
			onTrigger2Click : this.onTriggerSearch.createDelegate(this),
			minLength : this.minLength
		});
		this.field.on('render', function() {
			this.field.el.dom.qtip = this.minChars ? String.format(
					this.minCharsTipText, this.minChars) : this.searchTipText;
			if (this.minChars) {
				this.field.el.on( {
					scope : this,
					buffer : 300,
					keyup : this.onKeyUp
				});
			}
			var map = new Ext.KeyMap(this.field.el, [ {
				key : Ext.EventObject.ENTER,
				scope : this,
				fn : this.onTriggerSearch
			}, {
				key : Ext.EventObject.ESC,
				scope : this,
				fn : this.onTriggerClear
			} ]);
			map.stopEvent = true;
		}, this, {
			single : true
		});
		tb.insert(this.tbPosition, this.field);
		this.reconfigure();
		if (this.shortcutKey && this.shortcutModifier) {
			var shortcutEl = this.grid.getEl();
			var shortcutCfg = [ {
				key : this.shortcutKey,
				scope : this,
				stopEvent : true,
				fn : function() {
					this.field.focus();
				}
			} ];
			shortcutCfg[0][this.shortcutModifier] = true;
			this.keymap = new Ext.KeyMap(shortcutEl, shortcutCfg);
		}
		if (true === this.autoFocus) {
			this.grid.store.on( {
				scope : this,
				load : function() {
					this.field.focus();
				}
			});
		}
	},
	onKeyUp : function() {
		var length = this.field.getValue().toString().length;
		if (0 === length || this.minChars <= length) {
			this.onTriggerSearch();
		}
	},
	onTriggerClear : function() {
		if (this.field.getValue()) {
			this.field.setValue('');
			this.field.focus();
			this.onTriggerSearch();
		}
	},
	onTriggerSearch : function() {
		if (!this.field.isValid()) {
			return;
		}
		var val = this.field.getValue();
		var store = this.grid.store;
		if ('local' === this.mode) {
			store.clearFilter();
			if (val) {
				store.filterBy(function(r) {
					var retval = false;
					this.menu.items.each(function(item) {
						if (!item.checked || retval) {
							return;
						}
						var rv = r.get(item.dataIndex);
						rv = rv instanceof Date ? rv.format(this.dateFormat
								|| r.fields.get(item.dataIndex).dateFormat)
								: rv;
						var re = new RegExp(val, 'gi');
						retval = re.test(rv);
					}, this);
					if (retval) {
						return true;
					}
					return retval;
				}, this);
			} else {
			}
		} else {
			if (store.lastOptions && store.lastOptions.params) {
				store.lastOptions.params[store.paramNames.start] = 0;
			}
			var fields = [];
			this.menu.items.each(function(item) {
				if (item.checked) {
					fields.push(item.dataIndex);
				}
			});
			delete (store.baseParams[this.paramNames.fields]);
			delete (store.baseParams[this.paramNames.query]);
			if (store.lastOptions && store.lastOptions.params) {
				delete (store.lastOptions.params[this.paramNames.fields]);
				delete (store.lastOptions.params[this.paramNames.query]);
			}
			if (fields.length) {
				store.baseParams[this.paramNames.fields] = Ext.encode(fields);
				store.baseParams[this.paramNames.query] = val;
			}
			store.proxy.getConnection().abort();
			store.reload();
		}
	},
	setDisabled : function() {
		this.field.setDisabled.apply(this.field, arguments);
	},
	enable : function() {
		this.setDisabled(false);
	},
	disable : function() {
		this.setDisabled(true);
	},
	reconfigure : function() {
		var menu = this.menu;
		menu.removeAll();
		if (this.showSelectAll && 'radio' !== this.menuStyle) {
			menu.add(new Ext.menu.CheckItem( {
				text : this.selectAllText,
				checked : !(this.checkIndexes instanceof Array),
				hideOnClick : false,
				handler : function(item) {
					var checked = !item.checked;
					item.parentMenu.items.each(function(i) {
						if (item !== i && i.setChecked && !i.disabled) {
							i.setChecked(checked);
						}
					});
				}
			}), '-');
		}
		var cm = this.grid.colModel;
		var group = undefined;
		if ('radio' === this.menuStyle) {
			group = 'g' + (new Date).getTime();
		}
		Ext.each(cm.config, function(config) {
			var disable = false;
			if (config.header && config.dataIndex) {
				Ext.each(this.disableIndexes, function(item) {
					disable = disable ? disable : item === config.dataIndex;
				});
				if (!disable) {
					menu.add(new Ext.menu.CheckItem( {
						text : config.header,
						hideOnClick : false,
						group : group,
						checked : 'all' === this.checkIndexes,
						dataIndex : config.dataIndex
					}));
				}
			}
		}, this);
		if (this.checkIndexes instanceof Array) {
			Ext.each(this.checkIndexes, function(di) {
				var item = menu.items.find(function(itm) {
					return itm.dataIndex === di;
				});
				if (item) {
					item.setChecked(true, true);
				}
			}, this);
		}
		if (this.readonlyIndexes instanceof Array) {
			Ext.each(this.readonlyIndexes, function(di) {
				var item = menu.items.find(function(itm) {
					return itm.dataIndex === di;
				});
				if (item) {
					item.disable();
				}
			}, this);
		}
	}
});