Ext.define('Tualo.routes.FinTSSend',{
    statics: {
        load: async function() {
            return [
                {
                    name: 'FinTSSend',
                    path: '#fints/send/:{__fints_iban}/:{__fints_value}/:{__fints_text}/:{__fints_name}'
                }
            ]
        }
    }, 
    url: 'fints/send/:{__fints_iban}/:{__fints_value}/:{__fints_text}/:{__fints_name}',
    handler: {
        action: function( values ){
            console.log('action');

            Ext.getApplication().addView('Tualo.FinTS.Send',{
                values: values
            });
        },
        before: function ( values, action) {
            let fn = Ext.require, txt = 'Tualo.FinTS'+'.Send';
            fn(txt,function(){
                action.resume();
            },this);
        }

    }
});