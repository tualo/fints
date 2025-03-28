Ext.define('Tualo.FinTS.lazy.extended.controller.Grid', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.fints_accountview_extended_grid',

  onBoxReady: function () {
    console.log('controller.AccountViewGrid', 'ready');
  },
  onResize: function () {

  },

  loopRequestClicked: function () {
    this.checkedRecs = [];
    this.loopRequest(this.getViewModel().getStore('kontoauszug').getRange());
  },
  loopRequest: function (records) {
    if (records.length > 0) {
      this.view.fireEvent('checkRecord', records[0], records.slice(1));
    }
  },
  syncClicked: function () {
    Ext.getApplication().redirectTo('#fints/sync')
  },

  onStoreLoad: function (store, records) {
    if (this.checkedRecs) {
      this.checkedRecs.forEach(function (item) {
        var rec = store.getById(item.id);
        if (rec) {
          rec.set('state', item.state);
        }
      });
    }
  },
  onSelectionChange: function () {

    var recs = this.view.getSelectionModel().getSelection();
    console.log('onSelectionChange', recs);
    //this.view.getView().getRow(this.myGridPanel.getStore().getCount()-1).scrollIntoView();
    try {
      /*
      var rowEl = this.view.getView().getRowByRecord(recs[0]);
      rowEl.scrollIntoView();
      */
    } catch (error) {

    }
    this.view.fireEvent('selectRecord', recs[0]);
  },
  onChecked: function (record, state, records) {
    this.checkedRecs.push({
      id: record.get('id'),
      state: state
    });
    if (records.length > 0) {
      record.set('state', state);
      setTimeout(function () {
        this.loopRequest(records);
      }.bind(this), 1);
    } else {
      console.log('done');
    }
  },
  selectNext: function () {
    this.view.getSelectionModel().selectNext();
  },
  refresh: function () {
    this.getViewModel().getStore('kontoauszug').load();
  }
});