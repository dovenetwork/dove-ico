const ATL = artifacts.require("./ATL.sol");
const ICO = artifacts.require("./ICO.sol");
const MockPreICO = artifacts.require("./MockPreICO.sol");

contract("bonus pattern", () => {

  const TOKENS_FOR_SALE = new web3.BigNumber("1e18").mul(103548812);
  const minTokenPrice = 425;

  const [a, b, c] = web3.eth.accounts;
  let ico;

  it("should be able to create ICO", () =>
    ICO.new(a, b, c).then(res => {
      assert.isOk(res && res.address, "has invalid address");
      ico = res;
    })
  );

  const chkBonus = (soldPart, ethValue, bonus) => {
		ico.getBonus.call(
			web3.toWei(ethValue * minTokenPrice),
			TOKENS_FOR_SALE.mul(soldPart).trunc().toFixed()
		).then(res => {
			assert.equal(bonus, web3.fromWei(res.toFixed()));
		});
	}

  it("should get bonus for the 1st 1 ETH", () => chkBonus(0, 1, 80));
  it("should get bonus for 1 ETH after selling 10% of supply", () => chkBonus(0.1, 1, 70));
  it("should get bonus for 1 ETH after selling 20% of supply", () => chkBonus(0.2, 1, 60));
  it("should get bonus for 1 ETH after selling 30% of supply", () => chkBonus(0.3, 1, 50));
  it("should get bonus for 1 ETH after selling 40% of supply", () => chkBonus(0.4, 1, 40));
  it("should get bonus for 1 ETH after selling 50% of supply", () => chkBonus(0.5, 1, 30));
  it("should get bonus for 1 ETH after selling 60% of supply", () => chkBonus(0.6, 1, 20));
  it("should get bonus for 1 ETH after selling 70% of supply", () => chkBonus(0.7, 1, 10));
  it("should get bonus for 1 ETH after selling 80% of supply", () => chkBonus(0.8, 1, 0));
  it("should get bonus for 1 ETH after selling 90% of supply", () => chkBonus(0.9, 1, 0));

  it("buying 30000 ETH to pass 20% sold level with one purchase", () => chkBonus(0.1, 30000, 2043644.263529411764705881));
})
