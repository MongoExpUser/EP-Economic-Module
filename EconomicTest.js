
/* @License Starts * * Copyright © 2015 - present. MongoExpUser 
* 
* License: MIT - See: https://github.com/MongoExpUser/EP-Economic-Module/blob/master/LICENSE
* 
* @License Ends 
* 
* This module is for testing the EP-Economic functionalities in: EconomicModel.js and EconomicCrypto.js
*
*/
  
  
//create object with "Prototype" and "Module Pattern (i.e. IIFE & object return)  
EconomicTest = (function economicTest(){
{
    'use strict';

    //constructor
    function main(){var testEcon = null;} 
  
    main.prototype.testingEconomicModel = function (arguments)
    {
      var econModel = require('EconomicModel.js');
      inputDataActual = [0];
      prodFunction    = [[0, 2, 4, 6], [0, 20, 200, 200]];
      new econModel().economicModel(inputDataActual, prodFunction, "tight", null);
    }
        
    main.prototype.testingEconomicCrypto = function ()
    {
        var fs                    = require('fs');
        var path                  = require('path');
        var economicCrypto        = require('EconomicCrypto.js');
            
        console.log();
        console.log('------------Testing Crypto Starts--------------------------');
        var sigPath1        = 'file-1.png';                                //path of file to hash 
        var sigPath2        = 'file-2.pdf';                                //path of file to hash
        var sig1             = fs.readFileSync(sigPath1);                  //file to hash
        var sig2             = fs.readFileSync(sigPath2);                  //file to hash
        var sig3             = "MongoExpUser";                             //string to hash
        var sig              = [sig1, sig2, sig3];                         //array of items to hash
            
        var hashAlgorithm1   = 'bcrypt';
        var hashAlgorithm2   = 'sha512';
        var hashAlgorithm3   = 'whirlpool';
        var hashAlgorithm4   = 'scrypt';
        var toInspect       = economicCrypto;
      
        console.log(require('util').inspect(toInspect, { showHidden: true, colors: true, depth: 4 })); //print structure: a confirmation test
               
        var blockhain        = new economicCrypto().isHashConsensus(sig, hashAlgorithm1);
        var priorBlockchains = [blockhain[1], blockhain[1], blockhain[1]];
        var compareSig       = sig;
        var compareSalt      = blockhain[0];
        var compareHashSig   = priorBlockchains;
        var compareDateNow   = blockhain[2];
        var newBlockhain     = new economicCrypto().isHashConsensus(sig, hashAlgorithm1, compareSig, compareSalt, compareHashSig, compareDateNow);
        console.log("chain - salt, hash, time :");
        console.log(blockhain);
        console.log();
        console.log("confirm :");
        console.log(newBlockhain);
        console.log()
        console.log('------------Testing Crypto Ends--------------------------');
        console.log();
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
       new EconomicTest().testingEconomicModel();   // 1. EconomicModel testing
       new EconomicTest().testingEconomicCrypto();  // 2. EconomicCrypto testing
    }());
