/* date interceptor */

angular.module('mv').service('DateInterceptor', function() {

    var toDate = function(d) {
        var ms, match = d.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})$/);

        if (typeof d === "string" && match && !isNaN(Date.parse(match[0])))
            return new Date(Date.parse(match[0]));

        return undefined;
    };

    var toISO = function(d) {
        if (!(d instanceof Date))
            return undefined;

        return (d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+(d.getDate())).slice(-2)+'T'+
            ('0'+(d.getHours())).slice(-2)+':'+('0'+(d.getMinutes())).slice(-2)+':'+('0'+(d.getSeconds())).slice(-2)+
            (d.getTimezoneOffset()<0?'+':'-')+('0'+(Math.abs(d.getTimezoneOffset())/60)).slice(-2)+':00');
    };

    var traverse = function(data, closure) {
        if (typeof data !== "object") 
            return data;

        for (var key in data) {
            if (!data.hasOwnProperty(key))
                continue;

            var value = closure(data[key]);

            if (typeof value !== 'undefined')
                data[key] = value;
            else if (typeof value === "object")
                traverse(value, closure);
        }
    };

    this.response = function(response) {
        traverse(response.data, toDate);
        return response;
    };

    this.request = function(request) {
        traverse(request.data, toISO);
        return request;
    };
});
