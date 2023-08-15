/// <reference types="cypress" />
const moment = require('moment');

const currentDate = moment().format('YYYY-MM-DD');

describe('Regulamin', () => {
  it('Pobierz zrzut ekranu z Regulaminem', () => {

    cy.task('readShops').then((shopsList) => {
      cy.wrap(shopsList).each((shop) => {
        cy.log(`Get Terms for: ${shop}`);

        cy.origin(`https://${shop}/`, { args: { shopName: shop, date: currentDate }} , ({ shopName, date }) => {
          Cypress.on('uncaught:exception', (err, runnable) => {
            return false
          });

          const fileName = `${date}_${shopName}`;
          const txtFileName = `${date}_${shopName}.txt`;
          const folderName = shopName.replace(/[^\w\s]/gi, ''); // Usuwa znaki specjalne z nazwy sklepu
          const folderPath = Cypress.config('screenshotsFolder') + '/' + folderName;
          const filePath = '/' + folderName + '/' + fileName;
          const txtFilePath = folderPath + '/' + txtFileName;

          cy.visit('/pl/terms.html', { timeout: 50000 });
          cy.get('#ckdsclmrshtdwn_v2 > .ck_dsclr__btn_v2, .iai_cookie__box .acceptAll').then((btn) => {
            if (btn.length) {
              cy.wrap(btn).click();
            }
          })
          cy.contains('Regulamin').should('be.visible');
          cy.contains('Regulamin').click();
  
          cy.screenshot(filePath, { capture: 'viewport' }).then((screenshotData) => {
            if (typeof screenshotData === 'string' && screenshotData.length > 0) {
              cy.task('mkdir', folderPath).then(() => {
                cy.writeFile(filePath, screenshotData, 'base64').then(() => {
                  // Zapisz zrzut ekranu do pliku tekstowego
                  cy.writeFile(txtFilePath, screenshotData).then(() => {
                    cy.readFile(txtFilePath).then((fileContent) => {
                      cy.log(`Zawartość zrzutu ekranu zapisana w pliku tekstowym:\n${fileContent}`);
                    });
                  });
                });
              });
            } else {
              // throw new Error('Błąd: Brak danych screenshotu.');
            }
          })
        });

      });
    });
  });
});
