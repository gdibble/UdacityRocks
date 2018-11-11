/*global Web3*/
let web3;
if (typeof web3 != 'undefined') {
  web3 = new Web3(web3.currentProvider) // what Metamask injected
} else {
  // Instantiate and set Ganache as your provider
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

// The default (top) wallet account from a list of test accounts
web3.eth.defaultAccount = web3.eth.accounts[0];

// Grab the contract at specified deployed address with the interface defined by the ABI
const starNotary = StarNotary.at('0xf55923fca8ccf98218828aa173f3c4ad58e524c7');

// Internal helper
const _setContent = (text = '', id = 'response', method = 'textContent') => {
  document.getElementById(id)[method] = text;
};

// Get and display star name
starNotary.starName((error, result) => {
  if (error) {
    console.log(error);
  } else {
    _setContent(result, 'star-name');
  }
});

// Get and display star owner
starNotary.ownerOf(1, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    _setContent(result, 'star-owner');
  }
});

// Input value helper
const _getInputValue = (id) => {
  return id && document.getElementById(id).value || '';
};

// Unhide result container
const _unhideResult = () => {
  document.getElementById('response-container').className = 'row';
};


const createButtonClicked = () => {
  _setContent('Result of createStar: ');

  const name = _getInputValue('idStarName');
  const mag = _getInputValue('idStarMag');
  const dec = _getInputValue('idStarDec');
  const ra = _getInputValue('createStarRA');
  const story = _getInputValue('idStarStory');

  web3.eth.getAccounts((error) => {
    if (error) {
      _unhideResult();
      _setContent(JSON.stringify(error));
      return;
    }
    // const createStarEvent = starNotary.createStar(name, dec, mag, ra, story);
    // createStarEvent.watch((error, result) => {
    starNotary.createStar(name, dec, mag, ra, story, (error, result) => {
      _unhideResult();
      const resp = error && JSON.stringify(error) || result;
      if (!error && result)
        _setContent(`<a href="https://rinkeby.etherscan.io/tx/${resp}" target="Etherscan">${resp}</a>`, void(0), 'innerHTML');  // Transaction Information and hyperlink
      else
        _setContent(resp);  // Show error
    });
  });
};
this.createButtonClicked = createButtonClicked;

const lookupButtonClicked = () => {
  const id = _getInputValue('idTokenId');
  web3.eth.getAccounts((error, accounts) => {
    if (error) {
      _unhideResult();
      _setContent(JSON.stringify(error));
      return;
    }
    // const tokenIdToStarInfoEvent = starNotary.tokenIdToStarInfo(id || accounts[0]);
    // tokenIdToStarInfoEvent.watch((error, result) => {
    starNotary.tokenIdToStarInfo(id || accounts[0], (error, result) => {
      _unhideResult();
      _setContent(JSON.stringify(error || result));
    });
  });
};
this.lookupButtonClicked = lookupButtonClicked;


const claimButtonClicked = () => {
  const id = _getInputValue('buyStarId');
  const value = _getInputValue('buyStarPrice');
  web3.eth.getAccounts((error, accounts) => {
    if (error) {
      _unhideResult();
      _setContent(JSON.stringify(error));
      return;
    }
    // const buyStarEvent = starNotary.buyStar(id || accounts[0], { value:value });
    // buyStarEvent.watch((error, result) => {
    starNotary.buyStar(id || accounts[0], { value:value }, (error, result) => {
      _unhideResult();
      _setContent(JSON.stringify(error || result));
    });
  });
};
this.claimButtonClicked = claimButtonClicked;

