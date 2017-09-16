"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const api_1 = require("./api/api");
const apiErrorHandler_1 = require("./utils/apiErrorHandler");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const apiLogin_1 = require("./api/apiLogin");
const changelly_api_1 = require("./api/changelly-api");
const shapeshift_api_1 = require("./api/shapeshift-api");
const api_ether_1 = require("./api/api-ether");
const api_save_1 = require("./utils/api-save");
const bittrex_1 = require("./api/bittrex");
const api_send_notification_1 = require("./api/api-send-notification");
const coin_market_cap_1 = require("./api/coin-market-cap");
const poloniex_1 = require("./api/poloniex");
const coinbase_1 = require("./api/coinbase");
const hit_btc_1 = require("./api/hit-btc");
const yo_bit_1 = require("./api/yo-bit");
const coin_exchange_1 = require("./api/coin-exchange");
const kraken_1 = require("./api/kraken");
const bitfinex_1 = require("./api/bitfinex");
const novaexchange_1 = require("./api/novaexchange");
const cryptopia_1 = require("./api/cryptopia");
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
let apis = [];
app.get('/index', function (req, res) {
    let p = path.join(__dirname, '../pub', 'index.html');
    console.log(p);
    res.sendFile(p);
});
app.use(express.static(path.join(__dirname, '../pub')));
app.get('/apis-info', function (req, resp) {
    resp.json({
        title: 'APIS Available',
        timestamp: (new Date()).toISOString(),
        data: apis
    });
});
apiLogin_1.initLogin(app);
api_send_notification_1.apiSendNotification(app);
api_1.initRestApi(app);
api_ether_1.initEther(app);
api_save_1.apiSave(app);
apis = apis.concat(changelly_api_1.initChangelly(app));
apis = apis.concat(shapeshift_api_1.initShapeSift(app));
apis = apis.concat(bittrex_1.initBittrex(app));
apis = apis.concat(coin_market_cap_1.coinMarketCap(app));
apis = apis.concat(poloniex_1.initPoloniex(app));
apis = apis.concat(coinbase_1.initCoinbase(app));
apis = apis.concat(hit_btc_1.initHitBTC(app));
apis = apis.concat(yo_bit_1.initYoBit(app));
apis = apis.concat(coin_exchange_1.initCoinExchange(app));
apis = apis.concat(kraken_1.initKraken(app));
apis = apis.concat(bitfinex_1.initBitFinrx(app));
apis = apis.concat(novaexchange_1.initNovoExchange(app));
apis = apis.concat(cryptopia_1.initCryptopia(app));
app.use(apiErrorHandler_1.apiErrorHandler);
app.listen(app.get('port'), () => {
    console.log("Server now running on port " + app.get('port'));
});
