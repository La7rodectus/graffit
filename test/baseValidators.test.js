'use strict';

const assert = require('assert');

const baseValidators = require('../src/dataValidators/baseValidators.js');

describe('BaseValidators', () => {
  describe('CreateIntBaseValidator()', () => {
    describe('Create for int(1)', () => {
      const f = baseValidators.createIntBaseValidator('int(1)');
      it('Validation 1 should be true', () => {
        const res = f(1);
        assert.strictEqual(res, true);
      });
      it('Validation -1 should be true', () => {
        const res = f(-1);
        assert.strictEqual(res, true);
      });
      it('Validation -0 should be true', () => {
        const res = f(-0);
        assert.strictEqual(res, true);
      });
      it('Validation null should be false', () => {
        const res = f(null);
        assert.strictEqual(res, false);
      });
      it('Validation 0.1 should be false', () => {
        const res = f(0.1);
        assert.strictEqual(res, false);
      });
      it('Validation 11 should be false', () => {
        const res = f(11);
        assert.strictEqual(res, false);
      });
      it('Validation 0 should be true', () => {
        const res = f(0);
        assert.strictEqual(res, true);
      });
      it('Validation \'\' should be false', () => {
        const res = f('');
        assert.strictEqual(res, false);
      });
      it('Validation \'12\' should be false', () => {
        const res = f('12');
        assert.strictEqual(res, false);
      });
    });



    describe('Create for int(3)|null', () => {
      const f = baseValidators.createIntBaseValidator('int(3)|null');
      it('Validation 11 should be true', () => {
        const res = f(11);
        assert.strictEqual(res, true);
      });
      it('Validation 111.1 should be false', () => {
        const res = f(111.1);
        assert.strictEqual(res, false);
      });
      it('Validation 11.1 should be false', () => {
        const res = f(11.1);
        assert.strictEqual(res, false);
      });
      it('Validation 0 should be true', () => {
        const res = f(0);
        assert.strictEqual(res, true);
      });
      it('Validation null should be true', () => {
        const res = f(null);
        assert.strictEqual(res, true);
      });
      it('Validation -111 should be true', () => {
        const res = f(-111);
        assert.strictEqual(res, true);
      });
      it('Validation -111.0 should be true', () => {
        const res = f(-111.0);
        assert.strictEqual(res, true);
      });
    });
  });
});
