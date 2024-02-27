describe("Takeaways", () => {
  beforeEach(() => {
    // seed test database
    cy.task("seedDatabase");
    cy.visit("/");
  });
  it("should display a list of fetched takeaways", () => {
    cy.get("[data-cy='takeaway-item']").should("have.length.at.least", 1);
  });

  it("should add a new takeway", () => {
    // first login
    cy.login();
    // ... then click "Add Takeaway"
    cy.contains("Add a new takeaway").click();
    // ... and fill title and body
    cy.get("[data-cy='title']").click();
    cy.get("[data-cy='title']").type("Any title");
    cy.get("[data-cy='body']").type("Some body ...");
    // ... finally click "Create"
    cy.get("[data-cy='create-takeaway']").click();
    // make sure that there are now 3 takeaways displayed
    cy.get("[data-cy='takeaway-item']").should("have.length.at.least", 3);
  });

  it("now do the same but intercept the request to the backend", () => {
    // first login
    cy.login();
    // intercept the request to /
    cy.intercept("POST", "/takeaways/new*", "success").as("createTakeaway");
    // ... then click "Add Takeaway"
    cy.contains("Add a new takeaway").click();
    // ... and fill title and body
    cy.get("[data-cy='title']").click();
    cy.get("[data-cy='title']").type("AnotherTitle");
    cy.get("[data-cy='body']").type("WithAnotherBody");
    // ... finally click "Create"
    cy.get("[data-cy='create-takeaway']").click();
    // wait and inspect intercepted request
    cy.wait("@createTakeaway")
      .its("request.body")
      .should("match", /Another.*/);
  });
});
