
const serverUrl = "https://eiddjtrvs07p.usemoralis.com:2053/server";
const appId = "zmRH6EKqvi7qsnQrxqValkM4vSVMaIAZplqSt9fd";

const DECIMALS = 9;
const contractAddress = "0x78618c5114Cf2B71A3fe0Af9d7c5aEb129E90487";
const pairAddress = "0x30D85Bb8b68B3425F7f3433fc2b1596CA873da89";

var userAddress; 
var ethers; 
var mainContract; 

Moralis.start({ serverUrl, appId });

function linkButtons() {
    document.getElementById("walletCircle").onclick = loginManual;
    document.getElementById("copyToken").onclick = copyToken;
    document.getElementById("copyPair").onclick = copyPair;

    document.getElementById("btn_mint").onclick = goToMint;
	document.getElementById("btn_chart").onclick = goToChart;

	document.getElementById("btn_stake").onclick = enterStaking;
	document.getElementById("btn_menu").onclick = enterHomepage;
	//document.getElementById("stakeRewardsButton").onclick = stakeRewardsButton; 
}

function copyToken() {
    document.getElementById("tokenClipboard").style = "visibility: hidden";
    document.getElementById("tokenTick").style = "visibility: visible";

    setTimeout(function(){ 
        document.getElementById("virusClipboard").style = "visibility: visible";
        document.getElementById("virusTick").style = "visibility: hidden";
     }, 500);
     navigator.clipboard.writeText(contractAddress);
}

function copyPair() {
    document.getElementById("pairClipboard").style = "visibility: hidden";
    document.getElementById("pairTick").style = "visibility: visible";

    setTimeout(function(){ 
        document.getElementById("pairClipboard").style = "visibility: visible";
        document.getElementById("pairTick").style = "visibility: hidden";
     }, 500);
     navigator.clipboard.writeText(pairAddress);
}

function goToMint() {
    window.open(
        "https://avoges.netlify.app", "_blank");
}
function goToChart() {
	window.open(
		"https://dexscreener.com/avalanche/0x779595F212B53e4f1F51b0875405Bf21B5e4D805", "_blank");
}


function beautifyAddress(address, first) {
    return address.slice(0, first)+"..."+address.slice(-3);
}

function updateUserAddress(ethAddress) {
    userAddress = ethAddress;
    document.getElementById("usersWallet").innerHTML = beautifyAddress(ethAddress,5);
	document.getElementById("walletImage").src = "assets/wallets_connected.png"; 
   // beautifyAddress(ethAddress,5);
}

async function loginManual() {
   await logOut();
   await login();
}

async function login() {
    provider = await Moralis.enableWeb3();
    ethers = Moralis.web3Library; 

    const newChainId = "0xa86a"; //AVAX Mainnet
    await Moralis.switchNetwork(newChainId); 
    
   let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.Web3.authenticate({signingMessage: "Requesting permission to read account balances"});
    }
    updateUserAddress(user.attributes.ethAddress);
    getStats();
}

  async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
  }
 
async function getStats() {
    var contract = await new ethers.Contract(contractAddress, abi, provider);
    let tokenBalance = await contract.balanceOf(userAddress);
    updateTokenBalance(tokenBalance);
    let isReferred = (tokenBalance != "0")
    if(isReferred) {
        let referrer = await contract.referrer(userAddress);
        updateReferrer(referrer);
    }

    let numReferrals = await getNumReferrals();
    updateNumReferrals(numReferrals);
    console.log("Contract address "+contract.address);    
    await getRewards();
    constructReferredTable();
//	getReferralLeaderboard();

}

async function getRewards() {
    const Reffered = Moralis.Object.extend("ReferralBonus");
    const query = new Moralis.Query(Reffered);
    query.equalTo("feesTo",userAddress);
    const results = await query.find();
    referredInfoPresentable = [];
    var sum = 0;
    for(i in results) {
        let attributes = results[i]["attributes"];
        /*console.log("from: "+attributes["feesFrom"]);
        console.log("value: "+attributes["value"]);
        console.log("tx hash: "+attributes["transaction_hash"]);*/
        
        //todo: get the quantity from the event directly 
        value = parseInt(attributes["value"])/(10**DECIMALS)
        sum+=value;
        referredInfoPresentable.push([
            attributes["feesFrom"],
            beautifyAddress(attributes["feesFrom"],5),
            value*20, 
            value,
            attributes["transaction_hash"]
        ])
    }
    updateRewards(sum);
}


async function getTokenBalance() {
    const options = { chain: 'bsc', address: "0x78618c5114Cf2B71A3fe0Af9d7c5aEb129E90487"}
    const balances = await Moralis.Web3API.account.getTokenBalances(options);
}

function enterStaking() {
	document.getElementById("homepage").style = "display: none;"
	document.getElementById("staking").style = "display: block;"
	document.getElementById("btn_menu").className =  "menuButton menuButton_clickable";
//	document.getElementById("btn_stake").style = "background-color: var(--orange)"
	document.getElementById("btn_stake").className = "menuButton menuButton_selected";
	stakingBackend(); 
}

function enterHomepage() {
	document.getElementById("homepage").style = "display: block;"
	document.getElementById("staking").style = "display: none;"
	//document.getElementById("btn_stake").style = "background-color: transparent"
	document.getElementById("btn_stake").className = "menuButton menuButton_clickable";
	document.getElementById("btn_menu").className = "menuButton menuButton_selected";
	login(); 
}


linkButtons();
enterHomepage();


const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountBNB",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountBOG",
				"type": "uint256"
			}
		],
		"name": "AutoLiquify",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "feesTo",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "feesFrom",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "ReferralBonus",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "referred",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			}
		],
		"name": "Referred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "_maxWalletSize",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_minTransferForReferral",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "holder",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "approveMax",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "adr",
				"type": "address"
			}
		],
		"name": "authorize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCirculatingSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "accuracy",
				"type": "uint256"
			}
		],
		"name": "getLiquidityBacking",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "adr",
				"type": "address"
			}
		],
		"name": "isAuthorized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "target",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "accuracy",
				"type": "uint256"
			}
		],
		"name": "isOverLiquified",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isReferred",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manualSend",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "minSupplyForReferralReward",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pair",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "referrer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "router",
		"outputs": [
			{
				"internalType": "contract IDEXRouter",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_marketingFeeReceiver",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_devFeeReceiver",
				"type": "address"
			}
		],
		"name": "setFeeReceiver",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_liquidityFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_devFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_marketingFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_feeDenominator",
				"type": "uint256"
			}
		],
		"name": "setFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "holder",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exempt",
				"type": "bool"
			}
		],
		"name": "setIsFeeExempt",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "setMaxWallet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "setMinTransferForReferral",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "setMinimumBalanceForReferral",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			}
		],
		"name": "setReferralFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_enabled",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "setSwapBackSettings",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapEnabled",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapThreshold",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"name": "transferForeignToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "adr",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "adr",
				"type": "address"
			}
		],
		"name": "unauthorize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]
