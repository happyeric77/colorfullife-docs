---
title: EVM transaction data
tags: [evm, ethereum, blockchain]
---


In some case, we might want to add additional data to the transaction. However, the transaction only takes the following parameters:

- `from`: the address of the sender
- `to`: the address of the recipient
- `value`: the amount of ether to send
- `data`: the data to send
- gas related parameters


:::info
[Metamask - sendTransaction api](https://docs.metamask.io/wallet/how-to/send-transactions/#data)
:::

For plain transaction, it is ok to just put the additional data in the `data` field. However, when it comes to smart contract transaction, there is no way to attach additional data to the transaction but append it as suffix to the `data` field.

Take the ERC20 token approve function as an example, if we want to approve 100 tokens to another address with additional data, we can do the following:

```js
// Assuming you already have a provider object to sign transaction
// The ethersjs version being used is "^5.5.4"
const erc20ABI = [
  "function approve(address _spender, uint256 _value) public returns (bool success)",
]
const tokenContract = new ethers.Contract('the-erc20-token-addr', erc20ABI, provider.getSigner());
const amount = ethers.utils.parseUnits('1', decimals);
// Each slot for EVM is 32 bytes, so we want to append 1 slot of data as additional data
const additionalSlot = '0000000000000000000000000000000000000000000000000000000000000001';
const approveData = tokenContract.interface.encodeFunctionData('approve', ['<target-contract-adress>', amount]);

const modifiedApproveData = approveData + additionalSlot;
console.log('approveData', modifiedApproveData);
const approveTransaction = await provider.getSigner().sendTransaction({
  to: tokenContract.address,
  data: modifiedApproveData
});
```



As known, the format of contract call data is `function signature + parameters`. Each of them is 32 bytes. As approved function has 2 parameters, so the data is `function signature + parameter1 + parameter2` like below:

```bash
0x095ea7b330000000000000000000000008fe3842e0b7472a57f2a2d56cf6bce08517a1de000000000000000000000000000000000000000000000000000000000000f424
```

- `0x095ea7b3` is the function signature of `approve(address _spender, uint256 _value)`
- `0000000000000000000000008fe3842e0b7472a57f2a2d56cf6bce08517a1de` is the address of the spender (32 bytes, 20 bytes for address and 12 bytes for padding 0)
- `000000000000000000000000000000000000000000000000000000000000f424` is the amount (1 eth) to approve (32 bytes, 16 bytes for amount and 16 bytes for padding 0)

Then we append additional data `0000000000000000000000000000000000000000000000000000000000000001` to the end of the data. So eventually, the data is:

```bash
0x095ea7b330000000000000000000000008fe3842e0b7472a57f2a2d56cf6bce08517a1de000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000001
```

