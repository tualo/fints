Ext.define('Tualo.FinTS.lazy.extended.controller.Form', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fints_accountview_extended_form',
    onReady: function () {
        console.log('onReady');
    },
    onBoxReady: function () {
        this.getViewModel().getStore('status').load();

        //onBeforeStoreLoad
        let view = this.getView().getComponent('fints_reportlist');
        view.getStore().on('beforeload', this.onBeforeStoreLoad, this);
        view.on('summary', this.onSummary, this);

    },
    onSummary: function (type, field, data) {

        if (type == 'sum') {
            if (field == 'offen') {
                this.getViewModel().set('sumValue', data);
            }
        }

    },
    onResize: function () {

    },

    onStatusStoreLoad: function (store, records) {
        var me = this;
        var buttons_footer = this.lookupReference('buttons_footer');
        records.forEach(function (item) {
            var btn = Ext.create('Ext.Button', {
                text: item.get('name'),
                handler: me.ignore(item.get('id'))
            });
            buttons_footer.items.insert(0, btn);
        });
    },

    select: function (record) {
        if (record) {

            this.getViewModel().set('record', record, this.getView());
            this.preselectectFilter(record);



            var ds = this.findKNRN(record.data);

            this.getViewModel().set(ds);
            if (ds._state == 0) {
                this.findKN(record.data);
            }
            this.getViewModel().getStore('bezug').load();
            this.getViewModel().getStore('open').load();
        }
    },
    getBetragKey: function (d) {
        return Ext.util.Format.number(d, '0.000,00/i');
    },
    getData: function () {
        var data = [];
        var me = this;
        var open = this.getViewModel().getStore('open').getRange();
        this.betragHash = {};
        open.forEach(function (item) {
            data.push(item.data);
            var key = me.getBetragKey(item.data.offen);
            if (typeof me.betragHash[key] == 'undefined') {
                me.betragHash[key] = 0;
            }
            me.betragHash[key]++;
        });
        return data;
    },
    ignore: function (state_id) {
        return async function (cb) {
            var formID = this.getViewModel().get('id');

            // Ext.MessageBox.wait('Bitte warten ...', '');

            const formData = new FormData();
            formData.append("state_id", state_id);
            formData.append("formID", formID);

            modes = await fetch('./fints/ignore', {
                method: "POST",
                body: formData,
            }).then((response) => { return response.json() });

            this.view.fireEvent('updated', formID);


        }.bind(this);
    },
    next: function () {
        this.view.fireEvent('nextClicked');
        //this.treegrid.getSelectionModel().selectNext();
    },
    findKN: function (ds) {
        var data = this.getData();
        var me = this;
        var v = ds.verwendungszweck; //1 + ds.verwendungszweck2 + ds.verwendungszweck3 + ds.verwendungszweck4 + ds.verwendungszweck5;
        //ds.verwendungszweck = ds.verwendungszweck1 + ds.verwendungszweck2 + ds.verwendungszweck3 + ds.verwendungszweck4 + ds.verwendungszweck5;
        v = v.replace(/\s/gi, '');


    },



    getPayments: function () {
        let me = this,
            record = me.getViewModel().get('record'),
            datum = Ext.util.Format.date(record.get('valuta'), 'Y-m-d'),
            view = this.getView().getComponent('fints_reportlist'),
            store = view.getStore(),
            range = store.getRange(),
            payments = [],
            error = false,
            formID = record.get('id')
        restbetrag = record.get('betrag');

        range.filter((item) => item.get('verwenden')).forEach(function (item) {
            payments.push({
                belegnummer: item.get('belegnummer'),
                id: formID,
                datum: datum,
                bw_faktor: item.get('bw_faktor'),
                tabellenzusatz: item.get('tabellenzusatz'),
                betrag: item.get('offen'),
                ueberzahlung: 0,
                zahlungsart: 'Überweisung/Lastschrift'
            });

            restbetrag -= item.get('offen');
        });
        payments[payments.length - 1].ueberzahlung = Math.round(restbetrag * 100) / 100;


        //        var restbetrag = this.getViewModel().get('betrag');

        /*
        var belege = this.getViewModel().get('_ist_beleg');

        var force_belege = this.getViewModel().get('_force_beleg');

        var datum = Ext.util.Format.date(this.getViewModel().get('valuta'), 'Y-m-d');
        var openstore = this.getViewModel().getStore('open');
        var allstore = this.getViewModel().getStore('all');
        //openstore.filter('bezugsnummer', nv);

        var payments = [];
        var error = false;
        force_belege.forEach(function (item) {
            var record = me.allhash[item];

            if (record == null) {
                error = true;
                alert('error');
            } else {
                payments.push({
                    belegnummer: item,
                    id: formID,
                    datum: datum,
                    bw_faktor: record.get('bw_faktor'),
                    tabellenzusatz: record.get('tabellenzusatz'),
                    belegartid: record.get('belegartid'),
                    betrag: record.get('offen'),
                    ueberzahlung: 0
                });
            }

            restbetrag -= record.get('offen');
        });

        belege.forEach(function (item) {
            var record = openstore.getById(item);
            if (record == null) {
                error = true;
            }
            payments.push({
                belegnummer: item,
                id: formID,
                datum: datum,
                bw_faktor: record.get('bw_faktor'),
                tabellenzusatz: record.get('tabellenzusatz'),
                belegartid: record.get('belegartid'),
                betrag: record.get('offen'),
                ueberzahlung: 0,
                zahlungsart: 'Überweisung/Lastschrift'
            });

            restbetrag -= record.get('offen');
        });
        */
        if (error) {
            throw new Error("Nicht alle Zahlungen können verarbeitet werden.");
        }

        return payments;
    },

    save: async function (cb) {
        var formID = this.getViewModel().get('id');
        try {
            var payments = this.getPayments();

            console.log('save', payments);

            const formData = new FormData();
            formData.append("payments", JSON.stringify(payments));

            response = await fetch('./fints/save', {
                method: "POST",
                body: formData,
            }).then((response) => { return response.json() });

            if (response.success) {
                if (typeof cb == 'function') {
                    cb().bind(this);
                }
            } else {
                Ext.MessageBox.alert('Fehler', response.msg);
            }
            this.view.fireEvent('updated', formID);



        } catch (e) {
            Ext.MessageBox.alert('Fehler', e);
        }

    },

    findKNRN: function (ds) {
        var openstore = this.getViewModel().getStore('open');
        openstore.filter('bezugsnummer', "");

        var data = this.getData();

        var v = ds.verwendungszweck1 + ds.verwendungszweck2 + ds.verwendungszweck3 + ds.verwendungszweck4 + ds.verwendungszweck5;
        ds.verwendungszweck = ds.verwendungszweck1 + ds.verwendungszweck2 + ds.verwendungszweck3 + ds.verwendungszweck4 + ds.verwendungszweck5;
        ds._ist_bezug = '';
        ds._ist_beleg = [];
        ds._force_beleg = [];
        ds._ist_betrag = 0;
        ds._ist_status = '';
        ds.name = '';
        ds._state = 0;
        var num_list = v.replace(/[^\d]/g, '.').replace(/\.\./g, '.').replace(/(\.)+/g, '.').split('.');
        var treffer = [];

        console.log('findKNRN', ds);
        for (var i = 0; i < data.length; i++) {
            if (
                (num_list.indexOf(data[i].belegnummer) > -1) &&
                (num_list.indexOf(data[i].bezugsnummer) > -1)
            ) {


                //exakter treffer
                if (data[i].offen * 1 == ds.betrag * 1) {
                    ds._ist_status = '100% Treffer';
                    ds._ist_bezug = data[i].bezugsnummer;
                    ds._ist_beleg.push(data[i].belegnummer);
                    ds._ist_betrag = data[i].offen * 1;
                    ds.name = data[i].name;
                    ds._state = 1;
                    break;
                }
            }

            if (
                (num_list.indexOf(data[i].belegnummer) > -1) &&
                (num_list.indexOf(data[i].bezugsnummer) == -1)
            ) {
                //exakter treffer
                if (data[i].offen * 1 == ds.betrag * 1) {
                    ds._ist_status = '100% Treffer (ohne Kundennummer)';
                    ds._ist_bezug = data[i].bezugsnummer;
                    ds._ist_beleg.push(data[i].belegnummer);
                    ds._ist_betrag = data[i].offen * 1;
                    ds.name = data[i].name;
                    ds._state = 1;
                    break;
                }
            }

            if (
                (num_list.indexOf(data[i].belegnummer) == -1) &&
                (num_list.indexOf(data[i].bezugsnummer) > -1)
            ) {
                //exakter treffer
                if (data[i].offen * 1 == ds.betrag * 1) {
                    ds._ist_status = '100% Treffer (nur Kundennummer)';
                    ds._ist_bezug = data[i].bezugsnummer;
                    ds._ist_beleg.push(data[i].belegnummer);
                    ds._ist_betrag = data[i].offen * 1;
                    ds.name = data[i].name;
                    ds._state = 1;
                    break;
                }
            }

            //betrag treffer
            if (ds._state != 1) {
                if ((data[i].offen * 1 == ds.betrag * 1) && (this.betragHash[this.getBetragKey(data[i].offen * 1)] == 1)) {

                    ds._ist_status = '100% Treffer im Betrag';
                    ds._ist_bezug = data[i].bezugsnummer;
                    ds._ist_beleg.push(data[i].belegnummer);
                    ds._ist_betrag = data[i].offen * 1;
                    ds.name = data[i].name;
                    ds._state = 1;
                    break;
                }
            }

        }
        if (ds._state == 1) {
            return ds;
        }



        for (var i = num_list.length - 1; i >= 0; i--) {
            if (num_list[i].length < 4) {
                delete num_list[i];
            }
        }

        for (var i = data.length - 1; i >= 0; i--) {

            //console.log("num_list.indexOf("+data[i].belegnummer+")",num_list.indexOf(data[i].belegnummer));
            if (
                (num_list.indexOf(data[i].belegnummer) > -1) &&
                (num_list.indexOf(data[i].bezugsnummer) > -1)
            ) {
                if (data[i].offen * 1 >= ds.betrag * 1) {
                    ds._ist_status = '95% Treffer';
                    ds._ist_bezug = data[i].bezugsnummer;
                    ds._ist_beleg.push(data[i].belegnummer);
                    ds._ist_betrag = data[i].offen * 1;
                    ds.name = data[i].name;
                    ds._state = 1;
                    break;
                }
            }

            if (
                (num_list.indexOf(data[i].belegnummer) > -1) &&
                (num_list.indexOf(data[i].bezugsnummer) == -1)
            ) {
                //exacter treffer
                console.log(ds.betrag, data[i].offen, (data[i].offen * 1 >= ds.betrag * 1))
                if (data[i].offen * 1 != ds.betrag * 1) {
                    ds._ist_status = '90% Treffer (ohne Kundennummer)';
                    ds._ist_bezug = data[i].bezugsnummer;
                    ds._ist_beleg.push(data[i].belegnummer);
                    ds._ist_betrag = data[i].offen * 1;
                    ds.name = data[i].name;
                    ds._state = 1;
                    break;
                }
            }



        }
        if (ds._state == 1) {
            return ds;
        }

        return ds;
    },


    onBezugFieldChanged: function (fld, nv, ov) {
        var valuta = this.getViewModel().get('valuta');
        var openstore = this.getViewModel().getStore('open');
        /*openstore.filterBy(function(item){
          if (item.get('bezugsnummer')==nv){
            //if (item.get('datum')<=valuta){
              return true;
            //}
          }
        });
        */
        openstore.filter('bezugsnummer', nv);

    },
    onTagFieldChanged: function (fld, nv, ov) {
        var open = this.getViewModel().getStore('open').getRange();
        var summe = 0;
        open.forEach(function (item) {
            nv.forEach(function (bn) {
                if (item.get('belegnummer') == bn) {
                    summe += item.get('offen');
                }
            });
        });
        this.getViewModel().set('_ist_betrag', summe);
        console.log('fld', nv, ov);
    },
    onTagFieldChangedAll: function (fld, nv, ov) {
        var me = this;
        var allstore = this.getViewModel().getStore('all');
        var record = allstore.getById(nv[nv.length - 1]);
        if (typeof this.allhash == 'undefined') {
            this.allhash = {};
        }
        this.allhash[nv[nv.length - 1]] = record;
        var summe = 0;
        for (var item in this.allhash) {
            if (this.allhash.hasOwnProperty(item)) {
                nv.forEach(function (bn) {
                    if (item == bn) {
                        summe += me.allhash[item].get('offen');
                    }
                });
            }
        }

        this.getViewModel().set('_ist_betrag', summe);
        console.log('fld', nv, ov, this.allhash);
    },

    check: function (record, records) {
        if (record) {
            var ds = this.findKNRN(record.data);
            console.log('check', ds)
            if (ds._state == 0) {
                console.log('check', ds._state)
                this.findKN(record.data);

                if (ds._state != 0) {
                    console.log('check', ds._state)
                    if (ds._ist_betrag * 1 == record.get('betrag') * 1) {
                        console.log('check', ds._state)
                        this.view.fireEvent('checked', record, 2, records);
                        return 2;
                    }
                }
            } else {
                this.view.fireEvent('checked', record, 1, records);
                return 1;
            }
        }
        this.view.fireEvent('checked', record, 0, records);
        return 0;
    },



    onReportsDataChanged: function (store) {
        var me = this;
        var data = store.getRange();

        console.log('onReportsDataChanged', data);
        data.forEach(function (item) {
            if (item.get('verwenden')) {
                console.log('onReportsDataChanged', item.get('offen'));
            }
        });
    },

    preselectectFilter: async function (record) {
        let me = this,
            view = me.getView().getComponent('fints_reportlist'),
            store = view.getStore(),
            kn = [],
            fltList = [];


        fltList = [

            {
                property: 'brutto',
                operator: 'neq',
                value: 0,
            }
        ];


        this.getViewModel().getStore('fints_iban_relation').getRange().forEach(function (item) {

            if (item.get('konto') == record.get('kontonummer')) {

                kn.push(item.get('kundennummer'));
            }
        });

        if (kn.length > 0) {
            fltList.push({
                property: 'kundennummer',
                operator: 'in',
                value: kn,
            });
        }

        fltList.push({
            property: 'offen',
            operator: 'eq',
            value: record.get('betrag'),
        });

        let list = this.getView().getComponent('fints_reportlist').getStore();
        list.clearFilter();

        this.filterLoopDown(fltList);

    },



    onBeforeStoreLoad: function (store) {
        var model = this.getViewModel(),
            view = this.getView(),
            referencedRecord = null, // this.getParentRecord()//model.get('referencedRecord'),
            reference = {},
            listfilter = store.getFilters(),
            listsorters = store.getSorters(),


            filters = [],
            sorters = [],
            extraParams = store.getProxy().getExtraParams();

        listsorters.each(function (item) {
            sorters.push(item.getConfig());
        });
        listfilter.each(function (item) {
            let c = item.getConfig();
            try {
                if (c.value instanceof Date) {
                    console.debug('listfilter', 'Date', 'workaround')
                    c.serializer(c);
                }
            } catch (e) { }
            filters.push(c);
        });
        if (Ext.isEmpty(extraParams)) { extraParams = {}; };


        extraParams.filter = Ext.JSON.encode(filters);
        extraParams.sort = Ext.JSON.encode(sorters);
        store.getProxy().setExtraParams(extraParams);

        console.log('onBeforeStoreLoad', filters, sorters, extraParams);
        return true;

    },



    filterLoopDown: function (fltList) {
        let me = this,
            view = me.getView().getComponent('fints_reportlist'),
            store = view.getStore();

        store.clearFilter();

        this.filterField(fltList, () => {
            if (store.getCount() == 0) {
                if (fltList.length > 1) {
                    fltList.pop();
                    return me.filterLoopDown(fltList);
                }
            }
            console.log('filterField', 'callback', store.getCount(), fltList, arguments);
            me.checkConfidence(store);
        });
    },

    checkConfidence: function (store) {
        let me = this,
            view = me.getView().getComponent('fints_reportlist'),
            records = store.getRange(),
            transaction = me.getViewModel().get('record'),
            confidence = 0;

        if (records.length == 1) {
            records[0].set('verwenden', true);
        }
        records.forEach(function (record) {
            console.log('checkConfidence', record, transaction);
            me.calculateConfidence(record, transaction);
            console.log('>>>>>checkConfidence', record, transaction);
        }
        );
    },

    filterField: function (filterData, cb) {
        var me = this,
            view = me.getView().getComponent('fints_reportlist'),
            store = view.getStore(),
            filterBy = filterData;
        if (store.isLoading()) {
            console.log('filterField', 'store is loading');
        }
        else {
            if (store.isLoaded()) store.clearFilter();
            me.filterBy(filterBy, cb);
        }
    },


    filterBy: function (filterBy, cb) {
        let view = this.getView().getComponent('fints_reportlist'),
            store = view.getStore(),
            columns = view.getColumns();

        filterBy.forEach(function (item) {
            columns.forEach(function (column) {
                if (item.property == column.dataIndex) {
                    try {
                        if ((column.filter.acceptedType === 'array') && (typeof item.value == 'string')) {

                            column.filter.filter.setValue([item.value]);
                        } else {
                            if (typeof column.filter.filter.setValue == 'function') {
                                column.filter.filter.setValue(item.value);
                            } else if (typeof column.filter.setFilterObject == 'function') {
                                column.filter.setFilterObject(item);
                            }
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    console.log('column', column.dataIndex, column.filter);
                    column.filter.setActive(true);
                }
            })
        });
        if (typeof cb != 'function') cb = () => { };
        store.load({
            params: {
                start: 0,
                filter: JSON.stringify(filterBy),
                limit: store.pageSize
            },
            callback: cb
        });
    },
    calculateConfidence: function (report, transaction) {
        let confidence = 0;
        let totalCriteria = 0; // Anzahl der Kriterien: betrag, empfaengername1, svwz

        // Prüfe Betrag (Absolutwert)
        totalCriteria += 2;
        if (Math.abs(report.get('brutto')) === Math.abs(transaction.get('betrag'))) {
            console.log('match found', 'brutto');
            confidence += 2;
        }

        // Prüfe Empfängername
        totalCriteria += 0.1;
        if (transaction.get('empfaengername1') && report.get('typ').includes(transaction.get('empfaengername1').trim())) {
            console.log('match found', 'empfaengername1');
            confidence += 0.1;
        }

        /*// Prüfe Verwendungszweck (svwz)
        if (transaction.get('svwz') && report.get('referenz').includes(transaction.get('svwz').trim())) {
          confidence += 1;
        }
        */

        // Prüfe Verwendungszweck (svwz)
        totalCriteria += 1;
        if (transaction.get('svwz')) {
            // Entferne Sonderzeichen und teile in Wörter
            let svwzWords = transaction.get('svwz').toLowerCase().replace(/[^\w\s\-]/gi, '').split(/\s+/).filter((e) => {
                if (e.length > 3) {
                    return e;
                }
            });
            let referenz = report.get('referenz');

            // Vergleiche jedes Wort mit dem Referenzstring
            let matchFound = svwzWords.some(word => referenz.toLowerCase().includes(word));
            if (matchFound) {
                console.log('match found', 'referenz');
                confidence += 1;
            }
        }


        // Berechne den Prozentsatz der Treffergenauigkeit
        console.log((confidence, totalCriteria));
        if (Math.round(confidence / totalCriteria * 100) > 0) {
            console.log('confidence', confidence / totalCriteria * 100);
            report.set('confidence', (confidence / totalCriteria));
        }
        return report;
    }


});