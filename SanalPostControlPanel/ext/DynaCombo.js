function comboReloadSetValue(combo,value){
	combo.getStore().reload({
		params: {
			VALUEFIELD: (combo.valueField || combo.displayField) + "='" + value + "'" // eğer null ise valuefield displayfield gönderilir
		},
		callback: function(){
			combo.setValue(value);
		}
	});
}
