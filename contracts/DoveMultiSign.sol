pragma solidity 0.4.10;

/// @title Multisignature wallet - Allows multiple parties to agree on transactions before execution. more rules here https://goo.gl/gCvKRg
/// Credit to Stefan George - <stefan.george@consensys.net> for copying from 0x851b7f3ab81bd8df354f0d7640efcd7288553419

contract MultiSigWallet {

    uint constant public MAX_OWNER_COUNT = 3;
    uint constant public 

    event Confirmation(address indexed sender, uint indexed transactionId);
    event Revocation(address indexed sender, uint indexed transactionId);
    event Submission(uint indexed transactionId);
    event Execution(uint indexed transactionId);
    event ExecutionFailure(uint indexed transactionId);
    event Deposit(address indexed sender, uint value);
    event OwnerAddition(address indexed owner);
    event OwnerRemoval(address indexed owner);
    event RequirementChange(uint required);

    mapping (uint => Transaction) public transactions;
    mapping (uint => mapping (address => bool)) public confirmations;
    mapping (address => bool) public isOwner;
    address[] public owners;
    uint public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint value;
        bytes data;
        bool executed;
    }

    // If tokens are spend by two
    struct SpendingsByTwo {
        address address_1;
        address address_2;
        uint valuel
    }

    //It keep tracks all the spendings 
    struct MonthlySpends {
        uint month; //Month is just a count here
        mapping (address => uint) public individualSpend;
        Transaction txn;
        SpendingsByTwo spendingByTwo;
        uint spendByAll;
        bool status;
    }

    modifier onlyWallet() {
        if (msg.sender != address(this))
            throw;
        _;
    }

    modifier ownerDoesNotExist(address owner) {
        if (isOwner[owner])
            throw;
        _;
    }

    modifier ownerExists(address owner) {
        if (!isOwner[owner])
            throw;
        _;
    }

    modifier transactionExists(uint transactionId) {
        if (transactions[transactionId].destination == 0)
            throw;
        _;
    }

    modifier confirmed(uint transactionId, address owner) {
        if (!confirmations[transactionId][owner])
            throw;
        _;
    }

    modifier notConfirmed(uint transactionId, address owner) {
        if (confirmations[transactionId][owner])
            throw;
        _;
    }

    modifier notExecuted(uint transactionId) {
        if (transactions[transactionId].executed)
            throw;
        _;
    }

    modifier notNull(address _address) {
        if (_address == 0)
            throw;
        _;
    }

    modifier validRequirement(uint ownerCount, uint _required) {
        if (   ownerCount > MAX_OWNER_COUNT
            || _required > ownerCount
            || _required == 0
            || ownerCount == 0)
            throw;
        _;
    }

    /// @dev Fallback function allows to deposit ether.
    function() payable {
        if (msg.value > 0) {
            Deposit(msg.sender, msg.value);
        }
    }


