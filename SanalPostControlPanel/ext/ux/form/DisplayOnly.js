//======================= Start of extention ============================
/* Use this override to add the uxDisplayOnly method to Ext.form.Field
 * All descendants of Ext.form.Field will then inherit this method
 * Version 1.0
 * Known bug: Doesnt work with radiogroup and checkbox group in IE7 - the this.el.removeClass(cls)
 * results in the radiogroup or checkbox group becoming invisible
 */
Ext.override(Ext.form.Field, {
    uxDisplayOnly: function(displayOnly, cls){
        // If no parameter, assume true
        var displayOnly = (displayOnly === false) ? false : true;
        // If a class name is passed in, use that, otherwise use the default one.       
        // The classes are defined in displayOnly.html for this example         
        var cls = (cls) ? cls : 'x-form-display-only-field';
        // Add or remove the class       
        if (displayOnly) {
            this.el.addClass(cls);
        }
        else {
            this.el.removeClass(cls);
        }        
        // Set the underlying DOM element's readOnly attribute
        this.el.dom.readOnly = displayOnly;
        // Get this field's xtype (ie what kind of field is it?)        
        var xType = this.getXType();
        if (xType == 'checkbox') {        
            this.readOnly = displayOnly; // We need to also set the config readOnly attribute for checkboxes
        }
        // For radio groups and checkbox groups 
        // we need to set the config readOnly attribute for on each item in the group
        if (xType == 'radiogroup' || xType == 'checkboxgroup') {
            var items = this.items.items;
            for (var i = 0; i < items.length; i++) {
                items[i].readOnly = displayOnly;
            };
         }
        // For fields that have triggers (eg date,time,dateTime),         
        // show/hide the trigger
        if (this.trigger) {
            this.trigger.setDisplayed(!displayOnly);
        }
    }
});

// For Saki's DateTime extention we need to add a method which
// then calls the internal date and time fields
// If you arent using the DateTime component, remove/comment out this override
Ext.override(Ext.ux.form.DateTime, {
    uxDisplayOnly: function(displayOnly, cls){
        this.df.uxDisplayOnly(displayOnly);
        this.tf.uxDisplayOnly(displayOnly);
    }
});
//======================= End of extention ============================
