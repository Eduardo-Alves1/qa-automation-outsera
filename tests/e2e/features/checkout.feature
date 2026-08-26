@e2e @checkout
Feature: Checkout
  As an authenticated customer
  I want to complete a purchase
  So that I can validate the end-to-end checkout journey

  @positive @smoke @regression
  Scenario: Complete checkout successfully
    Given the user is authenticated in SauceDemo
    When the user adds a product to the cart
    And opens the cart
    And starts the checkout
    And fills the checkout information with valid data
    And finishes the purchase
    Then the order completion message should be displayed

  @negative @regression
  Scenario: Prevent checkout when required customer data is missing
    Given the user is authenticated in SauceDemo
    When the user adds a product to the cart
    And opens the cart
    And starts the checkout
    And continues the checkout without required customer data
    Then a checkout validation error should be displayed
