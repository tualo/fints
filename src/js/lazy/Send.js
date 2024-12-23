Ext.define('Tualo.FinTS.Send', {
    //    extend: 'Ext.form.Panel',
        extend: 'Ext.panel.Panel',
        alias: 'widget.fints_send',
         
        defaults: {
            anchor: '100%'
        },
        controller: 'fints_send',
        viewModel: {
            type: 'fints_send'
        },
        requires: [
            'Ext.layout.container.Card',
            'Tualo.FinTS.controller.Send',
            'Tualo.FinTS.models.Send'
        ],
    
        xtype: 'layout-card',
        layout: 'card',
    
        bodyPadding: 15,
    
        defaults: {
            border: false
        },
    
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
                itemId: 'dataform',
                items: [
                    {
                        xtype: 'component',
                        cls: 'lds-container-compact',
                        bind: {
                            html: '{titletext}'
                        }
                    },
                    
                    {
                        xtype: 'iban',
                        width: 400,
                        fieldLabel: 'IBAN',
                        bind: {
                            value: '{iban}'
                        }
                    },
                    
                    {
                        xtype: 'textfield',
                        width: 400,
                        fieldLabel: 'Empfänger',
                        bind: {
                            value: '{name}'
                        }
                    },
                    
                    {
                        xtype: 'textfield',
                        width: 400,
                        regex: /[0-9a-zA-Z\.]/,
                        fieldLabel: 'Zweck',
                        bind: {
                            value: '{text}'
                        }
                    },
                    
                    {
                        xtype: 'numberfield',
                        width: 400,
                        fieldLabel: 'Wert',
                        decimalPrecision: 2,
                        decimalSeparator: ',',
                        /*
                        triggers: {
                            foo: {
                                cls: 'my-foo-trigger',
                                handler: function() {
                                    console.log('foo trigger clicked');
                                }
                            },
                        },
                        */
                        bind: {
                            value: '{value}'
                        }
                    },


                ]
            },





            {
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                itemId: 'accountPanel',
                items: [
                    {
                        xtype: 'component',
                        cls: 'lds-container-compact',
                        bind: {
                            html: '{titletext}'
                        }
                    },
                    
                    {
                        xtype: 'dslist_fints_accounts',
                        itemId: 'accountList',
                        width: 300,
                        height: 300,
                        title: null,
                        selModel: {
                            type: 'rowmodel'
                        },
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
                        bind: {
                            html: '{titletext}'
                        }
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
            }


            , {
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
                        bind: {
                            html: '{titletext}'
                        }
                    },
                    
                    {
                        xtype: 'combobox',
                        itemId: 'tanmodescombobox',
                        fieldLabel: 'TAN-Verfahren',
                        idField: 'id',
                        displayField: 'name',
                        queryMode: 'local',
                        triggerAction: 'all',
                        bind: {
                            value: '{accountTANMode}',
                            store: '{tanmodes}'
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
                itemId: 'taninput',
                items: [
                    {
                        xtype: 'component',
                        cls: 'lds-container-compact',
                        bind: {
                            html: '{titletext}'
                        }
                    },
                    
                    {
                        xtype: 'textfield',
                        fieldLabel: 'TAN',
                        inputType: 'password',
                        bind: {
                            value: '{accountTAN}'
                        }
                    }
                ]
            },

            ,

            {
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                itemId: 'transfer',
                items: [
                    {
                        xtype: 'component',
                        cls: 'lds-container-compact',
                        bind: {
                            html: '{titletext}'
                        }
                    },
                    
                    
                ]
            },

            {
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                itemId: 'done',
                items: [
                    {
                        xtype: 'component',
                        cls: 'lds-container-compact',
                        bind: {
                            html: '{titletext}'
                        }
                    },
                    {
                        xtype: 'component',
                        cls: 'lds-container-compact',
                        html: '<i class="fa-solid fa-square-check" style="font-size: 4rem;"></i>'
                    }
                    
                ]
            },
        ],

        initConfig: function(config){
            console.log('initConfig',config);
            this.callParent(config);
            
            this.getViewModel().set('iban',config.values.__fints_iban);
            this.getViewModel().set('value',config.values.__fints_value/ 100);
            this.getViewModel().set('text', atob( config.values.__fints_text) );
            this.getViewModel().set('name', atob( config.values.__fints_name) );
        },

    
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
            return me.items.indexMap[id];
        },
        doCardNavigation: function(incr) {
            var me = this,
                l = me.getLayout(),
                currentId = l.activeItem.itemId;
                i = me.getCardIndex(),
                s = me.items.length,
                next = parseInt(i, 10) + incr;
    
            
            me.getController().forceSelection();

            
            if (currentId=='accountPassword'){
                me.getController().getTanModes();
                me.next(next);
            }else if (currentId=='tanmodes'){
                let mode = me.getViewModel().get('accountTANMode'),
                    store  = me.getViewModel().getStore('tanmodes'),
                    byID = store.findRecord( 'id', mode, 0, false, false, true ),
                    byName = store.findRecord( 'name', mode, 0, false, false, true ),
                    match = byID || byName,
                    modeID = match.get('id'),
                    needsTanMedium = match.get('needsTanMedium');
    
                console.log('needsTanMedium',needsTanMedium,next)
                me.getViewModel().set('accountTANModeID',modeID);
                if (!needsTanMedium){
                    next=next+1;
                    console.log('needsTanMedium','yyy');
                    me.getController().login(()=>{
                        me.next(next);
                    });
                    return;
                }
                me.next(next);
    
            }else if (currentId=='taninput'){
                me.getController().login(()=>{
                    me.next(next);
                });
                return;
            }else  if (currentId=='transfer'){
                me.getController().transfer(()=>{
                    me.next(next);
                });
                return;
            }
            
            /*else if (currentId=='statements'){
                me.getController().statements(()=>{
                    console.log('statements');
                    me.next(next);
                });
                return;
            }else if (currentId=='statements_done'){
                Ext.util.History.back();
                return;
            }
    
            */
            console.log(currentId,'next',next,'current',i)
            
            me.next(next);
        },
        next: function(next){
            var me = this,
                l = me.getLayout();
            l.setActiveItem(next);
            me.getViewModel().set('cardindex',next)
            me.down('#card-prev').setDisabled(next === 0);
            me.down('#card-next').setDisabled(next === s-1);
    
        }
    });