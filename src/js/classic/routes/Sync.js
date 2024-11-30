Ext.define('Tualo.routes.FinTS',{
    statics: {
        load: async function() {
            return [
                {
                    name: 'FinTS',
                    path: '#fints/sync'
                }
            ]
        }
    }, 
    url: 'fints/sync',
    handler: {
        action: function( ){
            console.log('action');

            Ext.getApplication().addView('Tualo.FinTS.Sync');
        },
        before: function ( action,cnt) {
            console.log('before');
            let fn = Ext.require, txt = 'Tualo.FinTS'+'.Sync';
            fn(txt,function(){
                console.log('resume');
                action.resume();
            },this);
        }

    }
});