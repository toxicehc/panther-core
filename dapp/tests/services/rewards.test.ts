import {describe, expect} from '@jest/globals';
import {BigNumber} from 'ethers';

import {
    getAdvStakingAPY,
    T_START,
    T_END,
    zZkpReward,
    prpReward,
} from '../../src/services/rewards';

describe('Advanced stakes rewards calculation', () => {
    const currentTime = new Date('2022-05-17T12:00:00Z');
    const tenDays = 3600 * 24 * 10 * 1000;

    const beforeStart = T_START - tenDays;
    const start = T_START;
    const afterStart = T_START + tenDays;
    const beforeEnd = T_END - tenDays;
    const end = T_END;
    const afterEnd = T_END + tenDays;

    describe('Linear APY', () => {
        const currentApy = getAdvStakingAPY(Math.floor(currentTime.getTime()));

        it('should be a number', () => {
            expect(typeof currentApy).toEqual('number');
        });

        it(`should be between 45 and 70`, () => {
            const dates = [
                T_START - tenDays,
                T_START,
                T_START + tenDays,
                T_END - tenDays,
                T_END,
                T_END + tenDays,
            ];
            dates.forEach((date: number) => {
                const apy = getAdvStakingAPY(date);
                expect(apy).toBeGreaterThanOrEqual(45);
                expect(apy).toBeLessThanOrEqual(70);
            });
        });

        it(`should be exact APY values for specified moments in time`, () => {
            expect(getAdvStakingAPY(beforeStart)).toEqual(70);
            expect(getAdvStakingAPY(start)).toEqual(70);
            expect(getAdvStakingAPY(afterStart)).toEqual(64.89795918367346);
            expect(getAdvStakingAPY(beforeEnd)).toEqual(50.10204081632653);
            expect(getAdvStakingAPY(end)).toEqual(45);
            expect(getAdvStakingAPY(afterEnd)).toEqual(45);
        });
    });

    describe('zZKP rewards', () => {
        it('should always be less than staked amount', () => {
            const dates = [T_START, T_START + tenDays, T_END - tenDays, T_END];
            dates.forEach((date: number) => {
                const stake = BigNumber.from(100);
                const reward = zZkpReward(stake, date);
                expect(stake.gte(reward)).toBe(true);
            });
        });

        it('should have exact value at beginning of staking', () => {
            const stake = BigNumber.from(1e9);
            const reward = zZkpReward(stake, start);
            expect(reward.toString()).toEqual('93972000');
        });

        it('should have exact value 10 days before end of staking', () => {
            const stake = BigNumber.from(1e9);
            const reward = zZkpReward(stake, beforeEnd);
            expect(reward.toString()).toEqual('13726000');
        });

        it('should throw error if time is before start', () => {
            const stake = BigNumber.from(100);
            expect(() => zZkpReward(stake, T_START - tenDays)).toThrowError();
        });

        it('should throw error if time is after end', () => {
            const stake = BigNumber.from(100);
            expect(() => zZkpReward(stake, T_END + tenDays)).toThrowError();
        });
    });

    describe('PRP rewards', () => {
        it('should always be less than staked amount', () => {
            const stake = BigNumber.from(10).pow(18);
            const reward = prpReward(stake);
            expect(stake.gte(reward)).toBe(true);
        });

        it('should be 1000 times smaller', () => {
            const stake = BigNumber.from(1000).pow(18);
            const reward = prpReward(stake);
            expect(
                reward.eq(BigNumber.from(1000).pow(18).div(1000)),
            ).toBeTruthy();
        });
    });
});
