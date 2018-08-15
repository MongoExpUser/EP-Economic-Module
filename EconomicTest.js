
/* @License Starts * * Copyright © 2015 - present. MongoExpUser 
* 
* License: MIT - See: https://github.com/MongoExpUser/EP-Economic-Module/blob/master/LICENSE
* 
* @License Ends 
* 
* This module is for testing the EP-Economic functionalities
*
*/
  
  
  
//create module: through creation and execution of named or anonymous function with IIFE
EconomicTest = (function economicTest(){
{

    'use strict';

    //constructor
    function main(){var test = undefined} 
  
  
    //add test codes later: IP_PROGRESS
    main.prototype.testingEconomicModel = function (arguments)
    {
      //add test codes later: IP_PROGRESS
      
    }    
        
    main.prototype.testingCryptoModel = function ()
    {
        var fs                    = require('fs');
        var path                  = require('path');
        var economicCrypto.js        = require('EconomicCrypto.js');
            
        console.log();
        console.log('------------Testing Crypto Starts--------------------------');
        var sigPath11        = './filePath/file-1.png';                     //path of file to hash - with read
        var sigPath22        = './filePath/file-2.pdf';                     //path of file to hash - with read
        var sigPath33        = './filePath/file-3.pdf';                     //path of file to hash - with read
        var sig1             = fs.readFileSync(sigPath11);                  //file to hash
        var sig2             = fs.readFileSync(sigPath22);                  //file to hash
        var sig3             = 'yu';                                        //string to hash
        var sig              = [sig1, sig2, sig3];                          //array of items to hash
            
        var hashAlgorithm1   = 'bcrypt';
        var hashAlgorithm2   = 'sha512';
        var hashAlgorithm3   = 'whirlpool';
        var hashAlgorithm4   = 'scrypt';
        var toInspect1       = cryptoEconomic;
        console.log(require('util').inspect(toInspect, { showHidden: true, colors: true, depth: 4 })); //print structure
               
        var blockhain        = new cryptoEconomic().isHashConsensus(sig, hashAlgorithm1);
        var priorBlockchains = [blockhain[1], blockhain[1], blockhain[1]];
        var compareSig       = sig;
        var compareSalt      = blockhain[0];
        var compareHashSig   = priorBlockchains;
        var compareDateNow   = blockhain[2];
        var newBlockhain     = new cryptoEconomic().isHashConsensus(sig, hashAlgorithm1, compareSig, compareSalt, compareHashSig, compareDateNow);
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
