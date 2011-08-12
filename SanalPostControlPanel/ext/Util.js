/**
 * Utilities.....//ismet
 */
Ext.namespace('Asistan', 'Asistan.System', 'Asistan.System.Util');
/**
 * Bir gridin storunu servera göndermek için encode eder
 * 
 * @param {}
 *            s store
 * @return {}
 */
Asistan.System.Util.getGridData = function(s, f) {

    var data = new Array();
    for (var i = 0; i < s.getCount(); ++i) {
        data[i] = s.data.items[i].data;
    }
    // console.info(s);
    return Ext.util.JSON.encode(data);
}
getGridDataField = function(s, f, f2) {

    var data = new Array();
    for (var i = 0; i < s.getCount(); ++i) {
        if (typeof f2 !== "undefined") {
            data[i] = {
                f : s.data.items[i].data[f],
                f2 : s.data.items[i].data[f2]
            }
        } else

            data[i] = s.data.items[i].data[f];

    }
    // console.info(s);
    return Ext.util.JSON.encode(data);
}
Asistan.System.Util.insert = function(c) {
    Ext.Ajax.request({
        url : Asistan.System.Baseurl
        + '/application.php?way=system&case=myInsert',
        method : 'post',
        params : {
            table : c.table,
            fields : Ext.encode(c.fields),
            values : Ext.encode(c.values)
        },
        callback : function(options, success, response) {
            var myObj = Ext.decode(response.responseText);
            if (myObj.success && c.callBack){
                c.callBack(myObj);
            }
        }
    });
}
/**
 * Veri tabanında update için kullanılır..
 * 
 * table:'table', fields:['field1','field2'], condition:'where kdjdf',
 * values:['value1',value2']
 */
Asistan.System.Util.update = function(c) {
    Ext.Ajax.request({
        url : Asistan.System.Baseurl
        + '/application.php?way=system&case=myUpdate',
        method : 'post',
        params : {
            table : c.table,
            fields : Ext.encode(c.fields),
            condition : c.condition,
            values : Ext.encode(c.values)
        },
        callback : function(options, success, response) {
            var myObj = Ext.decode(response.responseText);
            if (myObj.success && c.callBack){
                c.callBack(myObj);
            }
        }
    });
};
/**
 * Delete için.. table,conditon
 */
Asistan.System.Util.Delete = function(c) {
    Ext.Ajax.request({
        url : Asistan.System.Baseurl
        + '/application.php?way=system&case=myDelete',
        method : 'post',
        params : {
            table : c.table,
            condition : c.condition

        },
        callback : function(options, success, response) {
            var myObj = Ext.decode(response.responseText);
            if (myObj.success && c.callBack){
                c.callBack(myObj);
            }
        }
    });

};
/**
 * Basit select'ler için kullanılır..
 * 
 * @param {}
 *            c
 */
Asistan.System.Util.select = function(c) {
    Ext.Ajax.request({
        url : Asistan.System.Baseurl
        + '/application.php?way=system&case=mySelect',
        method : 'post',
        params : {
            table : c.table,
            fields : Ext.encode(c.fields),
            condition : c.condition

        },
        callback : function(options, success, response) {
            var myObj = Ext.decode(response.responseText);
            c.callBack(myObj);
        }
    });
}
function out(obj) {
    if (!Ext.isIE) {
    } else {
}
}

function getYetki(menu, action) {
    for (var index = 0; index < Asistan.System.LoginInfo.yetki.length; index++) {
        var menuRow = Asistan.System.LoginInfo.yetki[index];
        if (menuRow.MENU == menu) {
            return menuRow[action] == "H";
        }
    }
    return false;
}
function getYetkiMenu(menu) {
    for (var index = 0; index < Asistan.System.LoginInfo.yetki.length; index++) {
        var menuRow = Asistan.System.LoginInfo.yetki[index];
        if (menuRow.MENU == menu) {
            var ret = {
                yeni : menuRow["YENIKAYIT"] == 'E',
                degistir : menuRow["DEGISTIR"] == 'E',
                sil : menuRow["SIL"] == 'E'
            }
            return ret;
        }
    }
    return {
        yeni : true,
        degistir : true,
        sil : true
    }
}