Ext.define('Tualo.routes.ResetAccountItem', {
    statics: {
        load: async function () {
            return [
                {
                    name: 'ResetAccountItem',
                    path: '#fints/resetaccountitem/:{id}'
                }
            ]
        }
    },
    url: 'fints/resetaccountitem(\/:{id})',
    handler: {
        action: function (values) {

            /*
            console.log('action');

            Ext.getApplication().addView('Tualo.FinTS.Send', {
                values: values
            });
            */
            Ext.Msg.confirm("Zurücksetzen", "Möchten Sie diesen Kontoauszug wieder freistellen?", async (btn) => {
                console.log(btn, values);
                if (btn == 'yes') {
                    let res = await (await fetch('./fints/resetaccountitem/' + values.id)).json();
                    if (res.success !== true) {
                        Ext.toast({
                            html: res.msg,
                            title: 'Fehler',
                            align: 't',
                            iconCls: 'fa fa-warning'
                        });
                    } else {
                        Ext.toast({
                            html: "Der Eintrag wurde freigestellt",
                            title: 'Kontoauszug',
                            align: 't',
                            iconCls: 'fa fa-success'
                        });

                    }
                }
                Ext.util.History.back();
            }, this);
        },
        before: function (values, action) {
            action.resume();
        }

    }
});