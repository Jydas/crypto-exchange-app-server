const axios = require('axios');
const BigNumber = require('bignumber.js');

//get the list of tokens ready to swap

async function tokenList(blockchain) {
  let chain = 'eth';

  switch (blockchain) {
    case 'eth': {
      chain = '1';
      break;
    }
    case 'bsc': {
      chain = '56';
      break;
    }
    case 'polygon': {
      chain = '137';
      break;
    }
    case 'avalanche': {
      chain = '43114';
      break;
    }
    case 'optimism': {
      chain = '10';
      break;
    }
    case 'arbitrum': {
      chain = '42161';
      break;
    }
    case 'gnosis': {
      chain = '100';
      break;
    }
    default: {
      chain = 'eth';
    }
  }
  try {
    const response = await axios.get(`https://api.1inch.io/v4.0/${chain}/tokens`);
    if (response.data) return response.data;
    else return null;
  } catch (err) {
    throw Error(err);
  }
}

//get the rate for the amount of input token
async function expectedRate(blockchain, fromTokenAddress, toTokenAddress, amount) {
  let chain = 'eth';

  switch (blockchain) {
    case 'eth': {
      chain = '1';
      break;
    }
    case 'bsc': {
      chain = '56';
      break;
    }
    case 'polygon': {
      chain = '137';
      break;
    }
    case 'avalanche': {
      chain = '43114';
      break;
    }
    case 'optimism': {
      chain = '10';
      break;
    }
    case 'arbitrum': {
      chain = '42161';
      break;
    }
    case 'gnosis': {
      chain = '100';
      break;
    }
    default: {
      chain = 'eth';
    }
  }
  try {
    const response = await axios.get(`https://api.1inch.io/v4.0/${chain}/quote?`, {
      params: {
        amount,
        fromTokenAddress,
        toTokenAddress,
      },
    });
    if (response.data) {
      return response.data;
    } else return null;
  } catch (err) {
    throw Error(err);
  }
}
//generating the approval transaction data
async function approve(blockchain, tokenAddress, amount) {
  let chain = 'eth';

  switch (blockchain) {
    case 'eth': {
      chain = '1';
      break;
    }
    case 'bsc': {
      chain = '56';
      break;
    }
    case 'polygon': {
      chain = '137';
      break;
    }
    case 'avalanche': {
      chain = '43114';
      break;
    }
    case 'optimism': {
      chain = '10';
      break;
    }
    case 'arbitrum': {
      chain = '42161';
      break;
    }
    case 'gnosis': {
      chain = '100';
      break;
    }
    default: {
      chain = 'eth';
    }
  }
  try {
    const response = await axios.get(`https://api.1inch.io/v4.0/${chain}/approve/transaction?`, {
      params: {
        tokenAddress,
        amount,
      },
    });
    if (response.data) {
      return response.data;
    } else return null;
  } catch (err) {
    throw Error(err);
  }
}

//function to build the transaction details for the swap
async function swap(
  blockchain,
  walletAddress,
  fromTokenAddress,
  toTokenAddress,
  amountTrade,
  slippage,
  gasLimit,
  gasPrice
) {
  let chain = 'eth';
  switch (blockchain) {
    case 'eth': {
      chain = '1';
      break;
    }
    case 'bsc': {
      chain = '56';
      break;
    }
    case 'polygon': {
      chain = '137';
      break;
    }
    case 'avalanche': {
      chain = '43114';
      break;
    }
    case 'optimism': {
      chain = '10';
      break;
    }
    case 'arbitrum': {
      chain = '42161';
      break;
    }
    case 'gnosis': {
      chain = '100';
      break;
    }
    default:
      chain = 'eth';
  }
  try {
    const response = await axios.get(`https://api.1inch.io/v4.0/${chain}/swap?`, {
      params: {
        amount: amountTrade,
        fromTokenAddress: fromTokenAddress,
        toTokenAddress: toTokenAddress,
        fromAddress: walletAddress,
        slippage: slippage,
        referrerAddress: process.env.ADDRESS,
        fee: 0.25,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        disableEstimate: true,
        allowPartialFill: false,
      },
    });
    if (response.data) {
      dataTx = response.data.tx;
      return dataTx;
    }
  } catch (err) {
    throw Error(err);
  }
}

//helpers functions to work with bignumbers
function castBN(x) {
  if (x instanceof BigNumber) {
    return x;
  }
  return new BigNumber(x);
}
function shiftedBy(x, y) {
  x = castBN(x);
  return x.shiftedBy(y);
}

function roundDownBN(x, y) {
  x = castBN(x);
  return x.toFixed(y, 1);
}

function fromDecimals(num, decimals) {
  let newNumber = shiftedBy(num, decimals * -1);
  newNumber = roundDownBN(newNumber, 2);
  return newNumber;
}
function toDecimals(num, decimals) {
  let newNumber = shiftedBy(num, decimals);
  return newNumber;
}

module.exports = {
  tokenList,
  expectedRate,
  fromDecimals,
  swap,
  approve,
};
