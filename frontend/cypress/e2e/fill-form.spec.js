describe('Заполнение формы на стороннем сервисе', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false; // Игнорировать ошибки
    });
  });
  it('должен заполнить данные в форме', () => {
    cy.visit('https://composite.website/');
    // Заполнить текстовые поля
    cy.get('form input[name="name"]').first().type('testtext');
    cy.get('form input[name="phone"]').eq(0).type('123456789', { force: true });
    // Дождаться, пока текстовое поле станет видимым, и заполнить его
    cy.get('form textarea[name="msg-text"]').should('be.visible').type('treterterter');
    // Отправить форму
    cy.get('.button-primary').eq(0).scrollIntoView().should('be.visible').click(); // Клик на кнопке
    // Проверить, что сообщение об успешной отправке отображается
    cy.get('.massage-notice__container').should('be.visible'); // Проверка видимости контейнера с сообщением
    // Дополнительно, можно проверить текст сообщения
    cy.get('.massage-notice__title').should('contain', 'Ваша заявка успешно отправлена');
    cy.get('.massage-notice__text').should('contain', 'Мы свяжемся с Вами в ближайшее время для уточнения деталей');
  });
});