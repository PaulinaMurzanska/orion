const SuiteCloudJestUnitTestRunner = require('@oracle/suitecloud-unit-testing/services/SuiteCloudJestUnitTestRunner')
const exec = require('child_process').exec
const fs = require('fs');


module.exports = {
	defaultProjectFolder: "src",
	commands: {
    'project:deploy': {
      beforeExecuting: async args => {
        // await SuiteCloudJestUnitTestRunner.run({
        //   testRegex: './__tests__/.+\.test\.js$'
        // });

        return args;
      }
    },
    'account:setup': {
      beforeExecuting: async args => {
        await exec('cp project.json project.json.bak', (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
        })
        return args;
      },
      onCompleted: async args => {
        await fs.readFile('project.json', 'utf8', async (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const sdfAuthProfile = JSON.parse(data).defaultAuthId;
          await fs.readFile('project.json.bak', 'utf8', async (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            const project = JSON.parse(data);
            project.defaultAuthId = sdfAuthProfile;
            await fs.writeFile('project.json', JSON.stringify(project), 'utf8', async (err) => {
              if (err) {
                console.error(err);
                return;
              }
              await exec('rm project.json.bak', async (err, stdout, stderr) => {
                if (err) {
                  console.error(err);
                  return;
                }
                console.log(stdout);
              })
            });
          });
        });
        
        return args;
      }
    }
  }
};