//----------------------GoogleMap----------------------------------
var map = null;
var geocoder = null;
var infowindow = null;
var gr = null;
var selected = null;
var musteriForm=null;
function initialize_map() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(41, 29);
	var myOptions = {
		zoom : 11,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	infowindow = new google.maps.InfoWindow();
}

function codeAddress(address) {
	if (geocoder) {
		geocoder.geocode({
					'address' : address
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						//out(results[0].geometry.location);
						map.setCenter(results[0].geometry.location);
						var marker = new google.maps.Marker({
									map : map,
									draggable : true,
									position : results[0].geometry.location
								});
						google.maps.event.addListener(marker, 'dragend',
								function() {
									//out(marker.getPosition());
									var str = '<div style="width: 300px; height: 85px">'
											+ "Address"
											+ ': '
											+ address
											+ '<br/>'
											+ "Location Coor."
											+ ': '
											+ marker.getPosition()
													.toUrlValue(6)
											+ '<br/><br/>'
											+ '<input type="submit" value="'
											+ "Save"
											+ '"'
											+ 'onclick="saveLocation(\''
											+ marker.getPosition()
													.toUrlValue(14)
											+ '\')" >'
											+ '</div>';
									infowindow.setContent(str);
								});
						google.maps.event.addListener(marker, 'click',
								function() {
									var str = '<div style="width: 300px; height: 85px">'
											+ "Address"
											+ ': '
											+ address
											+ '<br/>'
											+ "Location Coor."
											+ ': '
											+ marker.getPosition()
													.toUrlValue(6)
											+ '<br/><br/>'
											+ '<input type="submit" value="'
											+ "Save"
											+ '"'
											+ 'onclick="saveLocation(\''
											+ marker.getPosition()
													.toUrlValue(14)
											+ '\')" >'
											+ '</div>';
									infowindow.setContent(str);
									infowindow.open(map, marker);
								});
					} else {
						alert("Geocode was not successful for the following reason: "
								+ status);
					}
				});
	}
}
function codeGeoLocation(address, location) {
	if (geocoder) {
		map.setCenter(location);
		var marker = new google.maps.Marker({
					map : map,
					draggable : true,
					position : location
				});
		google.maps.event.addListener(marker, 'dragend', function() {
			//out(marker.getPosition());
			var str = '<div style="width: 300px; height: 85px">'
					+ "Address" + ': ' + address + '<br/>'
					+ "Location Coor."+ ': '
					+ marker.getPosition().toUrlValue(6) + '<br/><br/>'
					+ '<input type="submit" value="'
					+ "Save" + '"'
					+ 'onclick="saveLocation(\''
					+ marker.getPosition().toUrlValue(14) + '\')" >' + '</div>';
			infowindow.setContent(str);
		});
		google.maps.event.addListener(marker, 'click', function() {
			var str = '<div style="width: 300px; height: 85px">'
					+ "Address" + ': ' + address + '<br/>'
					+ "Location Coor."+ ': '
					+ marker.getPosition().toUrlValue(6) + '<br/><br/>'
					+ '<input type="submit" value="'
					+ "Save" + '"'
					+ 'onclick="saveLocation(\''
					+ marker.getPosition().toUrlValue(14) + '\')" >' + '</div>';
			infowindow.setContent(str);
			infowindow.open(map, marker);
		});

	}
}

function saveLocation(location) {
	console.log(selected.id);
	Asistan.System.Util.update({
				table : 'etkinlikSahibi',
				fields : ["Koordinat"],
				values : [location],
				condition : " where id=" + selected.id,
				callBack : function(obj) {
					gr.getStore().reload();
				}
			});
}

function addNewCustomer(type, grid, musteriNo) {

	if (type == 1) {
		gr = grid;
		selected = grid.getSelectionModel().getSelected().json;
	}
/*
	if (type == 1 && musteriNo != undefined) {
		fetchMusteri(musteriNo);
	}
  
*/

	var musteriForm = new Ext.form.FormPanel({
		width : 720,
		height : 470,
		frame : false,
		border : true,
		labelWidth : 80,
		bodyStyle : 'padding: 5px',
		items : [{
					xtype : 'tabpanel',
					layoutOnTabChange : true,
					activeTab : 0,
					height : 400,
					id : 'tabpanel',
					listeners : {
						'tabchange' : function(tabpan, pan) {
							if (pan.getId() == "map_tab") {
								initialize_map();
								if (type == 1) {
									var query = "" + selected.musteri_adres1
											+ " " + selected.musteri_adres2
											+ " " + selected.musteri_ilce + " "
											+ selected.musteri_il;
									document.getElementById('gmap_addrs').value = query;
									if (selected.geo_location === "0") {
										codeAddress(query);
									} else {
										var temp = selected.geo_location.split(
												",", 2);
										var latlng = new google.maps.LatLng(
												parseFloat(temp[0]),
												parseFloat(temp[1]));
										codeGeoLocation(query, latlng);
									}
								}

							} 

						}
					},
					items : [{
						title : "Authorized Infos",
						height : 400,
						items : [{
							layout : 'form',
							labelWidth : 85,
							defaults : {
								xtype : 'textfield'
							},
							items : [
							{
							xtype: 'hidden',
							name: 'ilID',
							},
							{
							xtype: 'hidden',
							name: 'ilceID',
							},
							{
					            fieldLabel : "Name/Surname",
					            name : 'AdiSoyadi',
					            xtype : 'textfield',
				                anchor : '80%',
				            	allowBlank : false,
				             	listeners : {
					          	blur : function() {
					       		var str = this.getValue();
					    		str = str.toUpperCase();
						        this.setValue(str);
					     	   }
					         }
				            },
							{
											anchor : '80%',
											name : 'SabitTelefon',
											fieldLabel : "PhoneNo",
											plugins : [new Ext.ux.InputTextMask(
													'9999-999-99-99', true)], 
											listeners : {
												blur : function(f) {
												//	telKontrol(f);
												}
											}
							},
							{
											anchor : '80%',
											name : 'Fax',
											fieldLabel : "Fax",
											plugins : [new Ext.ux.InputTextMask(
													'9999-999-99-99', true)] 
							}, 
							 {
											anchor : '80%',
											name : 'MobilTelefon',
											id: 'MobilTelefon',
											enableKeyEvents :true,
											fieldLabel : "GSM",
											allowBlank :  false,
											plugins : [new Ext.ux.InputTextMask(
													'9999-999-99-99', true)], 
											listeners : {
												blur : function(f) {
												//	telKontrol(f);
													
												}
												
											}
										}, {
											anchor : '80%',
											name : 'Email',
											fieldLabel : "Email",
											vtype : 'email',
											allowBlank:true
										
										}, 
										 {
											anchor : '80%',
											name : 'WebSayfasi',
											fieldLabel : "Web"
										}, {
											anchor : '80%',
											name : 'Il',
											fieldLabel : "City",
											forceSelection : true,
											xtype : 'Asistan.Il.ComboBox'
										},
										
										{
											anchor : '80%',
											name : 'Ilce',
											fieldLabel : "Town",
											forceSelection : true,
											disabled : false,
											xtype : 'Asistan.Ilce.ComboBox'
										}
							
							
							,{
								anchor : '80%',
								name : 'Adres',
								allowBlank : false,
								xtype: 'textarea',
								height: '80',
								fieldLabel : "Address"
							}]
						}]
					}, {
						cls : 'x-plain',
						title : "Authorized Note",
						layout : 'fit',
						items : {
							xtype : 'htmleditor',
							fieldLabel : "Note",
							name: 'Not'
						}
					} ,  {
						title : "Authorized Loc (Google Map)",
						height : 500,
						id : 'map_tab',
						html : "GoogleMap Loc.Founder"
								+ "<p><input type=\"text\" id=\"gmap_addrs\" style=\"width:550px\" name=\"address\"  />"
								+ "&nbsp;<input type=\"submit\" value=\"Find ! \" onclick=\"codeAddress(document.getElementById('gmap_addrs').value);\" /></p>"
								+ "<div id=\"map_canvas\" style=\"width: 700px; height: 325px\"></div>"

					}  ]
				}]
	});
	
	var musteriWindow = new Ext.Window({
		width : 720,
		height : 500,
		title : "Add-Edit Authorized",
		items : [musteriForm],
		bbar : ['->', {
					text : "Cancel",
					handler : function() {
						musteriWindow.close();
					}
				}, {
					text : "Save",
					handler : function() {
						if( type == 0) {
						musteriForm.getForm().submit({
							url :  'Php/insert.php?musteri=true',
							success : function(a, b, c) {
								musteriWindow.close();
								var resp = Ext.decode(b.response.responseText);
									grid.getStore().reload();
							}
						});
						}else{
						musteriForm.getForm().submit({
							url : 'Php/update.php?musteri=true',
							success : function(a, b, c) {
								musteriWindow.close();
								var resp = Ext.decode(b.response.responseText);
									grid.getStore().reload();
								
							}
						});
						
						
						
						}
						
					}
				}]
	});
	musteriWindow.show();
	if (type == 1) {
		  
			musteriForm.getForm().findField("Ilce").setDisabled(false);
			musteriForm.getForm().setValues(selected);
			musteriForm.getForm().findField("Ilce").getStore().reload();

		 
	}
}