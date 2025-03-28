Ext.define('Tualo.FinTS.lazy.extended.models.Form', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fints_accountview_extended_form',
    requires: [
        'Tualo.FinTS.models.TanModes'
    ],
    data: {
        record: null,
        sumValue: 0,
    },
    formulas: {

        datum_wert_id: function (get) {
            if (get('record') == null) {
                return '';
            }
            let html = [
                Ext.util.Format.date(get('record').get('kontonummer'), 'd.m.Y'),
                ' / ',
                Ext.util.Format.date(get('datum'), 'd.m.Y'),
                ' / ',
                Ext.util.Format.number(get('betrag'), '0.000,00/i') + '€'
            ]
            return html.join('<br>');

            //return Ext.util.Format.date(get('valuta'), 'd.m.Y') + ' / ' + Ext.util.Format.number(get('betrag'), '0.000,00/i') + '€';
        },

        canSave: function (get) {
            if (get('record') == null) {
                return false;
            }
            let d = (Math.round(get('record').get('betrag') * 100) - Math.round(get('sumValue') * 100)) / 100;
            console.log('d', d);
            if (d == 0) {
                return true;
            }
            return false;
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
        },


        statusText: function (get) {
            if (get('record') == null) {
                return '';
            }
            let d = (Math.round(get('record').get('betrag') * 100) - Math.round(get('sumValue') * 100)) / 100;
            res = [
                'gesuchter Betrag: ' + Ext.util.Format.deMoneyRenderer(get('record').get('betrag')),
                'gewählte Belege: ' + Ext.util.Format.deMoneyRenderer(get('sumValue'))
            ];

            if (d < 0) {
                res.push('<span style="color:red; font-weight:bold;">Differenz: ' + Ext.util.Format.deMoneyRenderer(d)) + '</span>';
            }
            if (d == 0) {
                res.push('<span style="color:green; font-weight:bold;">Treffer: ' + Ext.util.Format.deMoneyRenderer(d)) + '</span>';
            }
            if (d > 0) {
                res.push('<span style="color:orange; font-weight:bold;">Differenz: ' + Ext.util.Format.deMoneyRenderer(d)) + '</span>';
            }



            /*
            d < 0 ? '<strong>Differenz: ' + Ext.util.Format.deMoneyRenderer(d) + '</strong>' :
              d == 0 ? '<span style="color:green;">' :
                '<strong>Treffer: ' + Ext.util.Format.deMoneyRenderer(d) + '</strong>',
            d == 0 ? '</span>' : ''
            */

            return res.join(' | ');
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

        fints_iban_relation: {
            type: 'view_fints_iban_relation_store',

            autoLoad: true
        },
        fints_reports: {
            type: 'view_fints_reportlist_store',
            listeners: {
                beforeload: 'onBeforeStoreLoad',
                datachanged: 'onReportsDataChanged'
            },
        }
    }

});