Ext.define('Tualo.FinTS.AccountView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fints_accountview',
    listeners: {
        boxready: 'onReady'
    },
    defaults: {
        anchor: '100%',
        border: false
    },

    // defaultListenerScope: true,
    controller: 'fints_accountview',
    viewModel: {
        type: 'fints_accountview'
    },
    requires: [
        'Ext.layout.container.Card',
        'Tualo.FinTS.controller.AccountView',
        'Tualo.FinTS.models.AccountView',
        'Tualo.FinTS.AccountViewForm',
        'Tualo.FinTS.AccountViewGrid'
    ],

    bodyPadding: 15,

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'fints_accountview_grid',
            title: 'Konto',
            height: 500,
            flex: 2,
            split: true,
            listeners: {
                selectRecord: 'onSelectRecord',
                checkRecord: 'onCheckRecord'
            },
            reference: 'grid'
        }, {
            xtype: 'fints_accountview_form',
            title: 'Details',
            flex: 1,
            listeners: {
                nextClicked: 'onNextClicked',
                updated: 'onFormUpdated',
                checked: 'onChecked'
            },
            reference: 'form'
        }
    ],

    /*
    bbar: ['->',
           {
               itemId: 'card-prev',
               text: '&laquo; Zurück',
               handler: 'showPrevious',
               disabled: true
           },
           {
               itemId: 'card-next',
               text: 'Weiter &raquo;',
               handler: 'showNext'
           }
    ],*/
});    