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
 * a) SHA-512 Algorithm      : SHA-512         -----> based on node.js' crypto.createHmac() - depends on OpenSSL version
 * b) WHIRLPOOL Algorithm    : WHIRLPOOL       -----> based on node.js' crypto.createHmac() - depends on OpenSSL version
 * c) BCrypt Algorithm       : Bcrypt          -----> based on "bcrypt-nodejs" module
 * d) SCrypt Algorithm       : Scrypt          -----> based on  node.js' crypto.scrypt()
 *
 * Node.js' crypo algorithm (for crypto.createHmac()) is dependent on the available algorithms supported by the version of OpenSSL on the platform.
 *
 * To check available crypo algorithms (for crypto.createHmac()):
 *
 * Option 1 - Within Node.js application file:
 *   var crypto = require('crypto');
 *   console.log(crypto.getHashes());
 *
 * Option 2 - On Ubuntu/Linux. From shell, run:
 *   openssl list -digest-algorithms
 *
 */


class  EconomicCrypto
{
    constructor(){ }
    
    static commonModules()
    {
       return {
           globalPromise: require('bluebird'),
           uuidV4: require('uuid/v4'),
           bcrypt: require("bcrypt-nodejs"),
           fs: require('fs'),
           crypto: require('crypto')
       }
    }
    
    static isCryptoSupported(showAlgorithm)
    {
        try
        {
            var commonModules = EconomicCrypto.commonModules();
            var crypto = commonModules.crypto;
        }
        catch(cryptoError)
        {
            console.log('crypto support is disabled or not available!');
            return;
        }
        finally
        {
            // show (print) available hash (i.e. digest) algorithms in OpenSSL version bundled  with the current Node.js version
            if(showAlgorithm == true)
            {
              var hashesAlgorithms = crypto.getHashes();
              console.log(hashesAlgorithms);
            }
            return true;
        }
    }

    blockchainHash(sig, hashAlgorithm, compareSig, compareSalt, compareHashSig, compareDateNow)
    {
        var commonModules = EconomicCrypto.commonModules();
        global.Promise    = commonModules.globalPromise;
        var uuidV4        = commonModules.uuidV4;
        var bcrypt        = commonModules.bcrypt;
        var fs            = commonModules.fs;
        var showAlgorithm = false;
        
        if(EconomicCrypto.isCryptoSupported(showAlgorithm) === true)
        {
            var economicCrypto = new EconomicCrypto();
            var rehash = economicCrypto.isHashConsensus(sig, hashAlgorithm);
            return [rehash];
        }
    }
   
    isHashConsensus(sig, hashAlgorithm, compareSig, compareSalt, compareHashSig, compareDateNow)
    {
        var commonModules = EconomicCrypto.commonModules();
        global.Promise    = commonModules.globalPromise;
        var uuidV4        = commonModules.uuidV4;
        var bcrypt        = commonModules.bcrypt;
        var fs            = commonModules.fs;
        var showAlgorithm = true;
        
        if(EconomicCrypto.isCryptoSupported(showAlgorithm) === true)
        {
            var dateNow = new Date();

            if(hashAlgorithm !== "bcrypt" && hashAlgorithm !== "whirlpool" && hashAlgorithm !== "sha512" && hashAlgorithm !== "scrypt")
            {
                //default hash/disgest algorithm
                hashAlgorithm = "whirlpool";
            }
        
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
    
}

module.exports = {EconomicCrypto};
