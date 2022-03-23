const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Allowance", function () {
    it("should allow the owner to set allowances for addresses", async function () {
        const zeroAddr = ethers.constants.AddressZero;

        const Allowance = await ethers.getContractFactory("Allowance");
        const allowanceContract = await Allowance.deploy();

        await allowanceContract.deployed();

        const setZeroAddressAllowanceTo100 =
            await allowanceContract.setAllowance(zeroAddr, 100);

        await setZeroAddressAllowanceTo100.wait();

        expect(await allowanceContract.allowance(zeroAddr)).to.equal(100);
    });
});

