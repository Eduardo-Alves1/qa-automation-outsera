@e2e @login
Feature: Login
  As a customer
  I want to authenticate in SauceDemo
  So that I can access the product catalog

  @positive @smoke @regression
  Scenario: Login successfully with valid credentials
    Given the user is on the SauceDemo login page
    When the user logs in with valid credentials
    Then the inventory page should be displayed

  @negative @regression
  Scenario: Reject login with invalid credentials
    Given the user is on the SauceDemo login page
    When the user logs in with invalid credentials
    Then a login error message should be displayed
