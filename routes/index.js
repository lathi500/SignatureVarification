var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const { type } = require('express/lib/response');
const solc = require('solc');
Web3  = require('web3');
fs = require('fs');

web3 = new Web3( new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/generate-key', (req, res)  => {

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa',{
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

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign', (req, res)  => {
  let privateKey = req.body.privateKey;
    let data = req.body.data;
  

    privateKey = crypto.createPrivateKey({
      key: Buffer.from(privateKey, 'base64'),
      type: 'pkcs8',
      format: 'der',
    })

    const sign =  crypto.createSign('SHA256')
    sign.update(data),
    sign.end()

    const signature = sign.sign(privateKey).toString('base64')

    res.send({  signature });

 })

 router.post('/verify', (req, res)  => {
    let{ data, publicKey, signature } = req.body;


    publicKey = crypto.createPublicKey({
      key: Buffer.from(publicKey, 'base64'),
      type: 'pkcs8',
      format: 'der',
    })

    const verify = crypto.createVerify("SHA256")
    verify.update(data),
    verify.end()

    let result = verify.verify(publicKey, Buffer.from(signature, 'base64'));

    res.send( { ans: result });

 })



module.exports = router;
var input = {
  language: "Solidity",
  sources: {
    "contract/Signature_varification.sol": {
      content: file,
    },
  },
  
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
  
var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("Result : ", output);
  
ABI = output.contracts["contract/Signature_varification.sol"]["VarifySign"].abi;
bytecode = output.contracts["contract/Signature_varification.sol"]["VarifySign"].evm.bytecode.object;
console.log("Bytecode: ", bytecode);
console.log("ABI: ", ABI);