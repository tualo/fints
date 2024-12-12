Ext.define('Tualo.FinTS.models.AccountViewGrid', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fints_accountview_grid',
    requires: [
        'Tualo.FinTS.models.TanModes'
    ],
    data:{
    },
    stores: {
      kontoauszug: {
        fields: [
          {name: 'id', type: 'string'},
          {name: 'bankkonto',  type: 'string'},
          {name: 'buchungsdatum',       type: 'date'},
          {name: 'valuta',  type: 'string'},
          {name: 'betrag',  type: 'number'},
          {name: 'waehrung',  type: 'string'},
          {name: 'empfaengername1',  type: 'string'},
          {name: 'empfaengername2',  type: 'string'},
          {name: 'blz',  type: 'string'},
          {name: 'kontonummer',  type: 'string'},
          {name: 'verwendungszweck',  type: 'string'},
          {name: 'verwendungszweck1',  type: 'string'},
          {name: 'verwendungszweck2',  type: 'string'},
          {name: 'verwendungszweck3',  type: 'string'},
          {name: 'verwendungszweck4',  type: 'string'},
          {name: 'verwendungszweck5',  type: 'string'},
          {name: 'verwendungszweck6',  type: 'string'},
          {name: 'mref',  type: 'string'},
          {name: 'eref',  type: 'string'},
          {name: 'cred',  type: 'string'},
          {name: 'kref',  type: 'string'},
          {name: 'cref',  type: 'string'},
          {name: 'debt',  type: 'string'},
          {name: 'svwz',  type: 'string'},
          {name: 'abwa',  type: 'string'},
          {name: 'state',  type: 'number'}
        ],
        pageSize: 500,
        proxy: {
          type: 'ajax',
          url: './fints/accounts',
          reader: {
            type: 'json',
            rootProperty: 'data',
            idProperty: 'id'
          }
        },
        autoLoad: true,
        listeners:{
          load: 'onStoreLoad'
        }
      }
    }
});