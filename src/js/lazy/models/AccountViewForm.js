Ext.define('Tualo.FinTS.models.AccountViewForm', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.fints_accountview_form',
  requires: [
    'Tualo.FinTS.models.TanModes'
  ],
  data: {
    id: '',
    betrag: 0,
    valuta: new Date(),
    name: ' ',
    bezugsnummer: '',
    belegnummer: '',
    verwendungszweck: '',
    svwz: '',
    cred: '',
    debt: '',
    eref: '',
    mref: '',
    _ist_bezug: '',
    _ist_beleg: [],
    _force_beleg: [],
    _ist_betrag: 0,
    _ist_status: '',
    _state: 0
  },
  formulas: {
    canSave: function (get) {
      if (get('_ist_betrag') != 0) {
        return true;
      }
      if (get('_force_beleg').length != 0) {
        return true;
      }

      return false;
    },
    datum_wert_id: function (get) {
      return Ext.util.Format.date(get('valuta'), 'd.m.Y') + ' / ' + Ext.util.Format.number(get('betrag'), '0.000,00/i') + '€';
    },
    display_ist_betrag: function (get) {
      return Ext.util.Format.number(get('_ist_betrag'), '0.000,00/i') + '€';
    },
    display_status: function (get) {
      if (get('_ist_status') != '') {
        return get('_ist_status');
      } else {
        if (get('betrag') == get('_ist_betrag')) {
          return 'Der Betrag stimmt überein.';
        }
        if (get('betrag') < get('_ist_betrag')) {
          return 'Der Kontobetrag ist kleiner als der offene Betrag des Beleges.';
        }
        if (get('betrag') > get('_ist_betrag')) {
          return 'Der Kontobetrag ist größer als der offene Betrag des Beleges.';
        }
      }
      return '';
    }
  },
  stores: {
    status: {
      fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' }
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
        { name: 'id', type: 'string' },
        { name: 'tabellenzusatz', type: 'string' },
        { name: 'belegartid', type: 'number' },
        { name: 'bw_faktor', type: 'number' },
        { name: '_display', type: 'string' },

        { name: 'matchcols', type: 'string' },
        { name: 'datum', type: 'date' },
        { name: 'buchungsdatum', type: 'date' },
        { name: 'belegnummer', type: 'string' },
        { name: 'referenz', type: 'string' },
        { name: 'bezugnummer', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'brutto', type: 'number' },
        { name: 'offen', type: 'number' }
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


    all: {
      fields: [
        { name: 'id', type: 'string' },
        { name: 'tabellenzusatz', type: 'string' },
        { name: 'belegartid', type: 'number' },
        { name: 'bw_faktor', type: 'number' },
        { name: '_display', type: 'string' },

        { name: 'matchcols', type: 'string' },
        { name: 'datum', type: 'date' },
        { name: 'buchungsdatum', type: 'date' },
        { name: 'belegnummer', type: 'string' },
        { name: 'referenz', type: 'string' },
        { name: 'bezugnummer', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'brutto', type: 'number' },
        { name: 'offen', type: 'number' }
      ],
      pageSize: 5000,
      proxy: {
        type: 'ajax',
        url: './fints/reports',
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
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'matchcols', type: 'string' },
        { name: 'offen', type: 'number' }
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