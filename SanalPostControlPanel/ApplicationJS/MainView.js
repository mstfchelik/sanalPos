/*function BankaEkleDuzenleFormu(type) {
    var selected = depGrid.getSelectionModel().getSelected();
    var bankaFormu = new Ext.form.FormPanel({
        layout : 'form',
        defaults : {
            xtype : 'textfield',
            anchor : '100%'
        },
        labelAlign : 'left',
        items : [{
            xtype : 'hidden',
            name : 'id'
        }, {
            allowBlank : false,
            name : 'banka',
            fieldLabel : "Banka Adi"
        }]
    });
			
    var bankaWin = new Ext.Window({
        modal : true,
        height : 90,
        width : 360,
        items : bankaFormu,
        title : "Banka Ekleme-Duzenleme Formu",
        buttons : [{
            text : "Kaydet",
            handler : function() {
                if (type === 0) {
                    if (bankaFormu.getForm().isValid()) {
                    	bankaFormu.getForm().submit({
                            url : Asistan.System.Baseurl
                            + "/application.php?way=banka&case=insert",

                            success : function(a, b, c) {
                            	bankaWin.close();
                                depGrid.getStore().reload();

                            }
                        })
                    }
                } else if (type === 1) {
                    if (bankaFormu.getForm().isValid()) {
                    	bankaFormu.getForm().submit({
                            params : {
                                RECNO : selected.json.id
                            },
                            url : Asistan.System.Baseurl
                            + "/application.php?way=banka&case=update",
                            success : function(a, b, c) {
                            	bankaWin.close();
                                depGrid.getStore().reload();
                            }
                        })
                    }
                }
            }
        }, {
            text : ".CANCEL,
            handler : function() {
                this.findParentByType(Ext.Window).close();
            }
        }]
    });
    bankaWin.show();
    if (type === 1) {
    	bankaFormu.getForm().setValues(selected.json);
    	bankaFormu.getForm().findField("id")
        .setRawValue(selected.json.id);
    	bankaFormu.getForm().findField("banka")
        .setRawValue(selected.json.banka);
    }
}

function deleteBank(grid) {

    Ext.Ajax.request({
        url : Asistan.System.Baseurl
        + '/application.php?way=departmanTan&case=delete',
        method : 'post',
        params : {
            id : grid.getSelectionModel().getSelected().json.DEPARTMAN_NO
        },
        callback : function(options, success, response) {
            grid.getStore().reload();
        }
    });
}
*/
// ILK PANEL ICIN KODLAMA BASLIYOR...........
var xmlDocName="and-outdoor.xml";
var eventStore = new Ext.data.JsonStore({
			url : 'Php/fetch.php?event=true&xmlDocName='+xmlDocName,
			remoteSort : true,
			totalProperty : "totalCount",
			root : "result",
			sortInfo : {
				field : "etkinlikBaslik",
				direction : "ASC"
			},
			fields : ['id', 'dbCategoryName', 'karOrani', 'xmlCategoryName','xmlCategoryID','DBCategoryID']
		});

function readFromXML(DocName){

     Ext.Ajax.request({
			url : 'Php/insert.php?xmlInsertcategory=true&xmlDocName='+DocName,
			method : 'post',
			callback : function(options, success, response) {
			 var restemp = Ext.decode(response.responseText);

			if(restemp.success){
				Ext.Msg.alert('Mesaj', 'Kategoriler başarılı şekilde yüklendi');
			}

			}

			});
	

}


function saveToDB(DocName){
    if(DocName=="and-outdoor.xml"){
    if (centerPanel.getForm().isValid()) {
        centerPanel.getForm().submit({
							url : 'Php/insert.php?saveDB=true&xmlDocName='+DocName,
							success : function(a, b, c) {
                                xmlCategoryStore.reload();
								ustGrid.getStore().reload();
							}
						});
}
    }else if(DocName=="index-pazar.xml"){
      if (IndexPazarcenterPanel.getForm().isValid()) {
        IndexPazarcenterPanel.getForm().submit({
							url : 'Php/insert.php?saveDB=true&xmlDocName='+DocName,
							success : function(a, b, c) {
                                IndexPazarxmlCategoryStore.reload();
								IndexPazarustGrid.getStore().reload();
                               
							}
						});
        }
    }else if(DocName=="spor-servisi.xml"){
      if (sporServisicenterPanel.getForm().isValid()) {
        sporServisicenterPanel.getForm().submit({
							url : 'Php/insert.php?saveDB=true&xmlDocName='+DocName,
							success : function(a, b, c) {
                                sporServisixmlCategoryStore.reload();
								sporServisiustGrid.getStore().reload();
                               
							}
						});
        }
    }

}


var eventCategoryStore = new Ext.data.JsonStore({
			url : 'Php/fetch.php?eventcategory=true',
			remoteSort : true,
			totalProperty : "totalCount",
			root : "result",
			sortInfo : {
				field : "category",
				direction : "ASC"
			},
			fields : ['id', 'category'],
			listeners : {
				select : function (cb, record) {
					//createEditEventForm.getForm().findField('etkinlikTurID').setValue(record.data.id);
				}
			}
		});


var xmlCategoryStore = new Ext.data.JsonStore({
			url : 'Php/fetch.php?xmlcategory=true&xmldocName=and-outdoor.xml',
			remoteSort : true,
			totalProperty : "totalCount",
			root : "result",
			sortInfo : {
				field : "categoryName",
				direction : "ASC"
			},
			fields : ['id', 'categoryName'],
			listeners : {
				select : function (cb, record) {
					//createEditEventForm.getForm().findField('etkinlikTurID').setValue(record.data.id);
				}
			}
		});


var ustGrid = new Ext.grid.GridPanel({
            region : 'center',
			store : eventStore,
			title : 'Banka Listesi',
			paging : true,
			fullscreen: true,
			plugins : [new Ext.ux.grid.Search()],
			loadMask : true,
            listeners : {
            'rowclick' : function(g, i, e) {
             
                centerPanel.getForm().setValues(g.getStore().getAt(i).json);
                centerPanel.getForm().findField('xmlCat').setRawValue(g.getStore().getAt(i).json.xmlCategoryName);
                centerPanel.getForm().findField('veritabaniCat').setRawValue(g.getStore().getAt(i).json.dbCategoryName);
                 


            }
            },
			cm : new Ext.grid.ColumnModel([ {
						header : "Sıra",
						width : 100,
						sortable : true,
						dataIndex : 'id'
					}, {
						header : "Banka Adı",
						width : 600,
						sortable : true,
						dataIndex : 'xmlCategoryName'
					}
				]),
				tbar: [{
					text: 'Ekle' 
					//handler:BankaEkleDuzenleFormu(0)
					 },
					 {
							text: 'Duzenle' 
							//handler:BankaEkleDuzenleFormu(1)
							 },
							 {
									text: 'Sil' 
									//handler: deleteBank(this)
							 }
					 ]

		});

	var centerPanel = new Ext.FormPanel({
		    labelWidth : 150,
			bodyStyle : 'padding:5px 5px 0',
			frame : true,
			region : 'center',
			title : 'XML Transfer',
			width : 270,
            height: 100,
			defaults : {
				xtype : 'textfield',
				labelAlign : 'top'
			},

			items : [ {
                     xtype : 'hidden',
                     id: 'xmlCategoryID'
                    },{
                     xtype : 'hidden',
                     id: 'DBCategoryID'
                    },{
						xtype : 'combo',
						id : 'xmlCat',
						fieldLabel : "XMLden okunan kategori",
						name : "xmlCat",
                        allowBlank:false,
						triggerAction : "all",
						loadingText : "Loading...",
                        anchor : '50%',
						//emptyText : "Kategori Seçiniz",
						store : xmlCategoryStore,
						mode : 'remote',
						displayField : "categoryName",
						valueField : "id",
						forceSelection : true,
						editable : true,
						listeners : {
							select : function (cb, record) {
                      
								 centerPanel.getForm().findField('xmlCategoryID').setValue(record.json.categoryId);
							}
						}
					},{
						xtype : 'combo',
						id : 'veritabaniCat',
						fieldLabel : "Veritabanındaki kategori",
						name : "veritabaniCat",
						triggerAction : "all",
                         allowBlank:false,
						loadingText : "Loading...",
                        anchor : '50%',
						//emptyText : "Kategori Seçiniz",
						store : eventCategoryStore,
						mode : 'remote',
						displayField : "category",
						valueField : "id",
						forceSelection : true,
						editable : true,
						listeners : {
							select : function (cb, record) {
								centerPanel.getForm().findField('DBCategoryID').setValue(record.json.id);
							}
						}
					}, {
					id : 'karOrani',
					anchor : '50%',
					name : 'karOrani',
                     allowBlank:false,
					fieldLabel : "Kar Oranı"
				}
			],

        buttons: [{
            text: 'XML verilerini Çek',
           handler: function(){
              readFromXML("and-outdoor.xml");
            
            }
        },{
            text: 'Kaydet',
             handler: function(){
                 saveToDB("and-outdoor.xml");

            }
        }]
		});
var mainPanel = new Ext.Panel({
			title : 'Bankalar Paneli',			
            id: '0',
            //items : [ centerPanel,ustGrid],
            items : [ ustGrid],
            listeners: {
                'tabchange': function(tabPanel, tab){
                   
                }
            }
		});
////ILK PANEL ICIN KODLAMA SON...................


// IKINCI PANEL ICIN KODLAMA BASLIYOR...........


var IndexPazareventStore = new Ext.data.JsonStore({
			url : 'Php/fetch.php?event=true&xmlDocName=index-pazar.xml',
			remoteSort : true,
			totalProperty : "totalCount",
			root : "result",
			sortInfo : {
				field : "etkinlikBaslik",
				direction : "ASC"
			},
			fields : ['id', 'dbCategoryName', 'karOrani', 'xmlCategoryName','xmlCategoryID','DBCategoryID']
		});


var IndexPazarxmlCategoryStore = new Ext.data.JsonStore({
			url : 'Php/fetch.php?xmlcategory=true&xmldocName=index-pazar.xml',
			remoteSort : true,
			totalProperty : "totalCount",
			root : "result",
			sortInfo : {
				field : "categoryName",
				direction : "ASC"
			},
			fields : ['id', 'categoryName'],
			listeners : {
				select : function (cb, record) {
					//createEditEventForm.getForm().findField('etkinlikTurID').setValue(record.data.id);
				}
			}
		});


var IndexPazarustGrid = new Ext.grid.GridPanel({
			height : 400,
			//width : 1000,
			frame : true,
            region : 'south',
			store : IndexPazareventStore,
			title : 'Kategorilendirme Listesi',
			paging : true,
			loadMask : true,
            listeners : {
            'rowclick' : function(g, i, e) {
                console.log(g.getStore().getAt(i).json);
                IndexPazarcenterPanel.getForm().setValues(g.getStore().getAt(i).json);
                IndexPazarcenterPanel.getForm().findField('IndexPazarxmlCat').setRawValue(g.getStore().getAt(i).json.xmlCategoryName);
                IndexPazarcenterPanel.getForm().findField('IndexPazarveritabaniCat').setRawValue(g.getStore().getAt(i).json.dbCategoryName);
                IndexPazarcenterPanel.getForm().findField('IndexPazarkarOrani').setRawValue(g.getStore().getAt(i).json.karOrani);

            }
            },
			cm : new Ext.grid.ColumnModel([ {
						header : "Sıra",
						width : 100,
						sortable : true,
						dataIndex : 'id'
					}, {
						header : "Xmlden Çekilen Kategori Adı",
						width : 200,
						sortable : true,
						dataIndex : 'xmlCategoryName'
					}, {
						header : "Veritabanındaki Kategori Adı",
						width : 200,
						sortable : true,
						dataIndex : 'dbCategoryName'
					},
                    {header : "Kar Oranı",
						width : 200,
						sortable : true,
						dataIndex : 'karOrani'

                    }
				])
		});

	var IndexPazarcenterPanel = new Ext.FormPanel({
		    labelWidth : 150,
			bodyStyle : 'padding:5px 5px 0',
			frame : true,
			region : 'center',
			title : 'XML Transfer',
			width : 270,
            height: 100,
			defaults : {
				xtype : 'textfield',
				labelAlign : 'top'
			},

			items : [ {
                     xtype : 'hidden',
                     id: 'xmlCategoryID'
                    },{
                     xtype : 'hidden',
                     id: 'DBCategoryID'
                    },{
						xtype : 'combo',
						id : 'IndexPazarxmlCat',
						fieldLabel : "XMLden okunan kategori",
						name : "IndexPazarxmlCat",
                        allowBlank:false,
						triggerAction : "all",
						loadingText : "Loading...",
                        anchor : '50%',
						//emptyText : "Kategori Seçiniz",
						store : IndexPazarxmlCategoryStore,
						mode : 'remote',
						displayField : "categoryName",
						valueField : "id",
						forceSelection : true,
						editable : true,
						listeners : {
							select : function (cb, record) {

								 IndexPazarcenterPanel.getForm().findField('xmlCategoryID').setValue(record.json.categoryId);
							}
						}
					},{
						xtype : 'combo',
						id : 'IndexPazarveritabaniCat',
						fieldLabel : "Veritabanındaki kategori",
						name : "IndexPazarveritabaniCat",
						triggerAction : "all",
                         allowBlank:false,
						loadingText : "Loading...",
                        anchor : '50%',
						//emptyText : "Kategori Seçiniz",
						store : eventCategoryStore,
						mode : 'remote',
						displayField : "category",
						valueField : "id",
						forceSelection : true,
						editable : true,
						listeners : {
							select : function (cb, record) {
								IndexPazarcenterPanel.getForm().findField('DBCategoryID').setValue(record.json.id);
							}
						}
					}, {
					id : 'IndexPazarkarOrani',
					anchor : '50%',
					name : 'IndexPazarkarOrani',
                     allowBlank:false,
					fieldLabel : "Kar Oranı"
				}
			],

        buttons: [{
            text: 'XML verilerini Çek',
           handler: function(){
              readFromXML("index-pazar.xml");

            }
        },{
            text: 'Kaydet',
             handler: function(){
                 saveToDB("index-pazar.xml");

            }
        }]
		});

var IndexPazarPanel = new Ext.Panel({
			title : 'Banka Istekleri Paneli',
			layout : 'border',
            id: '1',
            items : [ IndexPazarcenterPanel,IndexPazarustGrid]
            
		});
//IKINCI PANEL ICIN KODLAMA SON...................



// UCUNCU PANEL ICIN KODLAMA BASLIYOR...........


var sporServisieventStore = new Ext.data.JsonStore({
			url : 'Php/fetch.php?event=true&xmlDocName=spor-servisi.xml',
			remoteSort : true,
			totalProperty : "totalCount",
			root : "result",
			sortInfo : {
				field : "etkinlikBaslik",
				direction : "ASC"
			},
			fields : ['id', 'dbCategoryName', 'karOrani', 'xmlCategoryName','xmlCategoryID','DBCategoryID']
		});


var sporServisixmlCategoryStore = new Ext.data.JsonStore({
			url : 'Php/fetch.php?xmlcategory=true&xmldocName=spor-servisi.xml',
			remoteSort : true,
			totalProperty : "totalCount",
			root : "result",
			sortInfo : {
				field : "categoryName",
				direction : "ASC"
			},
			fields : ['id', 'categoryName'],
			listeners : {
				select : function (cb, record) {
					//createEditEventForm.getForm().findField('etkinlikTurID').setValue(record.data.id);
				}
			}
		});


var sporServisiustGrid = new Ext.grid.GridPanel({
			height : 400,
			//width : 1000,
			frame : true,
            region : 'south',
			store : sporServisieventStore,
			title : 'Kategorilendirme Listesi',
			paging : true,
			loadMask : true,
            listeners : {
            'rowclick' : function(g, i, e) {
                console.log(g.getStore().getAt(i).json);
                sporServisicenterPanel.getForm().setValues(g.getStore().getAt(i).json);
                sporServisicenterPanel.getForm().findField('sporServisixmlCat').setRawValue(g.getStore().getAt(i).json.xmlCategoryName);
                sporServisicenterPanel.getForm().findField('sporServisiveritabaniCat').setRawValue(g.getStore().getAt(i).json.dbCategoryName);
                sporServisicenterPanel.getForm().findField('sporServisikarOrani').setRawValue(g.getStore().getAt(i).json.karOrani);

            }
            },
			cm : new Ext.grid.ColumnModel([ {
						header : "Sıra",
						width : 100,
						sortable : true,
						dataIndex : 'id'
					}, {
						header : "Xmlden Çekilen Kategori Adı",
						width : 200,
						sortable : true,
						dataIndex : 'xmlCategoryName'
					}, {
						header : "Veritabanındaki Kategori Adı",
						width : 200,
						sortable : true,
						dataIndex : 'dbCategoryName'
					},
                    {header : "Kar Oranı",
						width : 200,
						sortable : true,
						dataIndex : 'karOrani'

                    }
				])
		});

	var sporServisicenterPanel = new Ext.FormPanel({
		    labelWidth : 150,
			bodyStyle : 'padding:5px 5px 0',
			frame : true,
			region : 'center',
			title : 'XML Transfer',
			width : 270,
            height: 100,
			defaults : {
				xtype : 'textfield',
				labelAlign : 'top'
			},

			items : [ {
                     xtype : 'hidden',
                     id: 'xmlCategoryID'
                    },{
                     xtype : 'hidden',
                     id: 'DBCategoryID'
                    },{
						xtype : 'combo',
						id : 'sporServisixmlCat',
						fieldLabel : "XMLden okunan kategori",
						name : "sporServisixmlCat",
                        allowBlank:false,
						triggerAction : "all",
						loadingText : "Loading...",
                        anchor : '50%',
						//emptyText : "Kategori Seçiniz",
						store : sporServisixmlCategoryStore,
						mode : 'remote',
						displayField : "categoryName",
						valueField : "id",
						forceSelection : true,
						editable : true,
						listeners : {
							select : function (cb, record) {

								 sporServisicenterPanel.getForm().findField('xmlCategoryID').setValue(record.json.categoryId);
							}
						}
					},{
						xtype : 'combo',
						id : 'sporServisiveritabaniCat',
						fieldLabel : "Veritabanındaki kategori",
						name : "sporServisiveritabaniCat",
						triggerAction : "all",
                         allowBlank:false,
						loadingText : "Loading...",
                        anchor : '50%',
						//emptyText : "Kategori Seçiniz",
						store : eventCategoryStore,
						mode : 'remote',
						displayField : "category",
						valueField : "id",
						forceSelection : true,
						editable : true,
						listeners : {
							select : function (cb, record) {
								sporServisicenterPanel.getForm().findField('DBCategoryID').setValue(record.json.id);
							}
						}
					}, {
					id : 'sporServisikarOrani',
					anchor : '50%',
					name : 'sporServisikarOrani',
                     allowBlank:false,
					fieldLabel : "Kar Oranı"
				}
			],

        buttons: [{
            text: 'XML verilerini Çek',
           handler: function(){
              readFromXML("spor-servisi.xml");

            }
        },{
            text: 'Kaydet',
             handler: function(){
                 saveToDB("spor-servisi.xml");

            }
        }]
		});

var sporServisiPanel = new Ext.Panel({
			title : 'Spor-Servisi XML Parser',
			layout : 'border',
            id: '2',
            items : [ sporServisicenterPanel,sporServisiustGrid]

		});
//UCUNCU PANEL ICIN KODLAMA SON...................






var TabPanel = new Ext.TabPanel({
			items : [mainPanel, IndexPazarPanel,sporServisiPanel],
			activeTab : 0,
            listeners: {
                'tabchange': function(tabPanel, tab){
        if(tab.id=="0"){
            ustGrid.getStore().reload();
        }else if(tab.id=="1"){
            IndexPazarustGrid.getStore().reload();
            
        }else if(tab.id=="2"){
            sporServisiustGrid.getStore().reload();
        }

                }
            }

		});
function pageInit() {
	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [TabPanel]
			});

           
           
}
 