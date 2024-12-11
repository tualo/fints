Ext.define('Tualo.FinTS.models.Send', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fints_send',
    requires: [
        'Tualo.FinTS.models.TanModes'
    ],
    data:{
        interrupted: false,
        accountPassword: '',
        accountTANMode: '',
        accountTANModeID: '',
        accountTAN: '',

        cardindex: 0,

        iban: "ABC",
        value: 1.90,
        text: "ABC",
        name: "ABC"

    },
    formulas: {
        formtext: function(get){
            return  '<h2>Fin TS</h2>';
        },
        titletext: function(get){
            console.log('titletext',get('cardindex'))
            if (get('cardindex')!=0){
                return [
                    '<i class="fa-solid fa-money-check-dollar" style="font-size: 4rem;"></i>',
                    '<h3>Überweisen</h3>',
                    '<table>',
                        '<tr><td>An:</td>           <td>'+get('iban')+'</td> </tr> ',
                        '<tr><td>Empfänger:</td>    <td>'+get('name')+'</td> </tr> ',
                        '<tr><td>Zweck:</td>        <td>'+get('text')+'</td> </tr> ',
                        '<tr><td>Wert:</td>         <td style="font-weight: bold; font-size: 1.2em;">'+Ext.util.Format.currency( get('value'), '&euro;' ,2, true)+'</td> </tr> ',
                    '</table>'
                ].join('')
            }
            return [
                '<i class="fa-solid fa-money-check-dollar" style="font-size: 4rem;"></i>',
                '<h3>Überweisen</h3>'
            ].join('')
        }
    },
    stores: {
        bankkonten: {
            type: 'bankkonten_store',
            autoLoad: true
        },
        fints_accounts: {
            type: 'fints_accounts_store',
            autoLoad: true
        },
        tanmodes: {
            model: 'Tualo.FinTS.models.TanModes',
            data: [/* */],
            proxy: {
                type: 'memory',
                
            }
        }
    }
});