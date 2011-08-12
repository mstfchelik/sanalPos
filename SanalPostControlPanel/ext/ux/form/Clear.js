/**
 * This plugin can be either used on BasicForm or FormPanel.
 * In both cases it adds a method clear() to the object
 * which allows to clear (empty) all the forms values.
 * This is opposed to the reset() method which resets all values
 * to the last values loaded through a call to load().
 * But sometimes (e.g. when you want to recycle an existing form for use
 * for a new record, you have to clear the form and also corectly reset
 * the isDirty() flag.
 *
 *
 */
Ext.ux.FormClear=function()
{

    this.init=function(_object)
    {
        if (typeof _object.form=="object")
        { //we are a formpanel and have a form, be kind and also add the method to the basic form

            //clear method for the underlying form:
            _object.form.clear=function()
            {
                var data={};
                this.items.each(function(item)
                {
                    data[item.getName()]=null;
                });

                var emptyRecord=new Ext.data.Record(data);
                this.loadRecord(emptyRecord);
            };

            //clear method for the forpanel itself
            _object.clear=function()
            {
                var data={};
                this.items.each(function(item)
                {
                    data[item.getName()]=null;
                });

                var emptyRecord=new Ext.data.Record(data);
                this.form.loadRecord(emptyRecord);
            };

        }
        else
        { //we are a basicform
            _object.clear=function()
            {
                var data={};
                this.items.each(function(item)
                {
                    data[item.getName()]=null;
                });

                var emptyRecord=new Ext.data.Record(data);
                this.loadRecord(emptyRecord);
            };
        }
    };

};