Ext.define('Tualo.FinTS.AccountViewGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
      'Tualo.FinTS.models.AccountViewGrid',
      'Tualo.FinTS.controller.AccountViewGrid'
    ],
    alias: 'widget.fints_accountview_grid',
    listeners: {
      boxReady: 'onBoxReady',
      resize: 'onResize'
    },
    controller: 'fints_accountview_grid',
    viewModel: {
        type: 'fints_accountview_grid'
    },
    bind: {
      store: '{kontoauszug}'
    },
    listeners: {
      selectionchange: 'onSelectionChange'
    },
    tools: [
  
      {
        xtype: 'glyphtool',
        /*
        glyphPrefix: 'fa-solid fa-',
        glyph: 'building-columns',
        */
        glyph: 'money-check',
      
        handler: 'syncClicked',
        tooltip: 'Bankdaten abrufen'
      }, 
  
      {
        xtype: 'glyphtool',
        glyph: 'lightbulb',
        handler: 'loopRequestClicked',
        tooltip: 'Alle Testen'
      },
  
      {
        xtype: 'glyphtool',
        glyph: 'sync',
        handler: 'refresh',
        tooltip: 'Neu Laden'
      }
    ],
    columns: [
  
      {
        dataIndex: 'buchungsdatum',
        header: 'Buchungsdatum',
        xtype: 'datecolumn',
        format:'d.m.Y',
        align:  'center',
        hidden: true
      },
      {
        dataIndex: 'valuta',
        header: 'Valuta',
        xtype: 'datecolumn',
        format:'d.m.Y',
        align:  'center',
        renderer: function(value,meta,record){
          if (record.get('state')==1){
            meta.style+="background-color:rgb(220,255,220);";
          }
          if (record.get('state')==2){
            meta.style+="background-color:rgb(250,255,220);";
          }
          return value;
        }
      },
      {
        dataIndex: 'betrag',
        header: 'Betrag',
        xtype: 'numbercolumn',
        format:'0.000,00/i',
        align: 'right'
      },
      {
        dataIndex: 'verwendungszweck1',
        header: 'Verwendungszweck',
        flex: 1,
        hidden: true,
        renderer: function(v,m,r){
          return r.get('verwendungszweck')
        }
      },
      {
        dataIndex: 'bankkonto',
        header: 'Bankkonto',
        hidden: true
      },
      {
        dataIndex: 'cred',
        header: 'Sepa-Kreditor',
        hidden: true
      },
      {
        dataIndex: 'svwz',
        header: 'Sepa-Verwendungszweck',
        flex: 1
      },
      {
        dataIndex: 'mref',
        header: 'Sepa-Mandatsreferenz',
        hidden: true
      },
      {
        dataIndex: 'empfaengername1',
        header: 'Empfaengername1',
        hidden: true
      },
      {
        dataIndex: 'empfaengername2',
        header: 'Empfaengername2',
        hidden: true
      }
      
  
    ]
  });
  