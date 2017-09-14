
pragma solidity ^0.4.11;

import "./installed/token/StandardToken.sol";

contract DOVE is StandardToken {

  string public name = "DOVE Token";
  string public symbol = "DOVE";
  uint public decimals = 18;
  uint constant TOKEN_LIMIT = 150 * 1e6 * 1e18;

  address public ico;

  bool public tokensAreFrozen = true;

  function DOVE(address _ico) {
    ico = _ico;
  }

  function mint(address _holder, uint _value) external {
    require(msg.sender == ico);
    require(_value != 0);
    require(totalSupply + _value <= TOKEN_LIMIT);

    balances[_holder] += _value;
    totalSupply += _value;
    Transfer(0x0, _holder, _value);
  }

  function unfreeze() external {
    require(msg.sender == ico);
    tokensAreFrozen = false;
  }

  function transfer(address _to, uint _value) public {
    require(!tokensAreFrozen);
    super.transfer(_to, _value);
  }


  function transferFrom(address _from, address _to, uint _value) public {
    require(!tokensAreFrozen);
    super.transferFrom(_from, _to, _value);
  }


  function approve(address _spender, uint _value) public {
    require(!tokensAreFrozen);
    super.approve(_spender, _value);
  }
}
