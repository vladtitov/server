/**
 * Created by Vlad on 7/1/2017.
 */
var crypto = require('crypto');

var message = {

}
var sign = crypto
    .createHmac('sha512', 'apiSecret')
    .update(JSON.stringify(message))
    .digest('hex');
console.log(sign);