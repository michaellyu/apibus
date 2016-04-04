/*!
 * Api Bus for contact ajax requests
 *
 * Author: Michael LYU <michaellyu@outlook.com>
 *
 * Date: 2016-01-23
 *
 * Version: 1.0.0
 */
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
          return factory($);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function($, undefined) {
    'use strict';
    
    var isUndefined = function (value) {return typeof value === 'undefined';}
    var isObject = function (value){return value !== null && typeof value === 'object';};
    var isFunction = function isFunction(value) {return typeof value === 'function';};
    var isString = function isString(value) {return typeof value === 'string';}
    var isArray = Array.isArray;
    
    var getSeats = function (){
        var seats = [];
        for(var i = 0, len = bus.length; i < len; i++){
            seats[i] = {url: bus[i].url};
            isString(bus[i].method) && (seats[i].method = bus[i].method);
            isString(bus[i].params) && (seats[i].url + (bus[i].url.indexOf('?') === -1 ? '?' : '&') + bus[i].params);
            isObject(bus[i].params) && (seats[i].params = bus[i].params);
            isString(bus[i].body) && (seats[i].body = bus[i].body);
            isObject(bus[i].body) && (seats[i].body = $.param(bus[i].body));
        }
        return seats;
    };
    
    var bus = [],
        seat,
        xhr;
    
    var config = {
        way: '/apis/apibus', 
        name: 'apibus',
        autoClear: true
    };
    
    var apiBus = function(seats){
        if(isUndefined(seats)){
            return;
        }
        
        isArray(seats) || (seats = [seats]);
        
        for(var i = 0, len = seats.length; i < len; i++){
            if(isObject(seats[i]) && isString(seats[i].url)){
                seat = {};
                
                seat.url = seats[i].url;
                isString(seats[i].method) && (seat.method = seats[i].method);
                (isObject(seats[i].params) || isString(seats[i].params)) && (seat.params = isString(seats[i].params) ? seats[i].params : seats[i].params);
                isObject(seats[i].body) && (seat.body = seats[i].body);
                isFunction(seats[i].success) && (seat.success = seats[i].success);
                isFunction(seats[i].error) && (seat.error = seats[i].error);
                isFunction(seats[i].complete) && (seat.complete = seats[i].complete);
                
                bus.push(seat);
            }
        }
    };
    
    apiBus.config = function(options){
        if(isUndefined(options)){
            return config;
        }
        
        $.extend(config, options);
    };
    
    apiBus.add = function(seats){
        apiBus(seats);
    };
    
    apiBus.start = function(callback){
        if(bus.length === 0){
            return;
        }
        
        var data = {};
        data[config.name] = JSON.stringify(getSeats());
        xhr = $.post(config.way + (config.way.indexOf('?') === -1 ? '?' : '&') + '&bust=' + new Date().getTime(), data)
            .success(function(result){
                if(isArray(result)){
                    for(var i = 0, len = bus.length; i < len; i++){
                        if(isString(result[i]) && result[i] === 'error' && isFunction(bus[i].error)){
                            bus[i].error(result[i]);
                        }
                        else if(isFunction(bus[i].success)){
                            bus[i].success(result[i]);
                        }
                    }
                }
            })
            .error(function(){
                for(var i = 0, len = bus.length; i < len; i++){
                    if(isFunction(bus[i].error)){
                        bus[i].error.apply(this, arguments);
                    }
                }
            })
            .complete(function(result){
                for(var i = bus.length - 1; i >= 0; i--){
                    if(isFunction(bus[i].complete)){
                        bus[i].complete(result[i]);
                    }
                }
                
                if(config.autoClear){
                    apiBus.clear();
                }
                
                if(isFunction(callback)){
                    callback();
                }
            });
    };
    
    apiBus.stop = function(){
        if(xhr){
            xhr.abort();
        }
    };
    
    apiBus.clear = function(){
        bus.length = 0;
    };
    
    window.apiBus = $.apiBus = apiBus;
});