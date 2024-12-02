Ext.define('Tualo.FinTS.Sync', {
//    extend: 'Ext.form.Panel',
    extend: 'Ext.panel.Panel',
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
        'Ext.layout.container.Card',
        'Tualo.FinTS.controller.Sync',
        'Tualo.FinTS.models.Sync'
    ],

    xtype: 'layout-card',
    layout: 'card',

    bodyPadding: 15,

    defaults: {
        border: false
    },

    /*

-> fints account
-> passwort
-> tan auswahl
-> starten

*/
    defaultListenerScope: true,

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
    ],

    items: [
        {
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'component',
                    cls: 'lds-container-compact',
                    html: '<div class=" "><div class="blobs-container"><div class="blob gray"></div></div></div>'
                        + '<div><h3>Kontoauszug abrufen</h3>'
                        + '<span>Klicken Sie auf weiter, um zu beginnen.</span></div>'
                }
            ]
        },

        {
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'component',
                    cls: 'lds-container-compact',
                    html: '<div class=" "><div class="blobs-container"><div class="blob gray"></div></div></div>'
                        + '<div><h3>Kontoauszug abrufen</h3>'
                        + '<span>Wählen Sie ein Konto aus.</span></div>'
                },
                
                {
                    xtype: 'dslist_fints_accounts',
                    width: 300,
                    height: 300,
                    title: null,
                    columns: [
                        {
                          "text": "Name",
                          "xtype": "gridcolumn",
                          "dataIndex": "name",
                          "align": "left",
                          "formatter": "",
                          "summaryType": null,
                          "summaryRenderer": null,
                          "summaryFormatter": null,
                          "hidden": false,
                          "editor": null,
                          "flex": 1,
                          "filter": {
                            "type": "string"
                          }
                        },
                        {
                          "text": "Benutzername",
                          "xtype": "gridcolumn",
                          "dataIndex": "banking_username",
                          "align": "left",
                          "formatter": "",
                          "summaryType": null,
                          "summaryRenderer": null,
                          "summaryFormatter": null,
                          "hidden": false,
                          "editor": null,
                          "flex": 1,
                          "filter": {
                            "type": "string"
                          }
                        }
                    ],
                    bind:{
                        store: '{fints_accounts}',
                        selection: '{selectedAccount}'
                    }
                }
            ]
        },

        {
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            itemId: 'accountPassword',
            items: [
                {
                    xtype: 'component',
                    cls: 'lds-container-compact',
                    html: '<div class=" "><div class="blobs-container"><div class="blob gray"></div></div></div>'
                        + '<div><h3>Kontoauszug abrufen</h3>'
                        + '<span>Geben Sie das Passwort ein.</span></div>'
                },
                
                {
                    xtype: 'textfield',
                    fieldLabel: 'Password',
                    inputType: 'password',
                    bind: {
                        value: '{accountPassword}'
                    }
                }
            ]
        },

        {
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            itemId: 'tanmodes',
            items: [
                {
                    xtype: 'component',
                    cls: 'lds-container-compact',
                    html: '<div class=" "><div class="blobs-container"><div class="blob gray"></div></div></div>'
                        + '<div><h3>Kontoauszug abrufen</h3>'
                        + '<span>Wählen Sie ein Anmeldeverfahren.</span></div>'
                },
                
                {
                    xtype: 'combobox',
                    fieldLabel: 'TAN-Verfahren',
                    idField: 'id',
                    displayField: 'name',
                    bind: {
                        value: '{accountTANMode}',
                        store: '{tanmodes}'
                    }
                }
            ]
        },
        {
            id: 'card-1',
            html: '<p>Step 2 of 3</p><p>Almost there.  Please click the "Next" button to continue...</p>'
        },
        {
            id: 'card-2',
            html: '<h1>Congratulations!</h1><p>Step 3 of 3 - Complete</p>'
        }
    ],

    showNext: function() {
        this.doCardNavigation(1);
    },

    showPrevious: function(btn) {
        this.doCardNavigation(-1);
    },

    getCardIndex: function(){
        var me = this,
        l = me.getLayout(),
        id = l.activeItem.itemId || l.activeItem.getId();
        console.log(">>>>>",id,l.activeItem,me.items.indexMap);
        return me.items.indexMap[id];
    },
    doCardNavigation: function(incr) {
        var me = this,
            l = me.getLayout(),
            currentId = l.activeItem.itemId;
            i = me.getCardIndex(),
            s = me.items.length,
            next = parseInt(i, 10) + incr;

        
        if (currentId=='accountPassword'){
            me.getController().getTanModes();
        }

        if (currentId=='tanmodes'){
            console.log('tanmodes',me.getViewModel().data)
        }

        
        console.log(currentId,'next',next,'current',i)
        l.setActiveItem(next);


        me.down('#card-prev').setDisabled(next === 0);
        me.down('#card-next').setDisabled(next === s-1);
    }
});