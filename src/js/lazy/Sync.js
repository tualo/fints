Ext.define('Tualo.FinTS.Sync', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fints_sync',
     
    listeners:{
      boxReady: 'onReady'
    },
    defaults: {
        anchor: '100%'
    },
    controller: 'fints_sync',
    viewModel: {
        type: 'fints_sync'
    },
    requires: [
        'Tualo.FinTS.controller.Sync',
        'Tualo.FinTS.models.Sync'
    ],
    bodyPadding: '25px',
    disabled: true,
    items: [
       {
            xtype: 'hiddenfield',
            value: '',
            fieldLabel: 'Token',
            name: 'api_token'
        }

    ],
    buttons: [
        {
            text: "Abbrechen",
            handler: function(btn){

            }
        }
    ]
});