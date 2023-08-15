/// <reference types="cypress" />
const moment = require('moment');

const currentDate = moment().format('YYYY-MM-DD');

describe('Regulamin', () => {
  it('Pobierz zrzut ekranu z Regulaminem', () => {

    cy.task('readShops').then((shopsList) => {
      cy.wrap(shopsList).each((shop) => {
        cy.log(`Get Terms for: ${shop}`);
        
        const folderName = `${currentDate}_${shop.replace(/[^\w\s]/gi, '')}`; // Utwórz nazwę folderu zgodną z datą i nazwą sklepu
        const folderPath = Cypress.config('screenshotsFolder') + '/' + folderName;
        cy.task('mkdir', folderPath); // Utwórz folder

        const fileName = 'screenshot.png'; // Nazwa pliku zrzutu ekranu
        const txtFileName = 'terms.txt'; // Nazwa pliku tekstowego
        const filePath = `${folderPath}/${fileName}`;
        const txtFilePath = `${folderPath}/${txtFileName}`;

        cy.visit(`https://${shop}/pl/terms.html`, { timeout: 50000 }); // Odwiedź stronę z regulaminem
        cy.get('#ckdsclmrshtdwn_v2 > .ck_dsclr__btn_v2, .iai_cookie__box .acceptAll').then((btn) => {
          if (btn.length) {
            cy.wrap(btn).click();
          }
        });
        cy.contains('Regulamin').should('be.visible');
        cy.contains('Regulamin').click();

        // Zapisz zrzut ekranu
        cy.screenshot(filePath, { capture: 'fullPage' }).then((screenshotData) => {
          if (typeof screenshotData === 'string' && screenshotData.length > 0) {
            cy.writeFile(txtFilePath, screenshotData, 'base64').then(() => {
              // Zapisz tekst do pliku
              cy.get('.text_menu__txt').then((element) => {
                const text = element.text();
                cy.writeFile(txtFilePath, text, { flag: 'a+' }); // Dodaj do pliku tekstowego
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
