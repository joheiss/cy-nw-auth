describe("Authentication ...", () => {
  beforeEach(() => {
    cy.task("seedDatabase");
  });

  it("should signup successfully with new creds", () => {
    cy.visit("/signup");
    // enter username and password
    cy.get("[data-cy='auth-email']").click();
    cy.get("[data-cy='auth-email']").type("test2@example.com");
    cy.get("[data-cy='auth-password']").type("hanswurst");
    // ... and click "Create Account"
    cy.get("[data-cy='auth-submit']").click();
    // should navigate to /takeaways
    cy.location("pathname").should("equal", "/takeaways");
    // should have a session cookie - with a value in it
    cy.getCookie("__session").its("value").should("not.be.empty");
  });

  it("should login successfully with the proper creds", () => {
    cy.visit("/login");
    // login 
    cy.login();
    // should navigate to /takeaways
    cy.location("pathname").should("equal", "/takeaways");
    // should have a session cookie - with a value in it
    cy.getCookie("__session").its("value").should("not.be.empty");
  });

  it("should logout when 'Logout' is clicked", () => {
    // first login again ...
    cy.login();
    // ... then click on "Logout" ...
    cy.get("form").contains("Logout").click();
    // ... and check that url has changed and session cookie is emptied
    cy.location("pathname").should("equal", "/");
    // should have a session cookie - with a value in it
    cy.getCookie("__session").its("value").should("be.empty");
  });
});
