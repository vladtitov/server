/**
 * Created by Vlad on 2017-03-30.
 */
//var RpcClient = require('bitcoind-rpc');
var RpcClient = require('../../../../Desktop/rpc-node');
var _ = require('lodash');

var settings  = require('../../../../Desktop/settings');

var rpcs = {};
for(var str in settings) rpcs[str] = new  RpcClient(settings[str]);
//var rpc = new RpcClient(options);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

app.get('/open-rpc/coma/:name/:method/:pars', function (req, respond) {

    sendRPCRequest(req.params.name, req.params.method,req.params.pars.split(','), function (err, res) {
        respond.send({err:err, data:res});
    })
});

app.get('/open-rpc/:name/:method', function (req, respond) {

    var method = req.params.method;
    var name = req.params.name;
   // console.log(RpcClient.callspec);

   if(!_.has(RpcClient.callspec, method)){
        respond.send({method:method,spec:RpcClient.callspec});
        return
    }

    if(!rpcs[name]){
        respond.send({err:'error'});
        return
    }

    rpcs[name].rpc(
        {
            method: method.toLowerCase(),
            id: parseInt(Math.random() * 100000)
        },
        function (err, res) {
            respond.send({err: err, data: res});
        }
    );
});

app.get('/open-rpc/:name/:method/:par1', function (req, respond) {

    sendRPCRequest(req.params.name, req.params.method,[req.params.par1], function (err, res) {
        respond.send({err:err, data:res});
    })


});

app.get('/open-rpc/:name/:method/:par1/:par2', function (req, respond) {

    sendRPCRequest(req.params.name, req.params.method,[req.params.par1,req.params.par2], function (err,res) {
        respond.send({err:err, data:res});
    })

});



function sendRPCRequest(name, method, pars, callBack){

    if(!_.has(RpcClient.callspec, method)){
        callBack({err:method, data:RpcClient.callspec});
        return
    }

    var params = pars.map(function (item) {
        return isNaN(item)?item:+item;
    });

  //  console.log(params);

    rpcs[name].rpc(
        {
            method: method.toLowerCase(),
            params:params,
            id: parseInt(Math.random() * 100000)
        }, callBack
    );
}



var port = 8090;
app.listen(port, function () {
    console.log('Example app listening on port ' + port)
});

