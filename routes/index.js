var express = require('express');
var router = express.Router();
const crypto = require('crypto');
Web3 = require('web3');
fs = require('fs');
const Provider = require('@truffle/hdwallet-provider');

web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
var SmartContractAddress = "0xfb444d53612a7d1ae4b1ed66aea5ea818003bac2";
var contract_abi = require('./abi.json');
var SmartContractABI = contract_abi;
var address = "0x33c1d0fe689589cddbafc68a53afdec0cfa52f9a"
var privatekey = "fc1a82dd3fcbe4d94d1da4145f47896e756abbe004dd40ee72caf8c9ee29b78d";
var rpcurl = "https://ropsten.infura.io/v3/061c56b4611d495186f1b65c7ef5e37c";


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/generate-key', (req, res) => {

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'der',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'der',
    },

  })

  res.send({ publicKey: publicKey.toString('base64'), privateKey: privateKey.toString('base64') });

});

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign', (req, res) => {
  let privateKey = req.body.privateKey;
  let data = req.body.data;


  privateKey = crypto.createPrivateKey({
    key: Buffer.from(privateKey, 'base64'),
    type: 'pkcs8',
    format: 'der',
  })

  const sign = crypto.createSign('SHA256')
  sign.update(data),
    sign.end()

  const signature = sign.sign(privateKey).toString('base64')

  res.send({ signature });

})

module.exports = router;

router.post('/verify', (req, res) => {
  let { data, publicKey, signature } = req.body;
  var provider = new Provider(privatekey, rpcurl);
  var web3 = new Web3(provider);
  var myContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);

  publicKey = crypto.createPublicKey({
    key: Buffer.from(publicKey, 'base64'),
    type: 'pkcs8',
    format: 'der',
  })

  let result = myContract.methods.verify(publicKey, data, signature).send({ from: address });
  
  res.send({ ans: result });
})

console.log('Hello')

// const sendData = async () => {

//   var provider = new Provider(privatekey, rpcurl);
//   var web3 = new Web3(provider);
//   var myContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);
//   var oldvalue = await myContract.methods.retrieve().call();
//   console.log("oldvalue", oldvalue);


//   var receipt = await myContract.methods.store(5782).send({ from: address });
//   console.log(receipt);

//   var newvalue = await myContract.methods.retrieve().call();
//   console.log("newvalue", newvalue);

//   console.log("done with all things");

// }

// sendData();


