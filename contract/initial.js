solc = require("solc");

fs = require("fs");

Web3 = require("web3");

web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

file = fs.readFileSync("varification.sol").toString();

var input = {
	language: "Solidity",
	sources: {
	"varification.sol": {
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
	
ABI = output.contracts["varification.sol"]["varifysign"].abi;
bytecode = output.contracts["varification.sol"]["varifysign"].evm.bytecode.object;
    // console.log("Bytecode: ", bytecode);
    // console.log("ABI: ", ABI);

contract = new web3.eth.Contract(ABI);
web3.eth.getAccounts().then((accounts) => {
    console.log("Accounts:", accounts);
  
    mainAccount = accounts[0];
  
    console.log("Default Account:", mainAccount);
    contract
        .deploy({ data: bytecode })
        .send({ from: mainAccount, gas: 650000 })
        .on("receipt", (receipt) => {
  
            console.log("Contract Address:", receipt.contractAddress);
        })
        // .then((initialContract) => {
        //     initialContract.methods.message().call((err, data) => {
        //         console.log("Initial Data:", data);
        //     });
        // });
});

reply = contract.called.call(function(error,result){
    if(error){
        console.log("Error");
        throw error;
    }else{
        return result;
    }
});
console.log(reply);
