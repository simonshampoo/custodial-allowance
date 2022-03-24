const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CustodialWallet", function () {
    it("should be able to accept ETH", async function () {
        const Wallet = await ethers.getContractFactory("CustodialWallet");
        const wallet = await Wallet.deploy();
        await wallet.deployed();
        const walletAddr = wallet.address;

        const [owner] = await ethers.getSigners();

        var balance = await ethers.provider.getBalance(walletAddr);
        console.log("Balance before sending ETH to contract:", balance);

        await owner.sendTransaction({
            to: walletAddr,
            value: ethers.utils.parseEther("1.0"),
        });

        balance = await ethers.provider.getBalance(walletAddr);
        console.log("Balance after sending ETH to contract:", balance);

        expect(ethers.utils.formatEther(balance)).to.equal("1.0");
    });
    it("should be able to fund a user's allowance and allow them to withdraw", async function () {
        const Wallet = await ethers.getContractFactory("CustodialWallet");
        const wallet = await Wallet.deploy();
        await wallet.deployed();

        const [owner, addr1] = await ethers.getSigners();

        let initialFundingTx = await wallet
            .connect(owner)
            .setAllowance(addr1.address, 23);
        console.log(
            "Successfully funded",
            addr1.address,
            "with 100 wei with tx hash",
            initialFundingTx.hash
        );

        await wallet.connect(addr1).withdrawFunds(addr1, 50);

        //expect(await addr1.getBalance()).to.be.equal("50");
    });
    it("should revert when trying to renounce the contract", async function () {
        const Wallet = await ethers.getContractFactory("CustodialWallet");
        const wallet = await Wallet.deploy();
        await wallet.deployed();
        const walletAddr = wallet.address;

        const [owner] = await ethers.getSigners();

        await expect(
            wallet.connect(owner).renounceOwnership()
        ).to.be.revertedWith("Sorry, you can't renounce ownership.");
    });
});
