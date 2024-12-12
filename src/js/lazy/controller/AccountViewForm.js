Ext.define('Tualo.FinTS.controller.AccountViewForm', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fints_accountview_form',
    onReady: function () {
        console.log('onReady');
    },
    onBoxReady: function () {
        console.log('controller.cmp_kontoauszug_form', 'ready');
        this.getViewModel().getStore('status').load();
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
    select: function(record){
      if (record){
        var ds = this.findKNRN(record.data);
        this.getViewModel().set(ds);
        if (ds._state==0){
          this.findKN(record.data);
        }
        this.getViewModel().getStore('bezug').load();
        this.getViewModel().getStore('open').load();
      }
    },
    getBetragKey: function(d){
        return Ext.util.Format.number(d,'0.000,00/i');
      },
      getData: function(){
        var data = [];
        var me = this;
        var open = this.getViewModel().getStore('open').getRange();
        this.betragHash = {};
        open.forEach(function(item){
          data.push(item.data);
          var key = me.getBetragKey(item.data.offen);
          if (typeof me.betragHash[key]=='undefined'){
            me.betragHash[key]=0;
          }
          me.betragHash[key]++;
        });
        return data;
      },
    ignore: function (state_id) {
        return function (cb) {
            var formID = this.getViewModel().get('id');
            Ext.MessageBox.wait('Bitte warten ...', '');
            
            Tualo.Ajax.request({
                url: './index.php',
                scope: this,
                showWait: true,
                params: {
                    TEMPLATE: 'NO',
                    sid: sid,
                    cmp: 'cmp_kontoauszug',
                    p: 'q/ignore',
                    state_id: state_id,
                    id: formID
                },
                json: function (response) {
                    Ext.MessageBox.hide();
                    if (response.success) {

                    } else {
                        Ext.MessageBox.alert('Fehler', 'Die Daten konnten nicht gespeichert werden.');
                    }
                    this.view.fireEvent('updated', formID);
                }
            });
        }.bind(this);
    },
    next: function () {
        this.view.fireEvent('nextClicked');
        //this.treegrid.getSelectionModel().selectNext();
    },
    findKN: function(ds) {
      var data = this.getData();
      var me = this;
      var v = ds.verwendungszweck; //1 + ds.verwendungszweck2 + ds.verwendungszweck3 + ds.verwendungszweck4 + ds.verwendungszweck5;
      //ds.verwendungszweck = ds.verwendungszweck1 + ds.verwendungszweck2 + ds.verwendungszweck3 + ds.verwendungszweck4 + ds.verwendungszweck5;
      v = v.replace(/\s/gi,'');

      /*
      data.forEach(function(item){
        var matchcols = JSON.parse(item.matchcols);
        var found = false;
        matchcols.forEach(function(str){

          if ((str.length>3)&&(v.indexOf(str)>=0)){
            found = true;
          }
        })
        if (found){
          me.getViewModel().set('_ist_bezug',item.bezugsnummer);
          console.log(item.referenz);
          if (v.indexOf(item.referenz)>=0){
            me.getViewModel().set('_ist_beleg',[item.belegnummer]);
          }
        }
      });
      */
    },
    findKNRN: function(ds) {
        var openstore=this.getViewModel().getStore('open');
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
            if (ds._state!=1){
              if ((data[i].offen * 1 == ds.betrag * 1) && (this.betragHash[this.getBetragKey(data[i].offen * 1) ]==1)) {

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
    }
});