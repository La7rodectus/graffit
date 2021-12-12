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
      it('Validation undefined should be false', () => {
        const res = f(undefined);
        assert.strictEqual(res, false);
      });
      it('Validation NaN should be false', () => {
        const res = f(NaN);
        assert.strictEqual(res, false);
      });
      it('Validation Infinity should be false', () => {
        const res = f(Infinity);
        assert.strictEqual(res, false);
      });
      it('Validation {} should be false', () => {
        const res = f({});
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
      it('Validation undefined should be true', () => {
        const res = f(undefined);
        assert.strictEqual(res, true);
      });
      it('Validation NaN should be false', () => {
        const res = f(NaN);
        assert.strictEqual(res, false);
      });
      it('Validation Infinity should be false', () => {
        const res = f(Infinity);
        assert.strictEqual(res, false);
      });
      it('Validation {} should be false', () => {
        const res = f({});
        assert.strictEqual(res, false);
      });
    });
  });

  describe('createStringBaseValidator()', () => {
    describe('Create for char(3)', () => {
      const f = baseValidators.createStringBaseValidator('char(3)');
      it(`Validation '' should be true`, () => {
        const res = f('');
        assert.strictEqual(res, true);
      });
      it(`Validation ' ' should be true`, () => {
        const res = f(' ');
        assert.strictEqual(res, true);
      });
      it(`Validation '   ' should be true`, () => {
        const res = f('   ');
        assert.strictEqual(res, true);
      });
      it(`Validation 'abc' should be true`, () => {
        const res = f('abc');
        assert.strictEqual(res, true);
      });
      it(`Validation 'abcd' should be false`, () => {
        const res = f('abcd');
        assert.strictEqual(res, false);
      });
      it(`Validation null should be false`, () => {
        const res = f(null);
        assert.strictEqual(res, false);
      });
      it(`Validation undefined should be false`, () => {
        const res = f(undefined);
        assert.strictEqual(res, false);
      });
      it(`Validation {} should be false`, () => {
        const res = f({});
        assert.strictEqual(res, false);
      });
      it(`Validation NaN should be false`, () => {
        const res = f(NaN);
        assert.strictEqual(res, false);
      });
    });

    describe('Create for char(3)|null', () => {
      const f = baseValidators.createStringBaseValidator('char(3)|null');
      it(`Validation '' should be true`, () => {
        const res = f('');
        assert.strictEqual(res, true);
      });
      it(`Validation ' ' should be true`, () => {
        const res = f(' ');
        assert.strictEqual(res, true);
      });
      it(`Validation '   ' should be true`, () => {
        const res = f('   ');
        assert.strictEqual(res, true);
      });
      it(`Validation 'abc' should be true`, () => {
        const res = f('abc');
        assert.strictEqual(res, true);
      });
      it(`Validation 'abcd' should be false`, () => {
        const res = f('abcd');
        assert.strictEqual(res, false);
      });
      it(`Validation null should be true`, () => {
        const res = f(null);
        assert.strictEqual(res, true);
      });
      it(`Validation undefined should be true`, () => {
        const res = f(undefined);
        assert.strictEqual(res, true);
      });
      it(`Validation {} should be false`, () => {
        const res = f({});
        assert.strictEqual(res, false);
      });
      it(`Validation NaN should be false`, () => {
        const res = f(NaN);
        assert.strictEqual(res, false);
      });
    });
  });

  describe('createDateBaseValidator()', () => {
    describe('Create for date', () => {
      const f = baseValidators.createDateBaseValidator('date');
      it(`Validation '2001-10-21' should be true`, () => {
        const res = f('2001-10-21');
        assert.strictEqual(res, true);
      });
      it(`Validation '2001-10' should be false`, () => {
        const res = f('2001-10');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-1' should be false`, () => {
        const res = f('2001-1');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-10-' should be false`, () => {
        const res = f('2001-10');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-10-0' should be false`, () => {
        const res = f('2001-10');
        assert.strictEqual(res, false);
      });
      it(`Validation '201-10-41' should be false`, () => {
        const res = f('2001-10');
        assert.strictEqual(res, false);
      });
    });
  });
});
