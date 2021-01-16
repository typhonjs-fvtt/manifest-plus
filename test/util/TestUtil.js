const fs                = require('fs');
const path              = require('path');

const chai              = require('chai');
const stripJsonComments = require('strip-json-comments');

const test              = require('./test');

/**
 * Provides convenience methods to setup Mocha tests based on JSON data files.
 */
class TestUtil
{
   /**
    * Handles invalid validation tests opening a source JSON file and comparing validation errors to stored error data.
    *
    * @param {function} testFunction - The ajv validation function to test.
    * @param {string}   dirPath - The directory to open error and invalid data.
    * @param {boolean}  [isStrict=false] - Optional boolean to indicate for strict skip checks.
    */
   static invalid(testFunction, dirPath, isStrict = false)
   {
      const errorPath = `${dirPath}${path.sep}errors`;
      const invalidPath = `${dirPath}${path.sep}invalid`;

      if (!fs.existsSync(errorPath) || !fs.existsSync(invalidPath)) { return; }

      const errors = TestUtil.loadFiles(errorPath);
      const invalidData = TestUtil.loadFiles(invalidPath);

      for (const key of invalidData.keys())
      {
         const invalid = invalidData.get(key);

         if (isStrict && '__strictskip' in invalid.data) { continue; }

         it(key, (done) =>
         {
            if (!testFunction(invalid.data))
            {
               const error = errors.get(key);

               if (error === void 0)
               {
                  if (test.createErrorData)
                  {
                     fs.writeFileSync(`${dirPath}${path.sep}errors${path.sep}${key}`,
                      JSON.stringify(testFunction.errors, null, 3));
                  }

                  const msg = test.createErrorData ? ' - creating it' : '';

                  done(new Error(
                   `Error data for'${key}' missing${msg}:\n${JSON.stringify(testFunction.errors, null, 3)}`));
               }

               chai.expect(testFunction.errors).to.be.deep.equal(errors.get(key).data);
               done();
            }
            else
            {
               done(false);
            }
         });
      }
   }

   /**
    * Returns a Map of all files found in the directory provided.
    *
    * @param {string}               dir - Directory to read.
    * @param {Map<string, object>}  [results] - Output Map.
    *
    * @returns {Map<string, object>}
    */
   static loadFiles(dir = '.', results = new Map())
   {
      fs.readdirSync(dir).forEach((filename) =>
      {
         const absPath = path.resolve(dir, filename);
         const stat = fs.statSync(absPath);
         const isFile = stat.isFile();

         if (isFile)
         {
            const baseName = path.basename(absPath);
            const data = JSON.parse(stripJsonComments(fs.readFileSync(absPath, 'utf8')));

            results.set(baseName, {
               absPath,
               baseName,
               data
            });
         }
      });

      return results;
   }

   /**
    * Runs all applicable tests depending on data defined in `test.js`
    */
   static run()
   {
      for (const functionName in test.functionData)
      {
         if (!test.functionName[functionName]) { continue; }

         const testFunction = require('../../dist/validators')[functionName];

         const data = test.functionData[functionName];

         describe(functionName, () =>
         {
            for (const category of data.categories)
            {
               if (!test.categories[category]) { continue; }

               for (const type of data.type)
               {
                  if (!test.type[type]) { continue; }

                  const dirPath = `./test/fixture/manifests/${category}/${type}`;

                  if (!fs.existsSync(dirPath)) { continue; }

                  if (test.valid)
                  {
                     describe(`${category} - ${type} - valid`, () =>
                     {
                        TestUtil.valid(testFunction, dirPath, data.isStrict);
                     });
                  }

                  if (test.invalid)
                  {
                     describe(`${category} - ${type} - invalid`, () =>
                     {
                        TestUtil.invalid(testFunction, dirPath, data.isStrict);
                     });
                  }
               }
            }
         });
      }
   }

   /**
    * Handles valid validation tests opening a source JSON file and expecting it to validate.
    *
    * @param {function} testFunction - The ajv validation function to test.
    * @param {string}   dirPath - The directory to open valid data.
    * @param {boolean}  [isStrict=false] - Optional boolean to indicate for strict skip checks.
    */
   static valid(testFunction, dirPath, isStrict = false)
   {
      const validPath = `${dirPath}${path.sep}valid`;

      if (!fs.existsSync(validPath)) { return; }

      const validData = TestUtil.loadFiles(validPath);

      for (const key of validData.keys())
      {
         const test = validData.get(key);

         if (isStrict && '__strictskip' in test.data) { continue; }

         it(key, (done) =>
         {
            if (!testFunction(test.data))
            {
               done(`\n${JSON.stringify(testFunction.errors, null, 3)}`);
            }
            else
            {
               done();
            }
         });
      }
   }
}

module.exports = TestUtil;
