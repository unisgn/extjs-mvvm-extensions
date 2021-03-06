﻿/* global Ext */

/**
 * This override allows binding to the component's own properties. 
 * These properties should be declared in the 'publishes' config.
 */
Ext.define('Ext.vmx.mixin.Bindable', {
    initBindable: function () {
        var me = this;
        Ext.mixin.Bindable.prototype.initBindable.apply(me, arguments);
        me.publishInitialState();
    },

    /**
    Notifying both own and parent ViewModels about the state changes
    */
    publishState: function (property, value) {
        var me = this,
            vm = me.lookupViewModel(),
            parentVm = me.lookupViewModel(true),
            path = me.viewModelKey;

        if (path && property && parentVm) {
            path += '.' + property;
            parentVm.set(path, value);
        }

        Ext.mixin.Bindable.prototype.publishState.apply(me, arguments);

        if (property && vm && vm.getView() == me) {
            vm.set(property, value);
        }
    },

    /**
    Publish the initial state
    */
    publishInitialState: function () {
        var me = this,
            state = me.publishedState || (me.publishedState = {}),
            publishes = me.getPublishes(),
            name;

        for (name in publishes) {
            if (state[name] === undefined) {
                me.publishState(name, me[name]);
            }
        }
    }
}, function () {
    Ext.Array.each([Ext.Component, Ext.Widget], function (Class) {
        Class.prototype.initBindable = Ext.vmx.mixin.Bindable.prototype.initBindable;
        Class.prototype.publishState = Ext.vmx.mixin.Bindable.prototype.publishState;
        Class.mixin([Ext.vmx.mixin.Bindable]);
    });
});