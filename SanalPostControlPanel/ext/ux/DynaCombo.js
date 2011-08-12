function comboReloadSetValue(combo,value){
	combo.getStore().reload({
		params: {
			VALUEFIELD: (combo.valueField || combo.displayField) + "='" + value + "'" // eğer null ise valuefield displayfield gönderilir
		},
		callback: function(){
			combo.setValue(value);
		}
	});
	//console.log(combo.el.dom);
    //console.log(combo.getStore().data.items[0].json);
}

Ext.ns("Asistan.myNameSpace");
Asistan.myNameSpace.DynaCombo = Ext.extend(Ext.form.ComboBox, {
    initComponent : function() {
        var cField = this.field;
        var cNo = this.no;
        var cTable = this.table;
        var cWhere = this.where;
        var cListeners = this.listeners;
        var cTpl = this.tpl;
        var cUrl = this.url ? this.url : Asistan.System.Baseurl + '/application.php?way=system&case=fetchCombo';
        var efield = typeof this.extraField !== "undefined" ? this.extraField : "";
        var store = new Ext.data.JsonStore({
            url : cUrl,
            remoteSort : true,
            totalProperty : "totalCount",
            root : "result",
            sortInfo : {
                field : cField,
                direction : "ASC"
            },
            baseParams : {
                selectOne: '0',
                fields : Ext.encode([cField, efield]),
                table : cTable,
                where : Ext.encode(cWhere)
            },
            fields : [{
                name : cNo
            }, {
                name : cField,
                type : 'string'
            }, {
                name : efield
            }]
        });
        var config = {
            selectOnFocus : true,
            displayField : cField,
            valueField : cNo,
            mode : 'remote',
            store : store,
            tpl : cTpl,
            listeners : cListeners
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        Asistan.myNameSpace.DynaCombo.superclass.initComponent.apply(this, arguments);
    },
    onRender : function() {
        Asistan.myNameSpace.DynaCombo.superclass.onRender.apply(this,arguments);
    }
});
Ext.reg("dynaCombo", Asistan.myNameSpace.DynaCombo)