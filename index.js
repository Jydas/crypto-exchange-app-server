const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();
const { getTokensList, getRate, getApproval, getSwap } = require('./controllers/Request');
const { specs, swaggerUi } = require('./config/swagger/swagger');
/**
 * @swagger
 * components:
 *  schemas:
 *    Approve:
 *      type: object
 *      properties:
 *        data:
 *          type: string
 *          description: The encoded data of the transaction ready to send.
 *          example: '0x095ea7b30000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d00000000000000000000000000000000000000000000006c6b935b8bbd400000'
 *        gasPrice:
 *          type: string
 *          description: Gas price in wei.
 *          example: 15000000000
 *        to:
 *          type: string
 *          description: Token address that will be allowed to exchange through the router.
 *          example: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
 *        value:
 *          type: string
 *          description: Native token value in WEI (for approve is always 0).
 *          example: 0
 *    Rate:
 *      type: object
 *      properties:
 *        fromToken:
 *          type: object
 *          properties:
 *            symbol:
 *              type: string
 *              example: BUSD
 *            name:
 *              type: string
 *              example: BUSD Token
 *            decimals:
 *              type: integer
 *              example: 18
 *            address:
 *              type: string
 *              example: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
 *            logoURI:
 *              type: string
 *              example: https://tokens.1inch.io/0x4fabb145d64652a948d72533023f6e7a623c7c53.png
 *
 *        toToken:
 *          type: object
 *          properties:
 *            symbol:
 *              type: string
 *              example: WBNB
 *            name:
 *              type: string
 *              example: Wrapped BNB
 *            decimals:
 *              type: integer
 *              example: 18
 *            address:
 *              type: string
 *              example: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
 *            logoURI:
 *              type: string
 *              example: https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_1.png
 *
 *        expectedAmount:
 *            type: string
 *            description: The expected amount of tokens to receive
 *            example: 454.44
 *        expectedAmountInWei:
 *            type: string
 *            description: The expected amount of tokens to receive in Wei.
 *            example: 454442892848259448028
 *        fromTokenAmount:
 *            type: string
 *            description: The amount of tokens to swap
 *            example: 200000.00
 *        fromTokenAmountInWei:
 *            type: string
 *            description: The amount of tokens to swap in Wei.
 *            example: '200000000000000000000000'
 *        exchangesList:
 *            type: array
 *            description: An array that contains arrays of paths to swap the tokens with the best rate in the first position.
 *            items:
 *                type: array
 *                items:
 *                    type: object
 *                    properties:
 *                          name:
 *                            type: string
 *                            example: BSC_DODO_V2
 *                          part:
 *                            type: integer
 *                            example: 100
 *                            description: The porcentage of the amount that will be split in that exhange.
 *                          fromTokenAddress:
 *                            type: string
 *                            example: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
 *                          toTokenAddress:
 *                            type: string
 *                            example: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
 *
 *    Swap:
 *      type: object
 *      properties:
 *        from:
 *          type: string
 *          description: The wallet address that is sending the transaction.
 *          example: 0x6344df880aaa3d4rda4CB57F8d794419E41e7F34b2
 *        to:
 *          type: string
 *          description: the router address.
 *          example: '0x1111111254fb6c44bac0bed2854e76f90643097d'
 *        data:
 *          type: string
 *          description: The encoded data of the transaction ready to send, it contains all the required information.
 *          example: '0x7c0252000000000000000000000000009c4350f527ff7f96b650ee894ae9103bdfec043200000000000000000000000000000000000000000000000000000000000000'
 *        value:
 *          type: string
 *          description: If any amount of eth is sent in the transaction (this represent the native token of the blockchain, for bsc-BNB polygon-MATIC etc...).
 *          example: 0
 *        gas:
 *          type: string
 *          description: Estimated amount of the gas limit, increase this value by 25%.
 *          example: 248990
 *        gasPrice:
 *          type: string
 *          description: Gas price in wei.
 *          example: 6000000000
 *
 */
/**
 * @swagger
 * paths:
 *  /tokens/{chainId}:
 *   get:
 *    parameters:
 *      - in: path
 *        name: chainId
 *        required: true
 *        schema:
 *          type: string
 *        description: The blockchain id you can choose from eth, bsc, polygon, avalanche, optimism, arbitrum, gnosis.
 *        example: bsc
 *    summary: Returns a list of tokens available for swap in the selected blockchain.
 *    description: All supported tokens (can also use your own).
 *    tags:
 *      - Tokens info
 *    responses:
 *       '200':    # status code
 *         description: A JSON array of tokens with the information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   tokens:
 *                     type: object
 *                     properties:
 *                       '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee':
 *                          type: object
 *                          properties:
 *                            symbol:
 *                              type: string
 *                              example: BNB
 *                            name:
 *                              type: string
 *                              example: BNB
 *                            decimals:
 *                              type: integer
 *                              example: 18
 *                            address:
 *                              type: string
 *                              example: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
 *                            logoURI:
 *                              type: string
 *                              example: https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_1.png
 *
 *                       '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c':
 *                          type: object
 *                          properties:
 *                            symbol:
 *                              type: string
 *                              example: WBNB
 *                            name:
 *                              type: string
 *                              example: Wrapped BNB
 *                            decimals:
 *                              type: integer
 *                              example: 18
 *                            address:
 *                              type: string
 *                              example: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
 *                            logoURI:
 *                              type: string
 *                              example: https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_1.png
 *
 *  /approve/{chainId}:
 *   get:
 *    parameters:
 *      - in: path
 *        name: chainId
 *        required: true
 *        schema:
 *          type: string
 *        description: The blockchain id you can choose from eth, bsc, polygon, avalanche, optimism, arbitrum, gnosis.
 *        example: bsc
 *      - in: query
 *        name: tokenAddress
 *        required: true
 *        schema:
 *          type: string
 *        description: Token address you want to exchange
 *        example: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
 *      - in: query
 *        name: amount
 *        required: true
 *        schema:
 *          type: string
 *        description: The number of tokens that the router is allowed to spend.If not specified, it will be allowed to spend an infinite amount of tokens.
 *        example: '2000000000000000000000'
 *    summary: Generate data for calling the contract in order to allow the router to spend funds.
 *    description: The data ready to send the approval transaction.
 *    tags:
 *      - Approve info
 *    responses:
 *       '200':    # status code
 *         description: A JSON with the approval information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Approve'
 *
 *  /rate/{chainId}:
 *    get:
 *     parameters:
 *      - in: path
 *        name: chainId
 *        required: true
 *        schema:
 *          type: string
 *        description: The blockchain id you can choose from eth, bsc, polygon, avalanche, optimism, arbitrum, gnosis.
 *        example: bsc
 *      - in: query
 *        name: fromTokenAddress
 *        required: true
 *        schema:
 *          type: string
 *        description: The address of the trade in token.
 *        example: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
 *      - in: query
 *        name: toTokenAddress
 *        required: true
 *        schema:
 *          type: string
 *        description: The address of the requested token.
 *        example: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
 *      - in: query
 *        name: amount
 *        required: true
 *        schema:
 *          type: string
 *        description: The amount of tokens to trade in wei.
 *        example: '200000000000000000000000'
 *     summary: Find the best quote to exchange.
 *     description: The amount of tokens you will receive.
 *     tags:
 *      - Swap info
 *     responses:
 *       '200':    # status code
 *         description: A JSON that contains the quote and the tokens info.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rate'
 *
 *  /swap/{chainId}:
 *    get:
 *     parameters:
 *      - in: path
 *        name: chainId
 *        required: true
 *        schema:
 *          type: string
 *        description: The blockchain id you can choose from eth, bsc, polygon, avalanche, optimism, arbitrum, gnosis.
 *        example: bsc
 *      - in: query
 *        name: walletAddress
 *        required: true
 *        schema:
 *          type: string
 *        description: The address of the wallet that calls the exchange router.
 *        example: '0x6344df880aaa3d4rda4CB57F8d794419E41e7F34b2'
 *      - in: query
 *        name: fromTokenAddress
 *        required: true
 *        schema:
 *          type: string
 *        description: The address of the trade in token.
 *        example: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
 *      - in: query
 *        name: toTokenAddress
 *        required: true
 *        schema:
 *          type: string
 *        description: The address of the requested token.
 *        example: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
 *      - in: query
 *        name: amountTrade
 *        required: true
 *        schema:
 *          type: string
 *        description: The amount of tokens to trade in wei.
 *        example: '200000000000000000000000'
 *      - in: query
 *        name: slippage
 *        required: true
 *        schema:
 *          type: number
 *        description: Limit of price slippage you are willing to accept in percentage, may be set with decimals. &slippage=0.5 means 0.5% slippage is acceptable. Low values increase chances that transaction will fail, high values increase chances of front running. Set values in the range from 0 to 50.
 *        example: 0.5
 *      - in: query
 *        name: gaslimit
 *        default: 11500000
 *        schema:
 *          type: integer
 *        description: Maximum amount of gas for a swap. Should be the same for a quote and swap.
 *        example: 11500000
 *      - in: query
 *        name: gasPrice
 *        schema:
 *          type: string
 *        description: The router takes in account gas expenses to determine exchange route. It is important to use the same gas price on the quote and swap methods.Gas price set in wei 12.5 GWEI set as 12500000000.
 *        example: 12500000000
 *     summary: Generate data for calling the router for exchange.
 *     description: The data ready to send the transaction.
 *     tags:
 *      - Swap info
 *     responses:
 *       '200':    # status code
 *         description: A JSON that contains the transaction details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Swap'
 *
 */

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/tokens/:blockchainId', getTokensList);
app.get('/rate/:blockchainId', getRate);
app.get('/approve/:blockchainId', getApproval);
app.get('/swap/:blockchainId', getSwap);

app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`);
});
