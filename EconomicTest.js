
/* @License Starts * * Copyright © 2015 - present. MongoExpUser 
* 
* License: MIT - See: https://github.com/MongoExpUser/EP-Economic-Module/blob/master/LICENSE
* 
* @License Ends 
* 
* This module is for testing the EP-Economic functionalities in: EconomicModel.js 
*
*/
  
  
//create object with "Prototype" and "Module Pattern (i.e. IIFE & object return)"  
EconomicTest = (function economicTest(){
{
    'use strict';

    //constructor
    function main(){var testEcon = null;} 
  
    main.prototype.testingEconomicModel = function ()
    {
      var econModel = require('EconomicModel.js');
      var inputDataActual = [0];
      var prodFunction    = [[0, 2, 4, 6], [0, 20, 200, 200]];
      new econModel().economicModel(inputDataActual, prodFunction, "tight", null);
    }
  
    //export all prototype functions on main
    module.exports = main;

    //return main to make its objects accessible
    return main;
}());
  
//invoke test as IIFE
(function testAll(option)
{
       'use strict';
       new EconomicTest().testingEconomicModel();   //. EconomicModel testing
}());
