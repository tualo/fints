Ext.define('Tualo.routes.FinTSAccountViewExtended', {
    statics: {
        load: async function () {
            return [
                {
                    name: 'FinTS View Extended',
                    path: '#fints/viewextended'
                }
            ]
        }
    },
    url: 'fints/viewextended',
    handler: {
        action: function (values) {
            console.log('action');

            Ext.getApplication().addView('Tualo.FinTS.lazy.extended.AccountView', {
                values: values
            });
        },
        before: function (action) {
            console.log('before', arguments);
            let fn = Ext.require, txt = 'Tualo.FinTS.lazy.extended' + '.AccountView';
            fn(txt, function () {
                action.resume();
            }, this);
        }

    }
});