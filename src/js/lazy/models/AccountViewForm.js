Ext.define('Tualo.FinTS.models.AccountViewForm', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fints_accountview_form',
    requires: [
        'Tualo.FinTS.models.TanModes'
    ],
    data:{
    },
    stores: {
        status: {
            fields: [
              {name: 'id', type: 'string'},
              {name: 'name',  type: 'string'}
            ],
            listeners: {
              load: 'onStatusStoreLoad'
            },
            pageSize: 5000,
            proxy: {
              type: 'ajax',
              url: './fints/statusbuttons',
              reader: {
                type: 'json',
                rootProperty: 'data',
                idProperty: 'id'
              }
            },
            autoLoad: false
          },
          open: {
            fields: [
              {name: 'id', type: 'string'},
              {name: 'tabellenzusatz',  type: 'string'},
              {name: 'belegartid',       type: 'number'},
              {name: 'bw_faktor',       type: 'number'},
              {name: '_display',       type: 'string'},
      
              {name: 'matchcols', type:'string'} ,
              {name: 'datum',  type: 'date'},
              {name: 'buchungsdatum',  type: 'date'},
              {name: 'belegnummer',  type: 'string'},
              {name: 'referenz',  type: 'string'},
              {name: 'bezugnummer',  type: 'string'},
              {name: 'name',  type: 'string'},
              {name: 'brutto',  type: 'number'},
              {name: 'offen',  type: 'number'}
            ],
            pageSize: 5000,
            proxy: {
              type: 'ajax',
              url: './fints/openreports',
              reader: {
                type: 'json',
                rootProperty: 'data',
                idProperty: 'id'
              }
            },
            autoLoad: true
          },
      
      
          bezug: {
            fields: [
              {name: 'id', type: 'string'},
              {name: 'name',  type: 'string'},
              {name: 'matchcols',  type: 'string'},
              {name: 'offen',  type: 'number'}
            ],
            pageSize: 5000,
            proxy: {
              type: 'ajax',
              url: './fints/relations',
              
              reader: {
                type: 'json',
                rootProperty: 'data',
                idProperty: 'id'
              }
            },
            autoLoad: true
          },
    }
});