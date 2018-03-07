pragma solidity ^0.4.19;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract BankAccount is Ownable {

    struct Account {
        uint256 balance;
    }

    Account[] accounts;

    mapping (uint256 => address) accountsIndexToOwner;
    mapping (address => uint256) ownerAddressToIndex;
    mapping (address => uint256) ownershipTokenCount;

    event AccountTransfer(address from, address to, uint256 tokenId);
    event AccountDeposit(address from, uint256 toIndex, uint256 amount);

    function BankAccount() public {

    }

    function createBankAccount(uint startingBalance, address _owner) public returns (uint256) {
        // create a new bank account
        Account memory _account = Account({
            balance: startingBalance
        });
        uint256 newAccountId = accounts.push(_account) - 1;
        // 4 billion accounts max.
        require(newAccountId == uint256(uint32(newAccountId)));
        _accountOwnerShipTransfer(0, _owner, newAccountId);
        return 0;
    }

    function _accountOwnerShipTransfer(address _from, address _to, uint256 _tokenId) internal {
        ownershipTokenCount[_to]++;
        accountsIndexToOwner[_tokenId] = _to;
        ownerAddressToIndex[_to] = _tokenId;
        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
        }
        // Emit the transfer event.
        AccountTransfer(_from, _to, _tokenId);
    }

    function deposit(uint256 _amount, uint256 _toIndex) payable public {
        require(msg.value == _amount);
        require(accountsIndexToOwner[_toIndex] != address(0));
        Account storage account = accounts[_toIndex];
        account.balance += _amount;
        AccountDeposit(msg.sender, _toIndex, _amount);
    }

    function getBalance(address _from) public view returns (uint256) {
        require(_from == msg.sender); // check ownership
        uint256 index = ownerAddressToIndex[_from];
        Account memory account = accounts[index];
        return uint(account.balance);
    }
}
