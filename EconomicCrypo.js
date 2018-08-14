
/* @License Starts
 *
 * Copyright © 2015 - present. MongoExpUser
 *
 * License: MIT
 *
 * @License Ends
 *
 * This module is for managing crytographic functionalities associated with "EconomicModel.js".
 * Dependencies are: Node.js native crypto and "bcrypt-nodejs" modules.
 * Module is under development (in progress)
 *
 * Note:
 * SHA-2, SHA-512 variant : SHA-512-crypt   -----> SHA-2 =>Secure Hash Algorithm 2
 * WHIRLPOOL algorithm    : WHIRLPOOL       -----> Produces 512-bit hash - based on node.js' crypto.createHmac()
 * BCrypt Algorithm       : Bcrypt          ----- >Produces 512-bit hash - based on "bcrypt-nodejs" module
 *
 *
 */


//create module: through creation and execution of named or anonymous function with IIFE
var  EconomicCrypto = (function cryptoModel()
{
    "use strict";

    //constructor
    function main(){}
    
    //private function
    function test()
    {
   
    }
    
    //public function
    main.prototype.createChain = function (signature, compareSignature)
    {
     
    }
    
   
    //export all prototype functions on main
    module.exports = main;

    //return constructor to make all properties associated with it PUBLIC
    return main;


}());
