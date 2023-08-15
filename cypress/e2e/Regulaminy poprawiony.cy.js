/// <reference types="cypress" />
const moment = require('moment');

const currentDate = moment().format('YYYY-MM-DD');

describe('Regulamin', () => {
  it('Pobierz zrzut ekranu z Regulaminem', () => {

    cy.task('readShops').then((shopsList) => {
      cy.wrap(shopsList).each((shop) => {
        cy.log(`Get Terms for: ${shop}`);
        
        const fileName = `${currentDate}_${shop}`;
        const txtFileName = `${currentDate}_${shop}.txt`;
        const folderName = shop.replace(/[^\w\s]/gi, ''); // Usuwa znaki specjalne z nazwy sklepu
        const folderPath = Cypress.config('screenshotsFolder') + '/' + folderName;
        const filePath = '/' + folderName + '/' + fileName;
        const txtFilePath = folderPath + '/' + txtFileName;

        cy.visit(`https://${shop}/pl/terms.html`, { timeout: 50000 }); // Visit the specific shop's terms page
        cy.get('#ckdsclmrshtdwn_v2 > .ck_dsclr__btn_v2, .iai_cookie__box .acceptAll').then((btn) => {
          if (btn.length) {
            cy.wrap(btn).click();
          }
        });
        cy.contains('Regulamin').should('be.visible');
        cy.contains('Regulamin').click();

        cy.screenshot(filePath, { capture: 'fullPage' }).then((screenshotData) => {
          if (typeof screenshotData === 'string' && screenshotData.length > 0) {
            cy.task('mkdir', folderPath).then(() => {
              cy.writeFile(filePath, screenshotData, 'base64').then(() => {
                // Zapisz zrzut ekranu do pliku tekstowego
                cy.writeFile(txtFilePath, screenshotData).then(() => {
                  cy.get('.text_menu__txt').then((element) => {
                    const text = element.text();
                    cy.log(`Menu Text: ${text}`);
                    cy.writeFile(txtFilePath, text); // Zapisz tekst do pliku
                  });
                });
              });
            });
          } else {
            // throw new Error('Błąd: Brak danych screenshotu.');
          }
        });
      });
    });
  });
});
