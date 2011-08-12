Ext.namespace('Asistan', 'Asistan.Il', 'Asistan.Ilce');
Asistan.Il.ComboBox = Ext.extend(Ext.form.ComboBox, {
    initComponent: function(){
        store = new Ext.data.JsonStore({
            url: 'Php/fetch.php?il=true',
            remoteSort: true,
            totalProperty: "totalCount",
            root: "result",
            autoLoad: true,
            sortInfo: {
                field: "adi",
                direction: "ASC"
            },
            fields: [{
                name: 'id',
                mapping: 'ID',
                type: 'int'
            }, {
                name: 'adi',
                mapping: 'SEHIR',
                type: 'string'
            }]
        });
        var config = {
            displayField: 'adi',
            valueField: 'id',
            mode: 'local',
            store: store
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        Asistan.Il.ComboBox.superclass.initComponent.apply(this, arguments);
    },
    listeners: {
        select: function(combo, record, index){
            try {
                this.findParentBy(function(f) {
                    if (f instanceof Ext.form.FormPanel) {
                        f.findBy(function(c) {
							if(c.name=="ilID"){
							c.setValue(combo.getValue());
							}
							  
                            if (c instanceof Asistan.Ilce.ComboBox) {
                                c.store.load({
                                    params: {
                                        where: Ext.encode([{
                                            field: 'il_id'
                                            ,
                                            value: combo.getValue()
                                            ,
                                            whereType: 'and'
                                            ,
                                            searchType: 'default'
                                            ,
                                            queryType: 0
                                        }])
                                    }
                                });
								
                                //console.log("ilce loaded");
                                //	console.log(combo.getValue());
								
                                c.setDisabled(false);
                            }
                        });
						
                    }
                });
            } catch (e) {
            //console.log('we have a zirius problem !!!...');
            }
        }
    },
    onRender: function(){
        Asistan.Il.ComboBox.superclass.onRender.apply(this, arguments);
    }
});
Ext.reg('Asistan.Il.ComboBox', Asistan.Il.ComboBox);

Asistan.Ilce.ComboBox = Ext.extend(Ext.form.ComboBox, {
    initComponent: function(){
        store = new Ext.data.JsonStore({
            url: 'Php/fetch.php?ilce=true',
            remoteSort: true,
            totalProperty: "totalCount",
            root: "result",
            sortInfo: {
                field: "adi",
                direction: "ASC"
            },
            fields: [{
                name: 'id',
                mapping: 'RECNO',
                type: 'int'
            }, {
                name: 'adi',
                mapping: 'ILCE',
                type: 'string'
            }]
        });
        var config = {
            displayField: 'adi',
            valueField: 'id',
            mode: 'local',
            disabled: true,
            store: store
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        Asistan.Ilce.ComboBox.superclass.initComponent.apply(this, arguments);
    },
	listeners: {
        select: function(combo, record, index){
            try {
                this.findParentBy(function(f) {
                    if (f instanceof Ext.form.FormPanel) {
                        f.findBy(function(c) {
							if(c.name=="ilceID"){
							c.setValue(combo.getValue());
							}
                        });
						
                    }
                });
            } catch (e) {
            }
        }
    },
    onRender: function(){
        Asistan.Ilce.ComboBox.superclass.onRender.apply(this, arguments);
    }
});
Ext.reg('Asistan.Ilce.ComboBox', Asistan.Ilce.ComboBox);