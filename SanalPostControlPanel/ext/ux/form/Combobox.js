Ext.override(Ext.form.ComboBox, {
			setValue : function(v) {
				// begin patch
				// Store not loaded yet? Set value when it *is* loaded.
				// Defer the setValue call until after the next load.
				if (this.store.getCount() == 0) {
					this.store.on('load', this.setValue.createDelegate(this,
									[v]), null, {
								single : true
							});
					return;
				}
				// end patch
				var text = v;
				if (this.valueField) {
					var r = this.findRecord(this.valueField, v);
					if (r) {
						text = r.data[this.displayField];
					} else if (this.valueNotFoundText !== undefined) {
						text = this.valueNotFoundText;
					}
				}
				this.lastSelectionText = text;
				if (this.hiddenField) {
					this.hiddenField.value = v;
				}
				Ext.form.ComboBox.superclass.setValue.call(this, text);
				this.value = v;
			//	out("setValue")
			},
			onTypeAhead : function() {
			//	out("herer");
			}
		});