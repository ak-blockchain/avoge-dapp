
const serverUrl = "https://if32pxbtefqb.usemoralis.com:2053/server"
const appId = "KcSdbvNBRf8rLGLAVfLRoD19yyThOZpOdndr997D";

const DECIMALS = 9;
const contractAddress = "0x5601c18eaab27de606d756609bf54e9f84a5df91";
const pairAddress = "0x1EBB75BbA8C0E9c8D36744Ab77b2c7b877b47Cfa";

var userAddress; 
var ethers; 
var mainContract; 

Moralis.start({ serverUrl, appId });

function linkButtons() {
    document.getElementById("walletCircle").onclick = loginManual;
    document.getElementById("copyToken").onclick = copyToken;
    document.getElementById("copyPair").onclick = copyPair;

	document.getElementById("btn_chart").onclick = goToChart;
    document.getElementById("btn_website").onclick = goToWebsite;

	document.getElementById("btn_menu").onclick = enterHomepage;
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

function goToChart() {
	window.open(
		"https://dexscreener.com/bsc/0x1EBB75BbA8C0E9c8D36744Ab77b2c7b877b47Cfa", "_blank");
}
function goToWebsite() {
    window.open(
		"https://memenunity.com/#", "_blank");
}


function beautifyAddress(address, first) {
    return address.slice(0, first)+"..."+address.slice(-3);
}

function updateUserAddress(ethAddress) {
    userAddress = ethAddress;
    document.getElementById("usersWallet").innerHTML = beautifyAddress(ethAddress,5);
	document.getElementById("walletImage").src = "assets/wallet_connected.png"; 
   // beautifyAddress(ethAddress,5);
}

async function loginManual() {
   await logOut();
   await login();
}

async function login() {
    provider = await Moralis.enableWeb3();
    ethers = Moralis.web3Library; 

    const newChainId = "0x38"; //BSC Mainnet
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

	let circulatingSupply = 1000000000000;

    const priceOptions = {
		address: contractAddress,
		chain: "bsc",
		exchange: "PancakeSwapv2",
	  };
    const price = await Moralis.Web3API.token.getTokenPrice(priceOptions);
	var priceString = (""+price.usdPrice).slice(0,10); 

	let userBalance = await contract.balanceOf(userAddress)/(10**DECIMALS); 

	let marketCap = (circulatingSupply*price.usdPrice);
	let marketCapString = ""+ marketCap.toFixed(0).slice(0,10); 

	document.getElementById("marketcapStat").innerHTML = "$"+marketCapString;
	document.getElementById("priceStat").innerHTML = "$"+priceString;
	document.getElementById("balanceStat").innerHTML = userBalance

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
	document.getElementById("btn_menu").className = "menuButton menuButton_selected";
	login(); 
}


linkButtons();
enterHomepage();

const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amountBNB","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountBOG","type":"uint256"}],"name":"AutoLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxWalletSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"approveMax","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"authorize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"_value","type":"bool"}],"name":"blacklistAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"accuracy","type":"uint256"}],"name":"getLiquidityBacking","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"selling","type":"bool"}],"name":"getTotalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"isAuthorized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isBlacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"target","type":"uint256"},{"internalType":"uint256","name":"accuracy","type":"uint256"}],"name":"isOverLiquified","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchedAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"manualSend","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"contract IDEXRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_marketingFeeReceiver","type":"address"},{"internalType":"address","name":"_teamFeeReceiver","type":"address"}],"name":"setFeeReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_liquidityFee","type":"uint256"},{"internalType":"uint256","name":"_teamFee","type":"uint256"},{"internalType":"uint256","name":"_marketingFee","type":"uint256"},{"internalType":"uint256","name":"_feeDenominator","type":"uint256"}],"name":"setFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsFeeExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsTxLimitExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setMaxWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setSwapBackSettings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setTxLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"transferForeignToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"adr","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"unauthorize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
