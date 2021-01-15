const TestUtil                   = require('../../util/TestUtil');
const test                       = require('../../util/test');

const { validateSystemStrict }   = require('../../../dist/validators');

if (test.group.validateSystemStrict)
{
   describe('validateSystemStrict', () =>
   {
      if (test.type.validCommon)
      {
         describe('valid (common)', () =>
         {
            TestUtil.valid(validateSystemStrict, './test/fixture/manifests/loose/common', true);
         });
      }

      if (test.type.invalidCommon)
      {
         describe('invalid (common)', () =>
         {
            TestUtil.invalid(validateSystemStrict, './test/fixture/manifests/loose/common', true);
         });
      }

      if (test.type.validBase)
      {
         describe('valid (base)', () =>
         {
            TestUtil.valid(validateSystemStrict, './test/fixture/manifests/loose/system', true);
         });
      }

      if (test.type.invalidBase)
      {
         describe('invalid (base)', () =>
         {
            TestUtil.invalid(validateSystemStrict, './test/fixture/manifests/loose/system', true);
         });
      }

      if (test.type.validPlus)
      {
         describe('valid (plus)', () =>
         {
            TestUtil.valid(validateSystemStrict, './test/fixture/manifests/loose/system+', true);
         });
      }

      if (test.type.invalidPlus)
      {
         describe('invalid (plus)', () =>
         {
            TestUtil.invalid(validateSystemStrict, './test/fixture/manifests/loose/system+', true);
         });
      }

      if (test.type.validCommonStrict)
      {
         describe('valid strict (common)', () =>
         {
            TestUtil.valid(validateSystemStrict, './test/fixture/manifests/strict/common');
         });
      }

      if (test.type.invalidCommonStrict)
      {
         describe('invalid strict (common)', () =>
         {
            TestUtil.invalid(validateSystemStrict, './test/fixture/manifests/strict/common');
         });
      }

      if (test.type.validBaseStrict)
      {
         describe('valid strict (base)', () =>
         {
            TestUtil.valid(validateSystemStrict, './test/fixture/manifests/strict/system');
         });
      }

      if (test.type.invalidBaseStrict)
      {
         describe('invalid strict (base)', () =>
         {
            TestUtil.invalid(validateSystemStrict, './test/fixture/manifests/strict/system');
         });
      }
   });
}