Ext.define('Tualo.FinTS.models.TanModes', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },{
            name: 'name',
            type: 'string'
        },{
            name: 'isDecoupled',
            type: 'boolean'
        },{
            name: 'needsTanMedium',
            type: 'boolean'
        }
    ]
});