describe('DS Catalog', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/paginas')
  })


    it('verifica o título da aplicação', () => {
    cy.visit('http://localhost:4200/paginas')

    cy.title().should('be.equal', 'FrontStore')
  })


  it('Clicar no botao INICIE AGORA A SUA BUSCA', () => {
  cy.contains('INICIE AGORA A SUA BUSCA').click()
   cy.url().should('include', '/catalogo');

})


it('Deve clicar no botão ADMIN e ir para a tela de login', () => {
  // 1. Visita a página inicial
  cy.visit('/paginas'); 

  // 2. Procura especificamente a tag <a> que contém o texto ADMIN e clica
  cy.contains('a', 'ADMIN').click();

  // 3. VERIFICAÇÃO (O mais importante): A URL mudou para /login?
  cy.url().should('include', '/login');
  
  // 4. (Opcional) Verifica se o formulário de login apareceu na tela
  cy.get('h2').should('contain', 'LOGIN');
});

it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
  // 1. Visita a página inicial
  cy.visit('/paginas'); 

  // 2. Procura especificamente a tag <a> que contém o texto ADMIN e clica
  cy.contains('a', 'ADMIN').click();

  // 3. VERIFICAÇÃO (O mais importante): A URL mudou para /login?
  cy.url().should('include', '/login');
  
  //4. clica no campo de email, limpa e digita um novo valor, e verifica se o valor foi alterado
  cy.get('[name="email"]').clear().type('maria@gmail.com').should('have.value', 'maria@gmail.com')

   //5. clica no campo de password, limpa e digita um novo valor, e verifica se o valor foi alterado
  cy.get('[name="password"]').clear().type('123456').should('have.value', '123456')

  cy.contains('button', 'LOGAR').click();

})


it.only('visitar a pagina CATALOGO e clicar em um elemento', () => {
  cy.visit('/paginas'); 
  cy.contains('a', 'CATÁLOGO').click();
  cy.url().should('include', '/catalogo');
  cy.get('.product-card').last().click();
})

})