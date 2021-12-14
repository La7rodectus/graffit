'use strict';

const assert = require('assert');

const baseValidators = require('../src/dataValidators/baseValidators.js');

describe('BaseValidators', () => {
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////// createIntBaseValidator()
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('createIntBaseValidator()', () => {
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////// createStringBaseValidator()
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////// createDateBaseValidator()
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        const res = f('2001-10-');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-10-0' should be false`, () => {
        const res = f('2001-10-0');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-10-41' should be false`, () => {
        const res = f('2001-10-41');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01' should be false`, () => {
        const res = f('2001-13-01');
        assert.strictEqual(res, false);
      });
      it(`Validation '998-10-01' should be false`, () => {
        const res = f('998-10-01');
        assert.strictEqual(res, false);
      });
      it(`Validation NaN should be false`, () => {
        const res = f(NaN);
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
      it(`Validation null should be false`, () => {
        const res = f(null);
        assert.strictEqual(res, false);
      });
    });
    describe('Create for date|null', () => {
      const f = baseValidators.createDateBaseValidator('date|null');
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
        const res = f('2001-10-');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-10-0' should be false`, () => {
        const res = f('2001-10-0');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-10-41' should be false`, () => {
        const res = f('2001-10-41');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01' should be false`, () => {
        const res = f('2001-13-01');
        assert.strictEqual(res, false);
      });
      it(`Validation '998-10-01' should be false`, () => {
        const res = f('998-10-01');
        assert.strictEqual(res, false);
      });
      it(`Validation NaN should be false`, () => {
        const res = f(NaN);
        assert.strictEqual(res, false);
      });
      it(`Validation undefined should be true`, () => {
        const res = f(undefined);
        assert.strictEqual(res, true);
      });
      it(`Validation {} should be false`, () => {
        const res = f({});
        assert.strictEqual(res, false);
      });
      it(`Validation null should be true`, () => {
        const res = f(null);
        assert.strictEqual(res, true);
      });
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////// createDateTimeBaseValidator()
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  describe('createTimeBaseValidator()', () => {
    describe('Create for time', () => {
      const f = baseValidators.createTimeBaseValidator('time');
      it(`Validation null should be false`, () => {
        const res = f(null);
        assert.strictEqual(res, false);
      });
      it(`Validation '09:00:00' should be true`, () => {
        const res = f('09:00:00');
        assert.strictEqual(res, true);
      });
      it(`Validation '00:00:00' should be true`, () => {
        const res = f('00:00:00');
        assert.strictEqual(res, true);
      });
      it(`Validation '21:44:22' should be true`, () => {
        const res = f('21:44:22');
        assert.strictEqual(res, true);
      });
      it(`Validation '25:44:22' should be false`, () => {
        const res = f('25:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '25:61:22' should be false`, () => {
        const res = f('25:61:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '25:01:65' should be false`, () => {
        const res = f('25:01:65');
        assert.strictEqual(res, false);
      });
      it(`Validation '25:01:' should be false`, () => {
        const res = f('25:01:');
        assert.strictEqual(res, false);
      });
      it(`Validation '25::34' should be false`, () => {
        const res = f('25::34');
        assert.strictEqual(res, false);
      });
      it(`Validation 'as:as:as' should be false`, () => {
        const res = f('as:as:as');
        assert.strictEqual(res, false);
      });
      it(`Validation undefined should be false`, () => {
        const res = f(undefined);
        assert.strictEqual(res, false);
      });
      it(`Validation NaN should be false`, () => {
        const res = f(NaN);
        assert.strictEqual(res, false);
      });
      it(`Validation {} should be false`, () => {
        const res = f({});
        assert.strictEqual(res, false);
      });
    });
    describe('Create for time|null', () => {
      const f = baseValidators.createTimeBaseValidator('time|null');
      it(`Validation null should be true`, () => {
        const res = f(null);
        assert.strictEqual(res, true);
      });
      it(`Validation '09:00:00' should be true`, () => {
        const res = f('09:00:00');
        assert.strictEqual(res, true);
      });
      it(`Validation '00:00:00' should be true`, () => {
        const res = f('00:00:00');
        assert.strictEqual(res, true);
      });
      it(`Validation '21:44:22' should be true`, () => {
        const res = f('21:44:22');
        assert.strictEqual(res, true);
      });
      it(`Validation '25:44:22' should be false`, () => {
        const res = f('25:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '25:61:22' should be false`, () => {
        const res = f('25:61:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '25:01:65' should be false`, () => {
        const res = f('25:01:65');
        assert.strictEqual(res, false);
      });
      it(`Validation '25:01:' should be false`, () => {
        const res = f('25:01:');
        assert.strictEqual(res, false);
      });
      it(`Validation '25::34' should be false`, () => {
        const res = f('25::34');
        assert.strictEqual(res, false);
      });
      it(`Validation 'as:as:as' should be false`, () => {
        const res = f('as:as:as');
        assert.strictEqual(res, false);
      });
      it(`Validation undefined should be true`, () => {
        const res = f(undefined);
        assert.strictEqual(res, true);
      });
      it(`Validation NaN should be false`, () => {
        const res = f(NaN);
        assert.strictEqual(res, false);
      });
      it(`Validation {} should be false`, () => {
        const res = f({});
        assert.strictEqual(res, false);
      });
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////// createDateTimeBaseValidator()
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  describe('createDateTimeBaseValidator()', () => {
    describe('Create for datetime', () => {
      const f = baseValidators.createDateTimeBaseValidator('datetime');
      it(`Validation null should be false`, () => {
        const res = f(null);
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-10-01 23:44:22' should be true`, () => {
        const res = f('2001-10-01 23:44:22');
        assert.strictEqual(res, true);
      });
      it(`Validation '2001-10-01 24:44:22' should be false`, () => {
        const res = f('2001-10-01 24:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01 23:44:22' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01 23:44:22' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01     23:44:22' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '  2001-13-01 23:44:22' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01 23:44:22  ' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation ' 23:44:22' should be false`, () => {
        const res = f(' 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01 ' should be false`, () => {
        const res = f('2001-13-01 ');
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
    describe('Create for datetime|null', () => {
      const f = baseValidators.createDateTimeBaseValidator('datetime|null');
      it(`Validation null should be true`, () => {
        const res = f(null);
        assert.strictEqual(res, true);
      });
      it(`Validation '2001-10-01 24:44:22' should be false`, () => {
        const res = f('2001-10-01 24:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-10-01 23:44:22' should be true`, () => {
        const res = f('2001-10-01 23:44:22');
        assert.strictEqual(res, true);
      });
      it(`Validation '2001-13-01 23:44:22' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01 23:44:22' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01     23:44:22' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '  2001-13-01 23:44:22' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01 23:44:22  ' should be false`, () => {
        const res = f('2001-13-01 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation ' 23:44:22' should be false`, () => {
        const res = f(' 23:44:22');
        assert.strictEqual(res, false);
      });
      it(`Validation '2001-13-01 ' should be false`, () => {
        const res = f('2001-13-01 ');
        assert.strictEqual(res, false);
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

});
