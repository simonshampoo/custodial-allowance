const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Allowance", function () {
    it("should allow the owner to set allowances for addresses", async function () {
        const zeroAddr = ethers.constants.AddressZero;

        const Allowance = await ethers.getContractFactory("Allowance");
        const allowanceContract = await Allowance.deploy();

        await allowanceContract.deployed();

        const [owner] = await ethers.getSigners();

        const setZeroAddressAllowanceTo100 = await allowanceContract
            .connect(owner)
            .setAllowance(zeroAddr, 100);

        await setZeroAddressAllowanceTo100.wait();

        expect(await allowanceContract.allowance(zeroAddr)).to.equal(100);
    });
    it("should disallow other EOA's to set allowances for addresses", async function () {
        const zeroAddr = ethers.constants.AddressZero;

        const Allowance = await ethers.getContractFactory("Allowance");
        const allowanceContract = await Allowance.deploy();

        await allowanceContract.deployed();

        const [_, EOA1] = await ethers.getSigners();

        await expect(
            allowanceContract.connect(EOA1).setAllowance(zeroAddr, 100)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
