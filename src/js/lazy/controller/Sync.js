Ext.define('Tualo.FinTS.controller.Sync', {
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

    getTanModes:  async function(){
        let me = this,
            view = me.getView(),
            m = me.getViewModel();

        const formData = new FormData();
        formData.append("action", "getTanModes");
        formData.append("useaccount", m.get('selectedAccount').get('id'));
        formData.append("usepin", m.get('accountPassword'));
        formData.append("fints_accounts__banking_username", m.get('selectedAccount').get('banking_username'));

        modes = await fetch('./fints/challenge',{
            method: "POST",
            body: formData,
        }).then((response)=>{return response.json()});

        if (modes.success==false){
            Ext.toast({
                html: clean.msg,
                title: 'Fehler',
                align: 't',
                iconCls: 'fa fa-warning'
            });
        }else{
            
            m.getStore('tanmodes').insert(0,modes.response);

            console.log('modes.response',modes.response,m.getStore('tanmodes'));
            window.m = m.getStore('tanmodes');

        }
        view.enable()

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