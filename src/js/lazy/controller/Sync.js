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

    getTanMedia:  async function(cb){
        let me = this,
            view = me.getView(),
            m = me.getViewModel();

            console.log('getTanMedia')
            try{
        const formData = new FormData();
        formData.append("action", "getTanMedia");
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
    }catch(e){
        console.log(e);
    }

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

    statements:  async function(cb){
        let me = this,
            view = me.getView(),
            m = me.getViewModel();

        const formData = new FormData();
        formData.append("action", "getStatements");
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

            if (modes.msg=='This action requires a TAN to be completed.'){
                Ext.Msg.prompt('TAN','Bitte gibt eine TAN zur Freigabe ein',(btn,txt)=>{
                        if (btn){
                            m.set('accountTAN',txt);
                            me.submitTan(()=>{
                                me.statements(cb);
                            });
                        }
                },me,false,'')
            }
            Ext.toast({
                html: modes.msg,
                title: 'Fehler',
                align: 't',
                iconCls: 'fa fa-warning'
            });
        }else{
            

            if (modes.response.result=='needsTan'){
                Ext.Msg.prompt('TAN','Bitte gibt eine TAN zur Freigabe ein',(btn,txt)=>{
                        if (btn){
                            m.set('accountTAN',txt);
                            me.submitTan(()=>{
                                me.statements(cb);
                            });
                        }
                },me,false,'')
                return;
            }
            
            console.log('statements controller',modes);
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

           return true;


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