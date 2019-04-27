
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
        //require (load) all necessary modules: these are private and shared by all objects
        global.Promise  = require('bluebird');      // replace global.promise module with blue bird
        var uuidV4      = require('uuid/v4');       // RFC4122 (Version 4) UUIDs: cryptographically strong random no generation: alternative to node.js' crypto.getRandomBytes
        var fs          = require('fs');            // a core module for file system
        var bcrypt      = require("bcrypt-nodejs"); // crypto-hashing module
        //load node.js' crypo module => test for crypto support first through try-catch statement
        //crypto provides crypto functionalities: wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign & verify
        try {var crypto = require('crypto'); } catch (cryptoError) {console.log('crypto support is disabled or not available!'); }
        
        var ecoCrypto = new EcotertCrypto();
        
        //step 1 + step 2
        var bc = ecoCrypto.isHashConsensus(sig, hashAlgorithm, compareSig, compareSalt, compareHashSig, compareDateNow);
        
        // step 3: calll Dbs (levelDB and MongoDB) to update this latter
        var dbCall1 = null;
        
        //step 4:
        var rehash = ecoCrypto.isHashConsensus(sig, hashAlgorithm);
        
        //step5: calll Dbs (levelDB and MongoDB) to update this latter
        var dbCall2 = null;
        
        //return updates hash: use somewhere else?
        return [rehash];
        
    }
    
   
    isHashConsensus(sig, hashAlgorithm, compareSig, compareSalt, compareHashSig, compareDateNow)
    {
        //require (load) all necessary modules: these are private and shared by all objects
        global.Promise  = require('bluebird');      // replace global.promise module with blue bird
        var uuidV4      = require('uuid/v4');       // RFC4122 (Version 4) UUIDs: cryptographically strong random no generation: alternative to node.js' crypto.getRandomBytes
        var fs          = require('fs');            // a core module for file system
        var bcrypt      = require("bcrypt-nodejs"); // crypto-hashing module
        //load node.js' crypo module => test for crypto support first through try-catch statement
        //crypto provides crypto functionalities: wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign & verify
        try {var crypto = require('crypto'); } catch (cryptoError) {console.log('crypto support is disabled or not available!'); }

        
        //returns an array of the names of supported hash algorithms e.g. RSA-SHA256.
        //console.log(crypto.getHashes());
        
        var dateNow = new Date();
        
        //incase of error in hashAlgorithm set to default (whirlpool)
        if(hashAlgorithm !== "bcrypt" && hashAlgorithm !== "whirlpool" && hashAlgorithm !== "sha512" ){hashAlgorithm = "whirlpool"}

        //hash
        if(sig && hashAlgorithm && !compareSig && !compareSalt && !compareHashSig && !compareDateNow)
        {
                //test that 'sig', is an Array
                var areSigArray  = Array.isArray(sig);
               
                //print error and return null if it is not
                if(areSigArray !== true) {console.log('The argument, "sig - i.e. input sig(s)", should be an array. Check, correct and try again!'); return null; }
              
                //then define common variables
                if(areSigArray === true) {var sigLen = sig.length; var combinedSig = ''; var salt;}
              
                //then hash with "bcrypt" using Bcrypt-Nodejs module
                if(hashAlgorithm === "bcrypt")
                {
                    salt = bcrypt.genSaltSync(10);    // gen. salt (secret) in bycrypt format
                    for(var i = 0; i < sigLen; i ++) { combinedSig +=  bcrypt.hashSync(sig[i], salt); }
                    var combinedHashSig = bcrypt.hashSync((combinedSig + dateNow), salt);   // then hash the combined hash with timestamp
                }

            
                // or hash with "whirlpool" or "sha512" using Node.js native crypto module
                if(hashAlgorithm === "whirlpool" || hashAlgorithm === "sha512")
                {
                    // for uuidv4: length = 36 characters = 32 hex digits + 4 dashes. --> i.e. 128 bits: -> 32 chars as hexadecimal representation
                    salt = uuidV4();               //.toString('hex'); // gen. salt with uuidV4 (already in hexadecimal format: i.e. no need for "toString('hex')")
                    for(var i = 0; i < sigLen; i ++) { combinedSig +=  (crypto.createHmac(hashAlgorithm, salt)).update(sig[i]).digest('hex');}
                    var combinedHashSig = (crypto.createHmac(hashAlgorithm, salt)).update(combinedSig + dateNow).digest('hex');   // then hash the combined hash with timestamp
                }
            
            
                // or hash with "scrypt" or "scrypt" using Node.js native crypto module (added in Node.js 10.5)
                if(hashAlgorithm === "scrypt")
                {
                    for(var i = 0; i < sigLen; i ++){combinedSig +=  (crypto.scryptSync(sig[i], salt, 64)).toString('hex');}
                    var combinedHashSig  = (crypto.scryptSync(combinedSig + dateNow, salt, 64)).toString('hex');
                }
           
                var result = [salt, combinedHashSig, dateNow];
            
                return result;
          }

        //confirm/compare hash
        if(sig && hashAlgorithm && compareSig && compareSalt && compareHashSig && compareDateNow)
        {
                //test that 'sig', 'compareSig' and  'compareHashSig" are Arrays
                var areHashesArray     = Array.isArray(compareHashSig);
                var areCompareSigArray = Array.isArray(compareSig);
                var areSigArray        = Array.isArray(sig);
               
                //print error and return null if they are not
                if(areHashesArray !== true){ console.log('The argument, "compareHashSig - i.e. hash(es) to be compared", should be an array. Check, correct and try again!');  return null;  }
                if(areCompareSigArray !== true){ console.log('The argument, "compareSig - i.e. sig(s) to be compared", should be an array. Check, correct and try again!'); return null; }
                if(areSigArray !== true) {console.log('The argument, "sig - i.e. input sig(s)", should be an array. Check, correct and try again!'); return null; }
              
                //then define common variables
                if((areHashesArray === true)  && (areCompareSigArray === true) && (areSigArray === true)) { var compareHashSigLen = compareHashSig.length; var compareSigLen = compareSig.length; var sigLen = sig.length; var combinedSigx = ''; }
              
                //then hash with "bcrypt" using Bcrypt-Nodejs module
                if(hashAlgorithm === "bcrypt")
                {
                    for(var i = 0; i < compareSigLen; i ++){combinedSigx +=  bcrypt.hashSync(compareSig[i], compareSalt);}
                    var combinedHashSigx = bcrypt.hashSync((combinedSigx + compareDateNow), compareSalt);     // then hash the combined hash with timestamp
                }
              
                // or hash with "whirlpool" or "sha512" using Node.js native crypto module
                if(hashAlgorithm === "whirlpool" || hashAlgorithm === "sha512")
                {
                    for(var i = 0; i < compareSigLen; i ++){combinedSigx +=  (crypto.createHmac(hashAlgorithm, compareSalt)).update(compareSig[i]).digest('hex');}
                    var combinedHashSigx = (crypto.createHmac(hashAlgorithm, compareSalt)).update(combinedSigx + compareDateNow).digest('hex');     // then hash the combined hash with timestamp
                }
              
              
                // or hash with "scrypt" or "scrypt" using Node.js native crypto moduke
                if(hashAlgorithm === "scrypt")
                {
                    for(var i = 0; i < compareSigLen; i ++){combinedSigx +=  (crypto.scryptSync(combinedSig[i], compareSalt, 64)).toString('hex');}
                    var combinedHashSigx  = (crypto.scryptSync(combinedSigx + compareDateNow, compareSalt, 64)).toString('hex');
                }
              
              
                // consume results
                //increase count once any of the hashes is not equal to the "combinedHashSigx" and set result to false
                var count  = 0;
                var result =  true;               //default option: assume all hashes are thesame
                for(var i = 0; i < compareHashSigLen; i ++) { if((compareHashSig[i] === combinedHashSigx) === false){count = count + 1;} }
                if(count > 0) {result = false;}   //update option:  change to false once any hash is not equal to
            
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
