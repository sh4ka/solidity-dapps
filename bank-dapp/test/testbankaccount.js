var BankAccount = artifacts.require("./BankAccount.sol");

contract('BankAccount', function (accounts) {

    var bank;
    var owner = accounts[0];
    var someone = accounts[1];

    it("should have fired the AccountTransfer event", function () {
        return BankAccount.deployed().then(function (instance) {
            bank = instance;
            return bank.createBankAccount(0, owner);
        }).then(function (response) {
            assert.equal(response.logs[0].event, 'AccountTransfer', 'AccountTransfer event should fire.');
        });
    });

    it("should send 1000 to first account", function () {
        return BankAccount.deployed().then(function () {
            return bank.deposit(1000, 0, {from: someone, to: BankAccount.address, value: 1000});
        }).then(function (response) {
            assert.equal(response.logs[0].event, 'AccountDeposit', 'AccountDeposit event should fire.');
        });
    });
});