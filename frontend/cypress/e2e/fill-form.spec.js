describe('Заполнение формы на стороннем сервисе', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false; // Игнорировать ошибки
    });
  });
  it('должен заполнить данные в форме', () => {
    cy.visit('https://composite.website/');

    cy.get('form input[name="name"]').first().type('testtext');
    cy.get('form input[name="phone"]').eq(0).type('12345678923', { force: true });

    // Дождаться, пока текстовое поле станет видимым, и заполнить его
    cy.get('form input[name="msg"]').eq(0).type('treterterter', { force: true });

    // Отправить форму
    cy.get('.button-primary').eq(4).click({ force: true })

    // Проверить, что сообщение об успешной отправке отображается
    // cy.get('.massage-notice__container').should('exist').and('be.visible');

    // Дополнительно, можно проверить текст сообщения
//    cy.get('.massage-notice__title').should('contain', 'Ваша заявка успешно отправлена');
//    cy.get('.massage-notice__text').should('contain', 'Мы свяжемся с Вами в ближайшее время для уточнения деталей');
  });
});