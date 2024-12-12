Ext.define('Tualo.FinTS.controller.AccountView', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fints_accountview',
    onReady: function () {
        console.log('onReady');
    },
    onNextClicked: function(){
      console.log('onNextClicked');
      this.lookupReference('grid').controller.selectNext();
    },
    onCheckRecord: function(record,records){
      console.log('onCheckRecord',record,records.length);
      this.lookupReference('form').controller.check(record,records);
    },
    onChecked: function(record,state,records){
      console.log('onChecked',record,state,records.length);
      this.lookupReference('grid').controller.onChecked(record,state,records);
    },
    onSelectRecord: function(record){
      console.log('onSelectRecord',record);
      this.lookupReference('form').controller.select(record);
    },
    onFormUpdated: function(id){
      console.log('onFormUpdated',id);
      this.lookupReference('grid').controller.selectNext();
      this.lookupReference('grid').controller.refresh();
    }
});