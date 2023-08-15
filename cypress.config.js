const fs = require('fs');
const path = require('path');

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        readShops() {
          const dirname = path.resolve(path.dirname(''));
          const shops = path.resolve(dirname, 'shops');

          if (fs.existsSync(shops)) {
            const file = fs.readFileSync(shops, { encoding: 'utf-8' });
            return file.split('\n');
          }

          return null
        }
      })
    },
  },
};
