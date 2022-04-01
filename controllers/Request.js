const { tokenList, expectedRate, approve, swap, fromDecimals } = require('../utils');

//get the list of tokens supported for swap
const getTokensList = async (req, res) => {
  if (!req?.params?.blockchainId)
    return res.status(400).json({ message: 'Please send the blockchain id' });
  const blockchain = req.params.blockchainId;
  const data = await tokenList(blockchain);
  if (!data)
    return res.status(500).json({ message: 'Server error, please send the information again' });
  return res.status(200).json(data);
};

//get the rate for the requested amount of tokens
const getRate = async (req, res) => {
  if (!req?.params?.blockchainId)
    return res.status(400).json({ message: 'Please provide the blockchain id' });
  const blockchain = req.params.blockchainId;
  if (!req?.query) return res.status(400).json({ message: 'Please send the required information' });

  if (!req?.query.fromTokenAddress || !req?.query.toTokenAddress || !req?.query.amount)
    return res.status(400).json({
      message: 'The fields blockchain, fromTokenAddress, toTokenAddress, amount are required',
    });

  const fromTokenAddress = req.query.fromTokenAddress;
  const toTokenAddress = req.query.toTokenAddress;
  const amount = req.query.amount;

  try {
    const data = await expectedRate(blockchain, fromTokenAddress, toTokenAddress, amount);
    if (!data) return res.status(500).json({ message: 'Server error... Please reload again' });

    const { fromToken, toToken, toTokenAmount, fromTokenAmount, protocols, estimatedGas } = data;

    //updating the destination token object
    const { address, decimals, symbol, name, logoURI } = toToken;
    const newToToken = {
      address,
      decimals,
      symbol,
      name,
      logoURI,
    };
    const newData = {
      fromToken: fromToken,
      toToken: newToToken,
      expectedAmount: fromDecimals(toTokenAmount, newToToken.decimals),
      expectedAmountInWei: toTokenAmount,
      fromTokenAmount: fromDecimals(fromTokenAmount, fromToken.decimals),
      fromTokenAmountInWei: fromTokenAmount,
      exchangesList: protocols[0],
      estimatedGas: estimatedGas,
    };
    return res.status(200).json(newData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
//get the approval object ...ready to send the approve transaction
const getApproval = async (req, res) => {
  if (!req?.params?.blockchainId)
    return res.status(400).json({ message: 'Please provide the blockchain id' });
  const blockchain = req.params.blockchainId;

  if (!req?.query) return res.status(400).json({ message: 'Please provide the required data' });

  if (!req?.query?.tokenAddress || !req?.query?.amount)
    return res.status(400).json({ message: 'the fields tokenAddres and amount are required' });
  const tokenAddress = req.query.tokenAddress;
  const amount = req.query.amount;

  //requesting the approval data
  const data = await approve(blockchain, tokenAddress, amount);

  if (!data) return res.status(500).json({ message: 'Server error, please send the data again' });
  return res.status(200).json(data);
};

//get the transaction object... ready to send the transaction
const getSwap = async (req, res) => {
  if (!req?.params?.blockchainId)
    return res.status(400).json({ message: 'Please provide the blockchain id' });
  const blockchain = req.params.blockchainId;

  if (!req?.query) return res.status(400).json({ message: 'Please send the required information' });
  if (
    !req?.query?.walletAddress ||
    !req?.query?.fromTokenAddress ||
    !req?.query?.toTokenAddress ||
    !req?.query?.amountTrade
  )
    return res.status(400).json({
      message:
        'The fields blockchain, walletAddress, fromTokenAddress, toTokenAddress, amountTrade are required',
    });
  const walletAddress = req.query.walletAddress;
  const fromTokenAddress = req.query.fromTokenAddress;
  const toTokenAddress = req.query.toTokenAddress;
  const amountTrade = req.query.amountTrade;
  const slippage = req.query.slippage ? req.query.slippage : 1;
  const gasLimit = req.query.gasLimit ? req.query.gasLimit : '';
  const gasPrice = req.query.gasPrice ? req.query.gasPrice : '';

  try {
    const transactionData = await swap(
      blockchain,
      walletAddress,
      fromTokenAddress,
      toTokenAddress,
      amountTrade,
      slippage,
      gasLimit,
      gasPrice
    );

    if (!transactionData)
      return res.status(500).json({ message: 'Server error... Please reload again' });

    return res.status(200).json(transactionData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTokensList,
  getRate,
  getApproval,
  getSwap,
};
