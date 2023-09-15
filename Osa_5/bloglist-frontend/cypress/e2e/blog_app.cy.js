describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset') // Ennen jokaista testiä tietokanta alustetaan ja luodaan testikäytttäjä
    const user = {
      name: 'Patrik Lippojoki',
      username: 'patmikli',
      password: 'salainen'
    }

    const secondUser = {
      name: 'Toinen Kayttaja',
      username: 'toinen',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', secondUser)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {

    it('succeeds with correct credentials', function() {
      cy.get('#username').type('patmikli')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Patrik Lippojoki logged in')
      cy.get('.message')
        .should('contain', 'Logged in as patmikli')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('patmikli')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('patmikli') // Login
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.get('#show-create-form').click() // Avataan uuden blogin luova lomake

      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test Url')
      cy.get('#create-blog-button').click()

      cy.contains('Test Title Test Author')
    })
  })

  describe('After logging in and creating some blogs', function () {
    beforeEach(function () {
      cy.get('#username').type('patmikli') // Login
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.get('#show-create-form').click()
      cy.get('#title').type('Test Title') // Luodaan blogeja testattavaksi
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test Url')
      cy.get('#create-blog-button').click()

      cy.get('#show-create-form').click()
      cy.get('#title').type('Second Title')
      cy.get('#author').type('Second Author')
      cy.get('#url').type('Second Url')
      cy.get('#create-blog-button').click()

      cy.get('#show-create-form').click()
      cy.get('#title').type('Third Title')
      cy.get('#author').type('Third Author')
      cy.get('#url').type('Third Url')
      cy.get('#create-blog-button').click()
    })

    it('A blog can be liked', function() {
      cy.contains('Test Title').contains('view').click() // Näytetään blogi laajemmin
      cy.contains('Test Title').contains('like').click() // Klikataan tykkäys nappia

      cy.contains('1') // Tykkäys näkyy
    })

    it('A blog can be removed by the creator', function () {
      cy.contains('Test Title').contains('view').click() // Näytetään blogi laajemmin
      cy.contains('Test Title').parent().contains('remove').click()

      cy.get('html')
        .should('not.contain', 'Test Title')
        .and('contain', 'Second Title')
    })

    it('Only blogs created by logged user can be removed', function () {
      // Tarkista poisto napin näkyvyys
      cy.contains('Test Title').contains('view').click() // Näytetään blogi laajemmin
      cy.contains('Test Title').parent()
        .should('contain', 'remove')
      // Logout
      cy.contains('logout').click()
      // Login toisella käyttäjällä
      cy.get('#username').type('toinen') // Login
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()
      // Tarkista poisto napin näkymättömyys
      cy.contains('Test Title').contains('view').click() // Näytetään blogi laajemmin
      cy.contains('Test Title').parent()
        .should('not.contain', 'remove')
    })
  })

})