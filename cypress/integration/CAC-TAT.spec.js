// Habilita as referencias do cypress ao passa o mouse por cima da função
/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function () {

    beforeEach(() => { // executa o que está no bloco antes de cada teste
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    // com o only, executa apenas esse teste, para não perder tempo executando tudo
    it('preenche os campos obrigatórios e envia o formulário', () => {
        cy.get('#firstName').type('Juliana')
        cy.get('#lastName').type('Moraes')
        cy.get('#email').type('ju@email.com')
        //cy.get('#open-text-area').type('Teste de texto.')
        cy.get('#product').type(0)
        cy.get('#open-text-area').type('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of.', { delay: 0 })
        //pelo inspecionar do navegador consigo ver a classe, mas peguei pelo type
        // tradução: pega esse botão e clica nele
        cy.get('button[type="submit"]').click()

        //verfica se a mensagem de sucesso está
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').type('Juliana')
        cy.get('#lastName').type('Moraes')
        cy.get('#email').type('juemailcom.br')
        cy.get('#open-text-area').type('Teste.', { delay: 0 })
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')

    })

    it('verificar se o campo telefone fica vazio depois de passar um valor não numero', () => {
        cy.get('#phone')
            .type('jgjgjgjhg') //o campo deve permanecer vazio
            .should('have.value', '') //verifica se o campo está vazio

    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Juliana')
        cy.get('#lastName').type('Moraes')
        cy.get('#email').type('ju@email.com')
        cy.get('#phone-checkbox').check() // ou click()
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Juliana')
        cy.get('#lastName').type('Moraes')
        cy.get('#email').type('ju@email.com')
        cy.get('#phone').type(123458742)
        cy.get('#open-text-area').type('Teste.', { delay: 0 })
        cy.get('button[type="submit"]').click()

        cy.get('#firstName').clear().should('have.value', '')

    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.get('#firstName').should('have.value', '')
        cy.get('#lastName').should('have.value', '')
        cy.get('#email').should('have.value', '')
        cy.get('#open-text-area').should('have.value', '')
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', () => {

        //essa função não existe, é costumizada - criada em cypress/support/commands.js
        cy.fillMandatoryFieldsAndSubmit('Juliana', 'Moraes', 'ju@email.com', 123456778, 'teste')
        cy.get('.success').should('be.visible')
    })

    it('Select aleatório em um dropdown', () => {
        // cy.visit('/index.html')
        cy.get('select option') //pag todas as options do select
            .as('option') // para não repetir 'select option' ele fez um as

            .its('length', { log: false })//length da quantidade de options que tenho
            .then((n) => {
                cy.get('@option', { log: false })//esse @options é do as
                    .then(($options) => {//retorna todas as opções
                        console.log($options);

                        //random limitado ao n, que é o length - 1
                        let randomOptionIndex = Cypress._.random(n - 1)
                        let randomOptionText = $options[randomOptionIndex].innerText

                        //no original não tinha o while
                        //mas estava dando erro nesse caso pq tem uma opção de Selecionar
                        while (randomOptionText === 'Selecione') {
                            randomOptionIndex = Cypress._.random(n - 1)
                            randomOptionText = $options[randomOptionIndex].innerText
                        }

                        cy.get('select').select(randomOptionText)


                    })
            })
    })

    it('Select aleatório em um dropdown mais curto', () => {

        cy.get('select option') //pag todas as options do select
            .its('length', { log: false })//length da quantidade de options que tenho
            .then((n) => {
                let nRandom = Cypress._.random(n - 1)
                while (nRandom === 0) {
                    nRandom = Cypress._.random(n - 1)
                }
                cy.get('select').select(nRandom)
            })
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })


    it('marca o tipo de atendimento "Elogio', () => {
        cy.get('input[type="radio"][value="elogio"]')
            .check()
            .should('have.value', 'elogio')
    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
            /*  .check()
             .should('be.checked') */
            .should('have.length', 3)//verifico se o tamanho é 3
            .each(($radio) => { //passa pelo array
                cy.wrap($radio).check() // mara
                cy.wrap($radio).should('be.checked') //verifica se está marcado
            })

    })


    /* MARCANDO MULTIPLOS OS INPUTS DO TIPO CHECKBOX
      Visto que todos os checkboxes estão contidos em uma div com o id check, posso marcar todos com um único comando da seguinte forma: (CÓIGO ABAIXO) 
      
      E visto que o comando .check() encadeado ao cy.get() marca mais de um checkbox se o seletor utilizado não for específico para um único elemento, todos os checkboxes são marcados.
      
      Com isso, posso fazer um novo cy.get(), dessa vez passando como argumento o alias (`@checkboxes`) criado anteriormente para todos os inputs do tipo checkbox contidos na div com o id check (sem duplicar o seletor), para verificar que realmente todos estão marcados.
      */

    it('checks all checkboxes with one command', () => {
        cy.get('#check input[type="checkbox"]')
            .as('checkboxes')
            .check()
        cy.get('@checkboxes')
            .each(checkbox => {
                expect(checkbox[0].checked).to.equal(true)
            })
    })

    it('marcando todos os chackbox e desmarcando o ultimo', () => {
        cy.get('#check input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', ()=>{
        cy.get('input[type="file"]#file-upload')
        .should('not.have.value')//verifica se não tem nenhum arquivo selecionado
        .selectFile('./cypress/fixtures/example.json')//caminho do arquivo para o input de upload
        .should((input)=>{
            console.log(input[0].files[0].name)
            expect(input[0].files[0].name).to.equal('example.json')
            
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', ()=>{
        cy.get('input[type="file"]#file-upload')
        .should('not.have.value')//verifica se não tem nenhum arquivo selecionado
        .selectFile('./cypress/fixtures/example.json',{action:'drag-drop'})
        //com o drag-drop, simula que tem uma janela aberta e o arquivo é arrastado para a aplicação
        //visualmente não tem diferença, mas ele faz a simulação por baixo dos panos
        .should((input)=>{
            console.log(input[0].files[0].name)
            expect(input[0].files[0].name).to.equal('example.json')
            
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', ()=>{
        cy.fixture('example.json').as('sampleFile')//nome do arquivo e alias "apelido"
        cy.get('input[type="file"]#file-upload')
            .selectFile('@sampleFile')
            .should((input)=>{
                console.log(input[0].files[0].name)
                expect(input[0].files[0].name).to.equal('example.json')
            })
            
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', ()=>{
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
        //'have.attr' === tem atibuto
        //ou seja, verifica se no a que tem id privacy tem atributo target=_blank

    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', ()=>{
        //cy.get('#privacy a').click()//fazendo assim o teste não consegue ler, pois sai da janela
        cy.get('#privacy a')
        .invoke('removeAttr', 'target') //remove o atributo target
        .click()

        cy.contains('Talking About Testing').should('be.visible')
    })



})