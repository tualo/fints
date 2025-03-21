Ext.define('Tualo.FinTS.controller.Send', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fints_send',

    onReady: function () {
        
        console.log('onReady',this.getViewModel().get('iban'));


        /*
        let me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            state = await fetch('./fints/state').then((response)=>{return response.json()});
    
        
        console.log('onReady',me.getViewModel().get('iban'));

        if (state.success==false){
            Ext.toast({
                html: state.msg,
                title: 'Fehler',
                align: 't',
                iconCls: 'fa fa-warning'
            });
        }
            */

        


    },


    forceSelection: function(){
        let me = this,
            list = me.getView().getComponent('accountPanel').getComponent('accountList'),
            sels = list.getSelection();
        
        if (sels.length==0){
            list.setSelection(list.getStore().getRange()[0]);
        }
        

    },



    getTanModes:  async function(){
        let me = this,
            view = me.getView(),
            m = me.getViewModel();
        await me.clean()

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
                html: modes.msg,
                title: 'Fehler',
                align: 't',
                iconCls: 'fa fa-warning'
            });
        }else{
            

            
            let recs=[];
            modes.response.forEach((rec)=>{
                recs.push(Ext.create('Tualo.FinTS.models.TanModes', rec))
            })

            m.getStore('tanmodes').loadRecords(recs);
            me.getView().getComponent('tanmodes').getComponent('tanmodescombobox').select(recs[0]);


        }
        view.enable()

    },

    login:  async function(cb){
        let me = this,
            view = me.getView(),
            m = me.getViewModel();

        const formData = new FormData();
        formData.append("action", "login");
        formData.append("useaccount", m.get('selectedAccount').get('id'));
        formData.append("usepin", m.get('accountPassword'));
        formData.append("tanmode", m.get('accountTANModeID'));
        formData.append("tan", m.get('accountTAN'));
        formData.append("fints_accounts__banking_username", m.get('selectedAccount').get('banking_username'));

        modes = await fetch('./fints/challenge',{
            method: "POST",
            body: formData,
        }).then((response)=>{return response.json()});

        if (modes.success==false){
            Ext.toast({
                html: modes.msg,
                title: 'Fehler',
                align: 't',
                iconCls: 'fa fa-warning'
            });
        }else{
            

             /*
            let recs=[];
            modes.response.forEach((rec)=>{
                recs.push(Ext.create('Tualo.FinTS.models.TanModes', rec))
            })

           
            m.getStore('tanmodes').loadRecords(recs);
            me.getView().getComponent('tanmodes').getComponent('tanmodescombobox').select(recs[0]);
            */

            if (typeof cb=='function'){
                cb();
            }

        }
        view.enable()

    },

    submitTan:  async function(cb){
        let me = this,
            view = me.getView(),
            m = me.getViewModel();

        const formData = new FormData();
        formData.append("action", "submitTan");
        formData.append("useaccount", m.get('selectedAccount').get('id'));
        formData.append("usepin", m.get('accountPassword'));
        formData.append("tanmode", m.get('accountTANModeID'));
        formData.append("tan", m.get('accountTAN'));
        formData.append("fints_accounts__banking_username", m.get('selectedAccount').get('banking_username'));

        modes = await fetch('./fints/challenge',{
            method: "POST",
            body: formData,
        }).then((response)=>{return response.json()});

        console.log('submitTan',modes);
        cb();
    },

    transfer:  async function(cb){
        let me = this,
        view = me.getView(),
        m = me.getViewModel();

        const formData = new FormData();
        formData.append("action", "transfer");
        formData.append("useaccount", m.get('selectedAccount').get('id'));
        formData.append("usepin", m.get('accountPassword'));
        formData.append("tanmode", m.get('accountTANModeID'));
        formData.append("tan", m.get('accountTAN'));
        formData.append("fints_accounts__banking_username", m.get('selectedAccount').get('banking_username'));

        formData.append("iban", m.get('iban'));
        formData.append("name", m.get('name'));
        formData.append("text", m.get('text'));
        formData.append("value", m.get('value'));

        modes = await fetch('./fints/transfer',{
            method: "POST",
            body: formData,
        }).then((response)=>{return response.json()});

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