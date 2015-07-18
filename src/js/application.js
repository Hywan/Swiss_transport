const CONNECTIONS_URI = 'http://transport.opendata.ch/v1/connections?';

var model = {
    connections: []
};

function $(selector) {
    return document.querySelector(selector);
}


Vue.filter('date-calendar', function(date) {
    var today = moment();
    var _date = moment(date);

    if (0 === today.diff(_date, 'days')) {
        return _date.format('HH:mm');
    }

    return _date.calendar();
});

Vue.filter('duration', function(date1, date2) {
    return moment.utc(moment(date2).diff(moment(date1))).format('HH:mm')
});

function Connection(from, to) {
    this.from         = from;
    this.to           = to;
    this.__iterator__ = null;

    var httpRequest    = new XMLHttpRequest();
    httpRequest.onload = function () {
        console.log(JSON.parse(this.responseText));
        model.connections = JSON.parse(this.responseText).connections;
    };
    httpRequest.open(
        'GET',
        CONNECTIONS_URI +
        'from=' + $('#from').value +
        '&to=' + $('#to').value,
        true
    );
    httpRequest.send();
}

window.addEventListener(
    'load',
    function () {
        console.log('Ready!');
        var demo = new Vue({
            el: '[role="application"]',
            data: model,
            methods: {
                search: function () {
                    console.log('Start searching…');
                    new Connection('Yverdon-les-Bains', 'Lausanne');
                }
            }
        });
    }
);
