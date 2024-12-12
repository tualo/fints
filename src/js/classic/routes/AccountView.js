Ext.define('Tualo.routes.FinTSAccountView',{
    statics: {
        load: async function() {
            return [
                {
                    name: 'FinTS View',
                    path: '#fints/view'
                }
            ]
        }
    }, 
    url: 'fints/view',
    handler: {
        action: function( values ){
            console.log('action');

            Ext.getApplication().addView('Tualo.FinTS.AccountView',{
                values: values
            });
        },
        before: function ( action) {
            let fn = Ext.require, txt = 'Tualo.FinTS'+'.AccountView';
            fn(txt,function(){
                action.resume();
            },this);
        }

    }
});