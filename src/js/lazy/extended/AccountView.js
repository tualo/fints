Ext.define('Tualo.FinTS.lazy.extended.AccountView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fints_accountview_extended',
    listeners: {
        boxready: 'onReady'
    },
    defaults: {
        anchor: '100%',
        border: false
    },

    // defaultListenerScope: true,
    controller: 'fints_accountview_extended',
    viewModel: {
        type: 'fints_accountview_extended'
    },
    requires: [
        'Ext.layout.container.Card',
        'Tualo.FinTS.lazy.extended.controller.AccountView',
        'Tualo.FinTS.lazy.extended.models.AccountView',
        'Tualo.FinTS.lazy.extended.Form',
        'Tualo.FinTS.lazy.extended.Grid'
    ],

    bodyPadding: 15,

    layout: {
        type: 'border',
        // align: 'stretch'
    },

    items: [
        {
            xtype: 'fints_accountview_extended_grid',
            title: 'Konto',
            region: 'west',
            height: 500,
            flex: 1,
            //width: 200,
            split: true,
            listeners: {
                selectRecord: 'onSelectRecord',
                checkRecord: 'onCheckRecord'
            },
            reference: 'grid'
        }, {
            xtype: 'fints_accountview_extended_form',
            region: 'center',
            title: 'Details',
            flex: 2,
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