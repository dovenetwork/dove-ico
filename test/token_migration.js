const ATL = artifacts.require("./ATL.sol");
const ICO = artifacts.require("./ICO.sol");
const MockPreICO = artifacts.require("./MockPreICO.sol");

contract("token migration", () => {
  const [a, b, c] = web3.eth.accounts;
	//a - team
	//b - robot
	//c - ATP investor
  let preICO;
  let ico;
  let atl;


  function chkBalance(tok, addr, val, msg) {
    return tok.balanceOf.call(addr).then(res => {
			assert.equal(val, web3.fromWei(res.toFixed(), 'ether'), msg);
			console.log(addr, web3.fromWei(res.toFixed(), 'ether'));
		})
  }

  it("should be able to create PreICO", () =>
    MockPreICO.new().then(res => {
      assert.isOk(res && res.address, "has invalid address");
      preICO = res;
    })
  );

  it("should be able to create ICO", () =>
    ICO.new(a, preICO.address, b).then(res => {
      assert.isOk(res && res.address, "has invalid address");
      ico = res;
      return ico.atl.call().then(_atl => {
				atl = ATL.at(_atl);
			});
    })
  );

  it("should be able to set balance in MockPreICO", () =>
    preICO.setBalance(web3.toWei(3, 'ether'), {from: c}).then(() => {
      	chkBalance(preICO, c, 3, "can't set mock balance");
			}
    )
  );

  it("should be able to migrate some tokens", () =>
    ico.migrateSome([c], {from: b}).then(() =>
      chkBalance(preICO, c, 0, "balance should be empty after migration")
    )
  );

  it("ATL balance should be 2*ATP after migration", () => {
	    chkBalance(atl, c, 3 * 2, "ATL should be doubled after migration");
		}
  );

  it("should not change ATP balance on repeated migrations", () =>
    ico.migrateSome([c], {from: b})
      .then(() => assert.fail("should throw"))
      .catch(() => {
				chkBalance(preICO, c, 0, "balance should not change");
				chkBalance(atl, c, 6, "ico balance should not change");
			})
  );
})
