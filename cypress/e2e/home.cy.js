
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(6000);
  });

  it('visit home page', () => {
    cy.get('[data-testid="cake-list"]').should('be.visible');
  });

  it('navigates to cake detail', () => {
    cy.get('[data-testid="cake-card"]').first().click();
    cy.url().should('match', /localhost:3000\/\d+$/);
    cy.wait(5000);
    cy.get('[data-testid="cake-detail-page"]').should('be.visible');
  });

  it('shows login dialog when click header icon', () => {
    cy.get('[data-testid="header-login-button"]').click();
    cy.get('[data-testid="login-dialog"]').should('be.visible');
  });
});
