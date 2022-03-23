const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CustodialWallet", function () {
    it("should should be able to accept ETH", async function () {
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
});
