Ext.define('Tualo.FinTS.models.Sync', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fints_sync',
    data:{
        interrupted: false,
        accountPassword: '',
        accountTANMode: '',
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

            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }, 
            //type: 'json',
            fields: [
                {
                    name: 'id',
                    type: 'int'
                },{
                    name: 'name',
                    type: 'string'
                },{
                    name: 'isDecoupled',
                    type: 'boolean'
                },{
                    name: 'needsTanMedium',
                    type: 'boolean'
                }
            ],
            autoLoad: false
        }
    }
});