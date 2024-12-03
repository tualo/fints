Ext.define('Tualo.FinTS.models.Sync', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fints_sync',
    requires: [
        'Tualo.FinTS.models.TanModes'
    ],
    data:{
        interrupted: false,
        accountPassword: '',
        accountTANMode: '',
        accountTANModeID: '',
        accountTAN: ''

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
        },
        fints_accounts: {
            type: 'fints_accounts_store',
            autoLoad: true
        },
        tanmodes: {
            model: 'Tualo.FinTS.models.TanModes',
            data: [/* */],
            proxy: {
                type: 'memory',
                
            }
        }
    }
});