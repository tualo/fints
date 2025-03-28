Ext.define('Tualo.FinTS.lazy.extended.Grid', {
  extend: 'Ext.grid.Panel',
  requires: [
    'Tualo.FinTS.lazy.extended.models.Grid',
    'Tualo.FinTS.lazy.extended.controller.Grid'
  ],
  alias: 'widget.fints_accountview_extended_grid',
  listeners: {
    boxReady: 'onBoxReady',
    resize: 'onResize'
  },
  controller: 'fints_accountview_extended_grid',
  viewModel: {
    type: 'fints_accountview_extended_grid'
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
  features: [
    {
      ftype: 'grouping',
      groupHeaderTpl: '{name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
      showSummaryRow: true,

    },
  ],
  plugins: [
    /*{
      ptype: 'grouping',

    },*/
    {
      ptype: 'gridfilters'
    }, {

      /*
      {
    "id": 412,
    "bankkonto": "DE81100100100662790103",
    "buchungsdatum": "2024-10-28",
    "valuta": "2024-10-28",
    "betrag": -90.46,
    "waehrung": "EUR",
    "empfaengername1": "Vodafone GmbH",
    "empfaengername2": null,
    "blz": "",
    "kontonummer": "DE04300700100270704000",
    "verwendungszweck": "EREF+0000117448795 0019869676274MREF+DE04KMMC000117448795T025802790CRED+DE26ZZZ00000006194SVWZ+OTHR 0000117448795 0019869676274                Rechnungsnr: 120958734234          KdNr. 117448795 Vodafone sagt Danke     ",
    "rechnungsnummer": null,
    "mref": "DE04KMMC000117448795T025802790",
    "eref": "0000117448795 0019869676274",
    "kref": "",
    "cred": "DE26ZZZ00000006194",
    "debt": "",
    "svwz": "OTHR 0000117448795 0019869676274                Rechnungsnr: 120958734234          KdNr. 117448795 Vodafone sagt Danke     ",
    "abwa": ""
}
      */
      ptype: 'tualo_rowexpander',
      rowBodyTpl: new Ext.XTemplate(
        '<table style="width: 100%;">',
        '<tr>',
        '<td style="width: 50%;">IBAN</td>',
        '<td>{kontonummer}</td>',
        '</tr>',
        '<tr>',
        '<td>Partner</td>',
        '<td>{empfaengername1}</td>',
        '</tr>',
        '<tr>',
        '<td>Mandatsreferenz</td>',
        '<td>{mref}</td>',
        '</tr>',
        '<tr>',
        '<td>End zu End - Referenz</td>',
        '<td>{eref}</td>',
        '</tr>',
        '<tr>',
        '<td>Text</td>',
        '<td>{svwz}</td>',
        '</tr>',
        '<tr>',
        '<td>Wert</td>',
        '<td>{betrag:this.formatChange}</td>',
        '</tr>',
        '</table>',
        /*
                '<p><b>IBAN:</b> {kontonummer}</p>',
                '<p><b>Partner:</b> {empfaengername1}</p>',
                '<p><b>Mandatsreferenz:</b> {mref}</p>',
                '<p><b>End zu End - Referenz:</b> {eref}</p>',
                '<p><b>Text:</b> {svwz}</p>',
                '<p><b>Wert:</b> {betrag:this.formatChange}</p>',
                */
        {
          formatChange: function (v) {
            var color = v >= 0 ? 'green' : 'red';

            return '<span style="color: ' + color + ';">' +
              Ext.util.Format.deMoneyRenderer(v) + '</span>';
          }
        })
    }
  ],

  columns: [

    {
      dataIndex: 'buchungsdatum',
      header: 'Buchungsdatum',
      xtype: 'datecolumn',
      groupable: true,
      format: 'd.m.Y',
      align: 'center',
      hidden: true
    },
    {
      dataIndex: 'kontonummer',
      header: 'Kontonummer',
      groupable: true,
      hidden: false
    },
    {
      dataIndex: 'valuta',
      header: 'Valuta',
      xtype: 'datecolumn',
      groupable: true,
      format: 'd.m.Y',
      flex: 1,
      align: 'center',
      "filter": {
        "type": "date",
        "dateFormat": "Y-m-d",
        /*"value": {
          'lt': (new Date()) - 1000 * 60 * 60 * 24 * 30,
        },*/
        // "active": true,
        "pickerDefaults": {
          "xtype": "datepicker",
          "border": 0,
          "format": "Y-m-d"
        }
      },
      renderer: function (value, meta, record) {
        if (record.get('state') == 1) {
          meta.style += "background-color:rgb(220,255,220);";
        }
        if (record.get('state') == 2) {
          meta.style += "background-color:rgb(250,255,220);";
        }
        return Ext.util.Format.deDate(value);
      }
    },
    {
      dataIndex: 'betrag',
      header: 'Betrag',
      groupable: true,
      flex: 1,
      xtype: 'numbercolumn',
      format: '0.000,00/i',
      align: 'right'
    },
    {
      dataIndex: 'verwendungszweck1',
      header: 'Verwendungszweck',
      flex: 1,
      hidden: true,
      renderer: function (v, m, r) {
        return r.get('verwendungszweck')
      }
    },
    {
      dataIndex: 'bankkonto',
      header: 'Bankkonto',
      groupable: true,
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
      flex: 1,
      hidden: true
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
