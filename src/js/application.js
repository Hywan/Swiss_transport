const CONNECTIONS_URI  = 'http://transport.opendata.ch/v1/connections?';
const STATIONBOARD_URI = 'http://transport.opendata.ch/v1/stationboard?';

var model = {
    view: {
        menuHidden  : true,
        connections : true,
        details     : false,
        stationBoard: false
    },
    loading: {
        connections: false,
        station    : false
    },
    connections: [],
    connection: null,
    station: null
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

Vue.filter('hour-minute', function(date) {
    return moment(date).format('HH:mm');
});

Vue.filter('duration', function(date1, date2) {
    return moment.utc(moment(date2).diff(moment(date1))).format('H[h]mm')
});

Vue.filter('shift', function(array) {
    return array.filter(
        function (item, key) {
            return 0 !== key;
        }
    );
});

Vue.filter('pop', function(array) {
    var last = array.length - 1;

    return array.filter(
        function (item, key) {
            return last !== key;
        }
    );
});

window.addEventListener(
    'load',
    function () {
        console.log('Ready!');
        var demo = new Vue({
            el: '[role="application"]',
            data: model,
            methods: {
                requestOpenMenu: function () {
                    model.view.menuHidden = false;
                },
                requestCloseMenu: function (callback) {
                    model.view.menuHidden = true;

                    if (undefined !== callback) {
                        this[callback]();
                    }
                },
                requestSearchConnections: function () {
                    console.log('Start searching connections…');
                    model.connections         = [];
                    model.loading.connections = true;

                    var httpRequest    = new XMLHttpRequest();
                    httpRequest.onload = function () {
                        model.loading.connections = false;

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
                },
                requestConnections: function () {
                    model.view.connections  = true;
                    model.view.details      = false;
                    model.view.stationBoard = false;
                    window.setTimeout(
                        function () {
                            model.connection = null;
                        },
                        500
                    );
                },
                requestDetails: function (e) {
                    model.connection = {
                        from    : e.targetVM.from,
                        to      : e.targetVM.to,
                        sections: e.targetVM.sections
                    };
                    model.view.details     = true;
                },
                requestStationBoard: function () {
                    model.view.connections  = false;
                    model.view.details      = false;
                    model.view.stationBoard = true;
                },
                requestSearchStation: function () {
                    console.log('Start searching station…');
                    model.station         = [];
                    model.loading.station = true;

                    var httpRequest    = new XMLHttpRequest();
                    httpRequest.onload = function () {
                        model.loading.station = false;

                        console.log(JSON.parse(this.responseText));
                        model.station = JSON.parse(this.responseText).stationboard;
                    };
                    httpRequest.open(
                        'GET',
                        STATIONBOARD_URI +
                        'station=' + $('#station').value +
                        '&limit=10',
                        true
                    );
                    httpRequest.send();
                },
            }
        });
    }
);
