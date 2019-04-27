
/* @License Starts
 *
 * Copyright © 2015 - present. MongoExpUser
 *
 * License: MIT - See: https://github.com/MongoExpUser/EP-Economic-Module/blob/master/LICENSE
 *
 * @License Ends
 *
 * This module is for managing crytographic functionalities associated with "EconomicModel.js on a "Node.js Server".
 * Dependencies are: Node.js native crypto and "bcrypt-nodejs" modules.
 *
 * Note:
 * SHA-512 Algorithm      : SHA-512         -----> based on node.js' crypto.createHmac()
 * WHIRLPOOL Algorithm    : WHIRLPOOL       -----> based on node.js' crypto.createHmac()
 * BCrypt Algorithm       : Bcrypt          -----> based on "bcrypt-nodejs" module
 * SCrypt Algorithm       : Scrypt          -----> based on  node.js' crypto.scrypt()
 * 
 *
 */

class  EcotertCrypto
{
    constructor(){ }

    blockchainHash(sig, hashAlgorithm, compareSig, compareSalt, compareHashSig, compareDateNow)
    {
        global.Promise  = require('bluebird');     
        var uuidV4      = require('uuid/v4');        
        var fs          = require('fs');            
        var bcrypt      = require("bcrypt-nodejs"); 
        try {var crypto = require('crypto'); } catch (cryptoError) {console.log('crypto support is disabled or not available!'); }
        var ecoCrypto = new EcotertCrypto();
        var bc = ecoCrypto.isHashConsensus(sig, hashAlgorithm, compareSig, compareSalt, compareHashSig, compareDateNow);
        var dbCall1 = null;
        var rehash = ecoCrypto.isHashConsensus(sig, hashAlgorithm);
        var dbCall2 = null;
        return [rehash];
    }
    
   
    isHashConsensus(sig, hashAlgorithm, compareSig, compareSalt, compareHashSig, compareDateNow)
    {
        global.Promise  = require('bluebird');      
        var uuidV4      = require('uuid/v4');       // alternative to node.js' crypto.getRandomBytes
        var fs          = require('fs');            
        var bcrypt      = require("bcrypt-nodejs"); 
        try {var crypto = require('crypto'); } catch (cryptoError) {console.log('crypto support is disabled or not available!'); }
        var dateNow = new Date();
        
        if(hashAlgorithm !== "bcrypt" && hashAlgorithm !== "whirlpool" && hashAlgorithm !== "sha512" ){hashAlgorithm = "whirlpool"}
        
        if(sig && hashAlgorithm && !compareSig && !compareSalt && !compareHashSig && !compareDateNow)
        {
                var areSigArray  = Array.isArray(sig);
                if(areSigArray !== true) {console.log('The argument, "sig - i.e. input sig(s)", should be an array. Check, correct and try again!'); return null; }
                if(areSigArray === true) {var sigLen = sig.length; var combinedSig = ''; var salt;}
              
                if(hashAlgorithm === "bcrypt")
                {
                    salt = bcrypt.genSaltSync(10);    
                    for(var i = 0; i < sigLen; i ++) { combinedSig +=  bcrypt.hashSync(sig[i], salt); }
                    var combinedHashSig = bcrypt.hashSync((combinedSig + dateNow), salt);   
                }

                if(hashAlgorithm === "whirlpool" || hashAlgorithm === "sha512")
                {
                    salt = uuidV4();           
                    for(var i = 0; i < sigLen; i ++) { combinedSig +=  (crypto.createHmac(hashAlgorithm, salt)).update(sig[i]).digest('hex');}
                    var combinedHashSig = (crypto.createHmac(hashAlgorithm, salt)).update(combinedSig + dateNow).digest('hex');   
                }
                
                if(hashAlgorithm === "scrypt")
                {
                    for(var i = 0; i < sigLen; i ++){combinedSig +=  (crypto.scryptSync(sig[i], salt, 64)).toString('hex');}
                    var combinedHashSig  = (crypto.scryptSync(combinedSig + dateNow, salt, 64)).toString('hex');
                }
           
                var result = [salt, combinedHashSig, dateNow];
                return result;
          }

        if(sig && hashAlgorithm && compareSig && compareSalt && compareHashSig && compareDateNow)
        {
                var areHashesArray     = Array.isArray(compareHashSig);
                var areCompareSigArray = Array.isArray(compareSig);
                var areSigArray        = Array.isArray(sig);
                if(areHashesArray !== true){ console.log('The argument, "compareHashSig - i.e. hash(es) to be compared", should be an array. Check, correct and try again!');  return null;  }
                if(areCompareSigArray !== true){ console.log('The argument, "compareSig - i.e. sig(s) to be compared", should be an array. Check, correct and try again!'); return null; }
                if(areSigArray !== true) {console.log('The argument, "sig - i.e. input sig(s)", should be an array. Check, correct and try again!'); return null; }
              
                if((areHashesArray === true)  && (areCompareSigArray === true) && (areSigArray === true)) { var compareHashSigLen = compareHashSig.length; var compareSigLen = compareSig.length; var sigLen = sig.length; var combinedSigx = ''; }
              
                if(hashAlgorithm === "bcrypt")
                {
                    for(var i = 0; i < compareSigLen; i ++){combinedSigx +=  bcrypt.hashSync(compareSig[i], compareSalt);}
                    var combinedHashSigx = bcrypt.hashSync((combinedSigx + compareDateNow), compareSalt);     // then hash the combined hash with timestamp
                }
              
                if(hashAlgorithm === "whirlpool" || hashAlgorithm === "sha512")
                {
                    for(var i = 0; i < compareSigLen; i ++){combinedSigx +=  (crypto.createHmac(hashAlgorithm, compareSalt)).update(compareSig[i]).digest('hex');}
                    var combinedHashSigx = (crypto.createHmac(hashAlgorithm, compareSalt)).update(combinedSigx + compareDateNow).digest('hex');     
                }
              
      
                if(hashAlgorithm === "scrypt")
                {
                    for(var i = 0; i < compareSigLen; i ++){combinedSigx +=  (crypto.scryptSync(combinedSig[i], compareSalt, 64)).toString('hex');}
                    var combinedHashSigx  = (crypto.scryptSync(combinedSigx + compareDateNow, compareSalt, 64)).toString('hex');
                }
              
                var count  = 0;
                var result =  true;               
                for(var i = 0; i < compareHashSigLen; i ++) { if((compareHashSig[i] === combinedHashSigx) === false){count = count + 1;} }
                if(count > 0) {result = false;}   
            
                return result;
              
          }
        else
        {
            console.log('Missing or incorrect one or more argument(s). Check, correct and try again!');
            return null;
        }
    
   }
    
}

module.exports = {EcotertCrypto};
