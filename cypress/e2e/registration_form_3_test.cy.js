beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Test suite for visual tests for registration form 3 is already created
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns
    * checkboxes, their content and links
    * email format
 */
describe('Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        cy.get('img').invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)
    })

    it('Check that the dropdown country and city is correct', () => {

        // Verify that the country dropdown has 4 choices
        cy.get('#country').find('option').should('have.length', 4)

        // Verify all values in the dropdown Country
        cy.get('#country').find('option').eq(0).should('have.text', '')
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')

        // Verify all values in the dropdown City
        // Verify all values in the dropdown City for country Spain
        cy.get('#country').select('Spain')
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Malaga')
        cy.get('#city').find('option').eq(2).should('have.text', 'Madrid')
        cy.get('#city').find('option').eq(3).should('have.text', 'Valencia')
        // Verify all values in the dropdown City for country Estonia
        cy.get('#country').select('Estonia')
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Tallinn')
        cy.get('#city').find('option').eq(2).should('have.text', 'Haapsalu')
        cy.get('#city').find('option').eq(3).should('have.text', 'Tartu')
        // Verify all values in the dropdown City for country Austria
        cy.get('#country').select('Austria')
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Vienna')
        cy.get('#city').find('option').eq(2).should('have.text', 'Salzburg')
        cy.get('#city').find('option').eq(3).should('have.text', 'Innsbruck')
    })

    it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'Never')
        // Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')
        // Selecting one will remove selection from other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

    })

})
it('Check that checkbox list is correct and checkboxes are working correctly', () => {
    cy.get('input[type="checkbox"]').should('have.length', 2).should('not.be.checked')
    // Mark the first checkbox as checked and assert its state
    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    // Mark the second checkbox as checked and assert the state of the first and second checkboxes (both will stay checked)
    cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
    cy.get('input[type="checkbox"]').eq(0).should('be.checked')
    // Check link and its content
    cy.get('button').should('have.text', 'Accept our cookie policy')
    cy.get('button').children().should('be.visible').and('have.attr', 'href', 'cookiePolicy.html').click()
    // Check that currently opened URL is correct
    cy.url().should('contain', '/cookiePolicy.html')
    // Go back to previous page
    cy.go('back')
    cy.log('Back again in registration form 3')
})

it('Checking email format', () => {
    //type wrong email
    cy.get('input[type="email"]').type('valemail.com')
    cy.get('[ng-show="myForm.email.$error.email"]').should('be.visible').should('contain', 'Invalid email address.')
    //left email field empty
    cy.get('input[type="email"]').clear()
    cy.get('[ng-show="myForm.email.$error.required"]').should('be.visible').should('contain', 'Email is required.')
    //type valid email format
    cy.get('input[type="email"]').type('val@email.com')
    cy.get('[ng-show="myForm.email.$error.email"]').should('not.be.visible')
})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + validation
    * only mandatory fields are filled in + validations
    * mandatory fields are absent + validations (try using function)
    * If city is already chosen and country is updated, then city choice should be removed
    * add file (google yourself for solution)
 */
describe('Functional tests', () => {
    //all fields are filled in + validation
    it('User can submit form with all fields filled in + validation', () => {
        cy.get('[name="name"]').clear().type('Valeri Vlassenko')
        cy.get('input[type="email"]').type('val@email.com')
        cy.get('#country').select('Spain')
        cy.get('#city').find('option'); cy.get('#city').select('Madrid')
        cy.get('[type="date"]').eq(0).click().type('1994-09-15').should('have.value', '1994-09-15')
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('#birthday').first().click().type('1994-09-15').should('have.value', '1994-09-15')
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')
        cy.get('input[type="submit"]').last().should('not.be.disabled')
    })


    //only mandatory fields are filled in + validations
    it('Only mandatory fields are filled + validation', () => {
        cy.get('[name="email"]').type('val@email.com')
        cy.get('#country').select('Estonia')
        cy.get('#city').select('Tallinn')
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="submit"]').last().should('be.visible')
        cy.get('[ng-disabled="myForm.$invalid"]').should('not.have.attr', 'disabled')
    })
    //mandatory fields are absent + validations (try using function)
    it.only('Mandatory fields are absent + validation', () => {
        inputValidData('Valeri Vlassenko')
        cy.get('[name="email"]').clear()
        cy.get('[ng-show="myForm.email.$error.required"]').should('be.visible').should('contain', 'Email is required.')
        cy.get('#birthday').clear()
        cy.get('#country').select('')
        cy.get('input[type="checkbox"]').eq(0).uncheck()
        cy.get('input[type="checkbox"]').eq(1).uncheck()
        cy.get('input[type="submit"]').last().should('be.disabled')
    })
    //If city is already chosen and country is updated, then city choice should be removed
    it('If city is already chosen and country is updated, then city choice should be removed', () => {
        cy.get('#country').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('#country').select('Estonia')
        cy.get('#city').should('not.be.selected')
    })
    //add file 
    it('Check that user can add file', () => {
        cy.get('#myFile').selectFile('load_this_file_reg_form_3.txt')
        cy.get('input[type="submit"]').first().click()
        cy.go('back')
        cy.log('Back again in registration form 3')

    })


})
function inputValidData(Name) {
    cy.log('Mandatory fields are absent + validations + using function')
    cy.get('[name="name"]').clear().type(Name)
    cy.get('[name="name"]').clear().type('Valeri Vlassenko')
    cy.get('input[type="email"]').type('val@email.com')
    cy.get('#country').select('Spain')
    cy.get('#city').find('option'); cy.get('#city').select('Madrid')
    cy.get('[type="date"]').eq(0).click().type('1994-09-15').should('have.value', '1994-09-15')
    cy.get('input[type="radio"]').eq(0).check().should('be.checked')
    cy.get('#birthday').first().click().type('1994-09-15').should('have.value', '1994-09-15')
    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
    cy.get('input[type="checkbox"]').eq(0).should('be.checked')
    cy.get('input[type="submit"]').last().should('not.be.disabled')
}