Ext.define('Tualo.FinTS.models.Syncform', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fints_sync',
    data:{
        interrupted: false,

    },
    formulas: {
        formtext: function(get){
            return  '<h2>Fin TS</h2>';
        }
    },
    stores: {
        bankkonten: {
            type: 'bankkonten_store',
            autoLoad: true
        }
    }
});