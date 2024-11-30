Ext.define('Tualo.FinTS.controller.Syncform', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fints_sync',

    onReady: async function () {
        let me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            state = await fetch('./fints/state').then((response)=>{return response.json()});

        if (state.success==false){
            Ext.toast({
                html: state.msg,
                title: 'Fehler',
                align: 't',
                iconCls: 'fa fa-warning'
            });
        }


    },
    clean:  async function(btn){
        let me = this,
        view = me.getView(),
        x =  view.disable(),
        clean = await fetch('./fints/clean').then((response)=>{return response.json()})
        if (clean.success==false){
            Ext.toast({
                html: clean.msg,
                title: 'Fehler',
                align: 't',
                iconCls: 'fa fa-warning'
            });
        }
        view.enable()

    }
});