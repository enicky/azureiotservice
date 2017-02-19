// initializers/stuffInit.js
var Message = require('azure-iot-common').Message;
var iothub = require('azure-iothub');
var Client = require('azure-iothub').Client;

module.exports = {
    loadPriority: 1000,
    startPriority: 1000,
    stopPriority: 1000,
    initialize: function (api, next) {
        api.log('Start initialize initAzure');
        api.azureConnectionString = 'HostName=iot-nicky.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=hnH/C+uT0rxT4g+SBnsHkW5dLT390aZdRtbFr7L372M=';
        api.log('[initAzure] Using connectionString : ' + api.azureConnectionString, 'debug');
        api.azureClient = Client.fromConnectionString(api.azureConnectionString);
        api.log('[initAzure] Client Created, now creating a registry', 'debug');
        api.azureRegistry = iothub.Registry.fromConnectionString(api.azureConnectionString);
        api.log('[initAzure] Registry Created ... calling next', 'debug');
        api.log('Calling next => ', 'debug');
        next();
    },
    printResultFor: function (op) {
        return function printResult(err, res) {
            if (err) {
                console.log(op + ' error: ' + err.toString());
            } else {
                console.log(op + ' status: ' + res.constructor.name);
            }
        };
    },
    start: function (api, next) {
        // connect to server
        api.log('Listing Devices : ', 'debug');
        api.azureRegistry.list(function(err, deviceList){
             deviceList.forEach(function (device) {
                var key = device.authentication ? device.authentication.symmetricKey.primaryKey : '<no primary key>';
                api.log(device.deviceId + ': ' + key, 'debug');
            });
        });
        /*
        api.azureClient.open(function (err) {
            if (err) {
                api.log('Error opening connection to azure : ' + err, 'error');
                next();
            }
            var data = JSON.stringify({ text: 'foo' });
            var message = new Message(data);
            api.log('Sending message: ' + message.getData(), 'debug');
            api.azureClient.send(targetDevice, message, printResultFor('send'));

        });
        */
        next();
    },
    stop: function (api, next) {
        // disconnect from server
        next();
    }
}