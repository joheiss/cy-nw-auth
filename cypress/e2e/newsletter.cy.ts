describe("Newsletter ...", () => {
  beforeEach(() => {
    cy.task("seedDatabase");
    cy.visit("/");
  });
  it("should display a success message after successfully signing up to the news letter", () => {
    // intercept POST request to /newsletter
    cy.intercept("POST", "/newsletter*", { status: 201 }).as("signup");
    // enter an email address
    cy.get("[data-cy='newsletter-email']").type("test@example.com");
    // click signup button
    cy.get("[data-cy='newsletter-submit']").click();
    // check for success message
    cy.wait("@signup");
    cy.get("footer div p").contains("Thanks for signing up").should("exist");
  });

  it("should display a validation error in case an existing email address is reused for newsletter signup", () => {
    // intercept POST request to /newsletter
    cy.intercept("POST", "/newsletter*", { message: "This email is already subscribed.", status: 400 }).as("signup");
    // enter an email address
    cy.get("[data-cy='newsletter-email']").type("test@example.com");
    // click signup button
    cy.get("[data-cy='newsletter-submit']").click();
    // check for success message
    cy.wait("@signup");
    cy.get("footer div p").contains("This email is already subscribed.").should("exist");
  });

  it("should create a contact at the backend", () => {
    cy.request({
      method: "POST",
      url: "/newsletter",
      body: { email: "test@example.com" },
      form: true,
    }).then((res) => {
      expect(res.status).equal(201);
    });
  });
});
