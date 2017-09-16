/**
 * Created by Vlad on 7/1/2017.
 */
var Changelly = require('../libs/changelly');

var changelly = new Changelly(
    '23c7a086c98b4f07963208522a42cda0',
    'c1fe7209b388e0792883a1b3f0c3a6a27d9bb0476f39ca6d8a4329f97084e7dc'
);

changelly.getCurrencies(function(err, data) {
    if (err){
        console.log('Error!', err);
    } else {
        console.log('getCurrencies', data);
    }
});

changelly.generateAddress('eth', 'btc', '1PKYrd9CC4RFB65wBrvaAsTWnp8fXePuj', undefined, function(err, data) {
    if (err){
        console.log('Error!', err);
    } else {
        console.log('generateAddress', data);
    }
});

changelly.getMinAmount('eth', 'btc', function(err, data) {
    if (err){
        console.log('Error!', err);
    } else {
        console.log('getMinAmount', data);
    }
});

changelly.getExchangeAmount('btc', 'eth', 1, function(err, data) {
    if (err){
        console.log('Error!', err);
    } else {
        console.log('getExchangeAmount', data);
    }
});

changelly.getTransactions(10, 0, 'btc', undefined, undefined, function(err, data) {
    if (err){
        console.log('Error!', err);
    } else {
        console.log('getTransactions', data);
    }
});

changelly.getStatus('1gy2g76', function(err, data) {
    if (err){
        console.log('Error!', err);
    } else {
        console.log('getStatus', data);
    }
});

changelly.on('payin', function(data) {
    console.log('payin', data);
});

changelly.on('payout', function(data) {
    console.log('payout', data);
});