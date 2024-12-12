Ext.define('Tualo.FinTS.AccountViewForm', {
  extend: 'Ext.form.Panel',
  requires: [
    'Tualo.FinTS.models.AccountViewForm',
    'Tualo.FinTS.controller.AccountViewForm'
  ],
  alias: 'widget.fints_accountview_form',
  listeners: {
    boxReady: 'onBoxReady',
    resize: 'onResize'
  },
  controller: 'fints_accountview_form',
  viewModel: {
      type: 'fints_accountview_form'
  },
  defaultType: 'textfield',
  layout: 'anchor',
  defaults: {
    anchor: '100%',
    labelWidth: 200
  },
  bodyPadding: 15,
  items: [
    {
      xtype: 'fieldset',
      title: 'Kontoauszug',
      defaults: {
        anchor: '100%',
        labelWidth: 200
      },
      items: [
        {
          fieldLabel: 'Datum/ Wert',
          name: 'id',
          bind: '{datum_wert_id}',
          xtype: 'displayfield'
        },
        {
          fieldLabel: 'Name',
          name: 'name',
          bind: '{name}',
          xtype: 'displayfield'
        },
        {
          fieldLabel: 'Verwendungszweck',
          name: 'svwz',
          bind: '{svwz}',
          xtype: 'displayfield'
        },
        {
          fieldLabel: 'Mandatsreferenz',
          name: 'mref',
          bind: '{mref}',
          xtype: 'displayfield'
        },
        {
          fieldLabel: 'End-zu-End- Referenz',
          name: 'eref',
          bind: '{eref}',
          xtype: 'displayfield'
        },
        {
          fieldLabel: 'Kundenreferenz',
          name: 'kref',
          bind: '{kref}',
          xtype: 'displayfield'
        }
      ]
  },
  {
    xtype: 'fieldset',
    title: 'Zahlungsübereinstimmung',
    defaults: {
      anchor: '100%',
      labelWidth: 200
    },
    items: [

      {
        fieldLabel: 'Betrag gefunden',
        name: '_ist_betrag',
        bind: '{display_ist_betrag}',
        xtype: 'displayfield'
      },
      {
        fieldLabel: 'Status',
        bind: '{display_status}',
        xtype: 'displayfield'
      },
      {
        fieldLabel: 'Bezugsnummer',
        name: '_ist_bezug',
        bind: {
          value: '{_ist_bezug}',
          store: '{bezug}'
        },
        displayField: 'name',
        valueField: 'id',
        queryMode: 'local',
        xtype: 'combobox',
        listeners: {
          change: 'onBezugFieldChanged'
        },
        listConfig: {
            itemTpl: Ext.create('Ext.XTemplate', '', '{name} <br/> {id} <br/> Gesamt-Offen: {offen}', '')
         }
      },

      {
        fieldLabel: 'Belegnummer(n)',
        //name: '_ist_beleg',
        bind: {
          value: '{_ist_beleg}',
          store: '{open}'
        },
        displayField: '_display',
        valueField: 'belegnummer',
        queryMode: 'local',
        xtype: 'tagfield',
        listeners: {
          change: 'onTagFieldChanged'
        },

        listConfig: {
          itemTpl: Ext.create('Ext.XTemplate', '', '{belegnummer} <br/> {referenz} <br/> Offen: {offen:number("0.000,00/i")} <br/> Datum: {datum:date("d.m.Y")}', '')
        }
      },

      {
        fieldLabel: 'alle Belegnummer(n)',
        //name: '_ist_beleg',
        bind: {
          value: '{_force_beleg}',
          store: '{all}'
        },
        displayField: '_display',
        valueField: 'belegnummer',
        queryMode: 'local',
        xtype: 'tagfield',
        listeners: {
          change: 'onTagFieldChangedAll'
        },
        queryMode: 'remote',
        triggerAction: 'all',
        listConfig: {
          itemTpl: Ext.create('Ext.XTemplate', '', '{belegnummer} <br/> {referenz} <br/> {name} <br/> {datum:date("d.m.Y")} <br/> Offen: {offen:number("0.000,00/i")} <br/> Brutto: {brutto:number("0.000,00/i")} <br/> Datum: {datum:date("d.m.Y")}', '')
        }
      }
    ]
  },

  {
    name: '_state',
    bind: '{_state}',
    xtype: 'hidden'
  }
  ],


  dockedItems: [{
    xtype: 'toolbar',
    dock: 'bottom',
    ui: 'footer',
    reference: 'buttons_footer',
    defaults: {minWidth: 30},
    items: [

      { xtype: 'component', flex: 1 },
      {
        text: 'Speichern',
        bind: {
          disabled: '{!canSave}'
        },
        handler: 'save'
      },
      {
        text: 'Weiter',
        handler: 'next'
      }
    ]
  }]


});
