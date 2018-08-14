
/* @License Starts
 *
 * Copyright © 2015 - present
 *
 * License: MIT
 *
 * @License Ends
*/
//create and execute named or anonymous function with IIFE
var  EconomicModel = (function ecoModel()
{
    "use strict";


    //Constructor
    function main(){ "use strict";}

    /*
     Economic model: is based on the DCF (discounted cash flow) model
     It follows the approach outlined in the SPE-PRMS 2007 (pages: 13-19) and SPE-PRMS 2011 Guide (Pages 109-127).
     SPE References: (1) SPE-PRMS (2007). SPE/WPC/AAPG/SPEE - Petroleum resources management system.
                         Link: http://www.spe.org/industry/docs/Petroleum_Resources_Management_System_2007.pdf.
                     (2)  SPE-PRMS Guide. (2011). Guidelines for application of the petroleum resources management system.
                         Link: http://www.spe.org/industry/docs/PRMS_Guidelines_Nov2011.pdf.
    */
    main.prototype.economicModel = function (inputData, prodFunction, reservoirType, testing)
    {
         "use strict";


           //A: C/C++ Addons using V8 or NAPI engine: for IRR and PBR methods
           var addonEco  =  require('bindings')('addonEco.node');       //require addonEco.node using helper function
           //B: alternative native implementation of IRR and PBR
           //var cashFlowArray = []; //ensure array is populated for using it.
           //IRR(cashFlowArray);     //a method for calculating internal rate of return (IRR)
           //PBP(cashFlowArray)      //a method for calculating payback period (PBP)
        //Note about economics inputs (capex and opex)
        //Capex = Capitalized expenditure/cost: Well drilling & comp. (D&C) & processing facilities - both tangible [C1a]  +  intangible D&C [C1b]  +  Other tangibles [C2]
        //Other tangibles include:  expl.  & acquisition [C2a] +  leasehold bonus[C2b] + extra loan interest above discount, if any [C2c]? + Aba & Recl. [C2d] + Envr. [C2e] + other miscellan. [C2f]: vehicles/motors, furnitures & fittings, buildings, plants (i.e.machineries & equipments, etc.)
        //Well cost could be depreciated/amortized over lease life (or a specficied time) using straight-line method instead of deductions/expensing in year 0.
        //Other tangible costs could also be depreciated over lease life (or a specficied time) using straight-line method instead of deductions/expensing in year 0.
        //Amortization for intangile assest & depreciation for tangible assest (both included under depletion allowance)
        //Intangible DC expenditures are treated like regular expenses and are deductible in year incurred
        //Opex = LOE + GAT + G&A
        //LOE  = fixed & variable (labor + water disposal + fuel + others - materials, maintenance, supplies, insurance, etc.)
        //GAT  = gathering and transportation expenses
        //G&A  = general and administrative expenses, including management, finance and accounting professional fees, etc.  (i.e OVERHEAD)
        //default input array values for testing codes
        if(testing)
        {
            //cost - capex
            inputData[0]  = 6+1;         //dacMMUSD         = inputData[0];     //drilling and completion ($MM)
            inputData[1]  = 1.00;        //dacTanPer        = inputData[1];     //percentage of drilling and completion that is intangible
            inputData[2]  = 0.015;       //facMMUSD         = inputData[2];     //facilities (($MM per peak rate in MMScf or M Boe) - $MM/MMScf or $MM/M boe
            inputData[3]  = 1.001556;    //eaFCMMUSD        = inputData[3];     //exploration & aqusition (finding cost)
            //cost - opex
            inputData[4]  = 8.000;       //opexUSD          = inputData[4];     //operating cost ($ per Mscf or Boe)
            inputData[5]  = 0.00;        //opexEsc          = inputData[5];     //operating cost escalation (percentage, %)
            inputData[6]  = 1853.29;     //drainAcre        = inputData[6];     //operating area of well or lease = well/lease drained area (acres)
            //fiscal terms (royalty, prod.severance, prod. Ad valorem (property tax), environmental tax/cost, reclamation & abandonment, education tax & income tax)
            inputData[7]  = 0.03;        //royalty          = inputData[7];     // royalty (percentage, %)
            inputData[8]  = 0.05;        //prodSeverance    = inputData[8];     // prod.severance or vat or sales tax (percentage, %)
            inputData[9]  = 1.28;        //prodAdValTax     = inputData[9];     // prod. Ad valorem /property tax ($ per acre) = annual lease service (maintenance) Fee [Prop.Tax] ($/Acre) = 1.28 => For viscous reservoir
            inputData[10] = 95.24;       //waterFeeUSD      = inputData[10];    // water fee (USD per year)
            inputData[11] = 2.40;        //envCostUSD       = inputData[11];    // environmental tax/cost ($ per Mscf or Boe)
            inputData[12] = 3.00;        //reclAbadonMMUSD  = inputData[12];    // reclamation & abandonment ($MM)
            inputData[13] = 21;          //reclAbadonBeginYr= inputData[13];    // rec. & abandonment begin (year)
            inputData[14] = 0.02;        //educationTax     = inputData[14];    // education tax  (percentage, %)
            inputData[15] = 0.30;        //incomeTax        = inputData[15];    // income tax  (percentage, %)
            //price
            inputData[16] = 30.00;       //hcPriceUSD        = inputData[16];     //hydrocarbon price ($ per Mscf or Boe)
            inputData[17] =  0.00;       //hcPriceEsc        = inputData[17];     //hydrocarbon price (percentage, %)
            //discount rate === weighted cost of capital === acceptatbale hurdle rate
            inputData[18] = 0.10;         //discountWACC      = inputData[18];     // WACC (percentage, %)
            //sustained capex (d & c)
            inputData[19] = 5.0;         //sustainDacUSD       = inputData[19];   //sustained capex for drilling and completion ($ per Mscf or Boe)
            inputData[20] = 4.0;         //sustainDacintYears  = inputData[20];   //sustained dac interval (years)
            inputData[21] = 1.0;         //peak design rate    = inputData[21];   //peak design prod. rate (MM scf/day or M boe/day)
            inputData[22] = 0.9;         //allow. capex deduc. = inputData[22];   //allowable capex deductions (percentage, %)
            inputData[23] = 5.0;         //tax holliday years  = inputData[23];   //tax holliday years (years)
            inputData[24] = 25.0;        //project life        = inputData[24];   //project life (years)
        }


        //---cost - capex
        var dacMMUSD            = inputData[0];     //drilling and completion ($MM)
        var dacTanPer           = inputData[1];     //percentage of drilling and completion that is tangible
        var facMMUSD            = inputData[2];     //facilities ($MM per peak rate in MMScf or M Boe)
        var eaFCMMUSD           = inputData[3];     //exploration & aqusition (finding cost) ($M)
        //----cost - opex
        var opexUSD             = inputData[4];     //operating cost ($ per Mscf or Boe)
        var opexEsc             = inputData[5];     //operating cost escalation (percentage, %)
        var drainAcre           = inputData[6];     //operating area of well = well drained area (acres)
        //----main fiscal terms (royalty, prod.severance, prod. Ad valorem (property tax), environmental tax/cost, reclamation & abandonment, education tax & income tax)
        var royalty             = inputData[7];     // royalty (percentage, %)
        var prodSeverance       = inputData[8];     // prod.severance (percentage, %)
        var prodAdValTax        = inputData[9];     // prod. Ad valorem /property tax ($ per acre) = annual lease service (maintenance) Fee [Prop.Tax] ($/Acre) = 2.38 => For viscous reservoir
        var waterFeeUSD         = inputData[10];    // water fee (USD per year)
        var envCostUSD          = inputData[11];    // environmental tax/cost ($ per Mscf or Boe)
        var reclAbadonMMUSD     = inputData[12];    // reclamation & abandonment ($MM)
        var reclAbadonBeginYr   = inputData[13];    // rec. & abandonment begin (year)
        var educationTax        = inputData[14];    // education tax (percentage, %)
        var incomeTax           = inputData[15];    // income tax  (percentage, %)
        //----other inputs (1)
        //price
        var hcPriceUSD          = inputData[16];     //hydrocarbon price ($ per Mscf or Boe)
        var hcPriceEsc          = inputData[17];     //hydrocarbon price (percentage, %)
        //discount rate === weighted cost of capital === acceptatbale hurdle rate (%)
        var discountWACC        = inputData[18];

        //sustained capex (d & c)
        var sustainDacUSD       = inputData[19];     //??sustained capex for drilling and completion ($ per Mscf or Boe)
        var sustainDacintYears  = inputData[20];     //??sustained dac interval (years)
        //peak design rate (max. capacity)
        var peakRate            = inputData[21];     //peak design rate    = inputData[21];   //peak design prod. rate (MM scf/day or M boe/day)
        //---- other fiscal terms
        //% of capex allowed to be deducted
        var capexAllowable      = inputData[22];     //allow. capex deduc. = inputData[22];   //allowable capex deductions (percentage, %)
        //Tax holliday years, if any
        var taxHollYrs          = inputData[23];     //tax holliday years  = inputData[23];   //tax holliday years (years)
        //----other inputs (2)
        //project duration
        var projectLifeYrs      = inputData[24];     //project life        = inputData[24];   //project life (years)
        //start proper computations
        var tim     = [];
        var cum     = [];
        var grossYr = [];


        for(var i = 1; i < (projectLifeYrs+1); i++)         //25 years project
        {
           tim[i]     = i;                  //years
           cum[i]     = i * 1000 * 365;     //(M scf or Boe)
           grossYr[i] = 1000 * 365;         //(M scf or Boe)
        }

        //NOTE: actual production function later
        //tim     = prodFunction[0];
        //cum     = prodFunction[1];
        //grossYr = prodFunction[2];
        //note: production function data point should be yearly  (i.e. years 0, 1, 2, 3...n)
        //    : Re-format production function to conform to this when sending data in for economic analysis.
        var time         = [] = tim;                 // time     (years)
        var cumProd      = [] = cum;                 // cum prod (M scf or Boe)
        var grossYrProd  = [] = grossYr;             // gross yearly prod (M scf or Boe)
        //economic function table (EFT) length
        var EFTLen = time.length;


        //for counting "sustained capex interval"
        var susCount;
        var susCountLength = EFTLen-1;


        //columns in economic function table (EFT)
        var EFT0  = []; var EFTx   = []; var EFT1  = []; var EFT2  = []; var EFT3  = [];
        var EFT4  = []; var EFT5   = []; var EFT6  = []; var EFT7  = []; var EFT8  = [];
        var EFT9  = []; var EFT10  = []; var EFT11 = []; var EFT12 = []; var EFT13 = [];
        var EFT14 = []; var EFT15x = []; var EFT15 = []; var EFT16 = []; var EFT17 = [];
        var EFT18 = []; var EFT19  = []; var EFT20 = []; var EFT21 = []; var EFT22 = [];
        var EFT23 = []; var EFT24  = []; var EFT25 = []; var EFT26 = []; var EFT27 = [];
        var EFT28 = [];

        //initiate all sunstained capex to zero
        for(var i = 1; i < (projectLifeYrs+1) ; i++)   //25 years project
        {
           EFT11[i]     = 0;
           EFT12[i]     = 0;
        }


        function tightEconomics()
        {
            //target: ti0 gr1 ne2 pr3 nr4
            for(var i = 0; i < EFTLen; i++)
            {

                if(i === 0)
                {
                     // this is year = 0
                     EFT0[i]  = 0;
                     EFTx[i]  = 0;
                     EFT1[i]  = 0;
                     EFT2[i]  = 0;
                     EFT3[i]  = 0;
                     EFT4[i]  = 0;
                     EFT5[i]  = 0;
                     EFT6[i]  = 0;
                     EFT7[i]  = 0;

                     // capex (M$) = c1a = drilling & compl. (DC) + facilities - both tangible
                     EFT8[i]  = ( (dacMMUSD + facMMUSD*peakRate*1000) * 1000 * dacTanPer );

                     // capex (M$) = c1b = intangible
                     EFT9[i]  = ( (dacMMUSD + facMMUSD*peakRate*1000) * 1000 * (1-dacTanPer) );

                     // exploration & aqusition (finding cost) (M$)
                     EFT10[i] = eaFCMMUSD * 1000;

                     EFT11[i] = 0;
                     EFT12[i] = 0;
                     EFT13[i] = 0;
                     EFT14[i] = 0;
                     EFT15x[i] = EFT8[i] + EFT9[i] + EFT10[i] + EFT11[i] + EFT12[i] + EFT13[i] + EFT14[i];                       // total capex ($ M )
                     EFT15[i] = capexAllowable * (EFT8[i] + EFT9[i] + EFT10[i] + EFT11[i] + EFT12[i] + EFT13[i] + EFT14[i]);    // total capex allowable for deductions ($ M)
                     EFT16[i] = EFT4[i] - EFT6[i] - EFT15[i];                                                 // NCF (net cash flow) before income tax + edu. tax ($ M )
                     EFT17[i] = EFT16[i];                                                                     // cumulative NCF before income tax + edu. tax ($ M )
                     EFT18[i] = 0;                                                                            // income tax ($ M )
                     EFT19[i] = 0;                                                                            // education tax ($ M )
                     EFT20[i] = EFT16[i]  - EFT18[i] - EFT19[i];                                              // NCF (net cash flow) after income + educ.  taxes ($ M )
                     EFT21[i] = EFT20[i];                                                                     // PV = cumulative NCF after income + educ. taxes = present value ($ M )
                     EFT22[i] = (1 / ( Math.pow((1 + discountWACC), EFT0[i]) ) );                             // discount rate
                     EFT23[i] = EFT20[i] *  EFT22[i];                                                         // discounted NCF (net cash flow) after income + educ.  taxes ($ M )
                     EFT24[i] = EFT23[i];                                                                     // NPV = discounted cumulative NCF after income + educ.  taxes = net present value ($ M )
                     //EFT25
                     EFT26[i] = 0;                                                                            // undiscounted IRR = internal rate of return (% or fraction)
                     EFT27[i] = 0;                                                                            // discounted IRR (% or fraction)
                     EFT28[i] = 0;                                                                            // VIR/PI = value investment ratio/profitability index or indicator (ratio)
                }

                // this is year > 0
                if(i > 0)
                {

                    // ti0 gr1 ne2 pr3 nr4
                    //time
                    EFT0[i]  = time[i];                                             //time
                    //hc volume
                    EFTx[i]  = cumProd[i];                                          //cumul. gross hydrocarbon [hc] (M scf or Boe)
                    EFT1[i]  = grossYrProd[i];                                      //yearly gross hydrocarbon [hc] (M scf or Boe)
                    EFT2[i]  = EFT1[i] * (1 - royalty);                             //yearly net   hydrocarbon [hc] (M scf or Boe)
                    if(i === 1){EFT3[i]  = hcPriceUSD * (1 + 0);}                   //hc price ($/ Mscf or Boe)
                    if(i > 1  ){EFT3[i]  = EFT3[i-1]  * (1 + hcPriceEsc);}          //hc price ($/ Mscf or Boe)
                    //operation/operating revenue & associated cost
                    EFT4[i]  = Math.round(EFT2[i] * EFT3[i] / 1000);                //net revenue (M$) = thousands dollars, not million (MM$)
                    if(i === 1){EFT5[i]  = opexUSD    * (1 + 0);}                   //operating cost ($/M scf)
                    if(i > 1  ){EFT5[i]  = EFT5[i-1]  * (1 + opexEsc);}             //operating cost ($/M scf)
                    EFT6[i]  = (EFT5[i]*EFT1[i])/1000 + EFT4[i]*prodSeverance + (prodAdValTax*drainAcre/1000 + waterFeeUSD/1000);    // operating costs + Prod. Taxes + Property Taxes ($M)
                    EFT7[i]  = EFT4[i] - EFT6[i];                                   // Op. NCF BITDA  = Op. Net Cash Flow BITDA (BITDA - Before interest, taxes (income), depreciation and amortization)
                    //************capex starts*************************************************************************************
                    //capitalized cost (capex) amortization & deprecia. (depletion allownace)
                    //if(i === 0){EFT8[i]  = ((dacMMUSD + facMMUSD*peakRate) / 1000 * dacTanPer);}           // capex (M$) = c1a = drilling & compl. (DC) + facilities - both tangible
                    EFT8[i]  = 0;                                                                            // capex (M$) = c1a = drilling & compl. (DC) + facilities - both tangible
                    //if(i === 0){EFT9[i]  = ((dacMMUSD + facMMUSD*peakRate) / 1000 * (1-dacTanPer));}       // capex (M$) = c1b = intangible
                    EFT9[i]  = 0;                                                                            // capex (M$) = c1b = intangible
                    //if(i === 0){EFT10[i] = eaFCMMUSD * 1000;};                                             // exploration & aqusition (finding cost) (M$)
                    EFT10[i] = 0;                                                                            // exploration & aqusition (finding cost) (M$)
                    //sustained capex every "sustainDacintYears"
                    susCount = sustainDacintYears * i;


                    if(i < susCountLength && susCount < susCountLength) //happen as i = sustainDacintYears *1 , * 2, *3, etc.
                    {
                        EFT11[susCount]  = ((sustainDacUSD*EFT1[i]) * dacTanPer)/1000;                        // sustained capex (M$) = c1a = drilling & compl. (DC) + facilities - both tangible
                        EFT12[susCount]  = ((sustainDacUSD*EFT1[i]) * (1-dacTanPer))/1000;                    // sustanined capex(M$) = c1b = intangible
                    }


                    //last 3 years of project: abandonment & reclaimation cost ($M)
                    //project life must be last at least 5 years
                    if(i < EFTLen  - 3){EFT13[i]  = 0;}                                                      // abandonment & reclaimation cost ($M)
                    else{EFT13[i]  = reclAbadonMMUSD*1000/3;};                                               // abandonment & reclaimation cost ($M)
                    EFT14[i] = envCostUSD * EFT2[i]/1000;                                                    // environmental cost ($ M )
                    //************capex ends**************************************************************************************
                    EFT15x[i] = EFT8[i] + EFT9[i] + EFT10[i] + EFT11[i] + EFT12[i] + EFT13[i] + EFT14[i];                      // total capex ($ M )
                    EFT15[i] = capexAllowable * (EFT8[i] + EFT9[i] + EFT10[i] + EFT11[i] + EFT12[i] + EFT13[i] + EFT14[i]);    // total capex allowable ($ M)
                    EFT16[i] = EFT4[i] - EFT6[i] - EFT15[i];                                                 // NCF (net cash flow) before income tax + edu. tax ($ M )
                    //if(i === 0){EFT17[i] = EFT16[i];}                                                      // cumulative NCF before income tax + edu. tax ($ M )
                    EFT17[i] = EFT17[i-1] + EFT16[i];                                                        // cumulative NCF before income tax + edu. tax ($ M )
                    if(i <  taxHollYrs+1){EFT18[i] = 0 * EFT16[i]; }                                         // income tax ($ M )
                    if(i >= taxHollYrs+1){EFT18[i] = incomeTax * EFT16[i]; }                                 // income tax ($ M )
                    EFT19[i] = educationTax * EFT18[i];                                                      // education tax ($ M )
                    EFT20[i] = EFT16[i]  - EFT18[i] - EFT19[i];                                              // NCF (net cash flow) after income + educ.  taxes ($ M )
                    EFT21[i] = EFT20[i]  + EFT21[i-1];                                                       // PV = cumulative NCF after income + educ. taxes = present value ($ M )
                    EFT22[i] = (1 / ( Math.pow((1 + discountWACC), EFT0[i]) ) );                             // discount rate
                    EFT23[i] = EFT20[i] *  EFT22[i];                                                         // discounted NCF (net cash flow) after income + educ.  taxes ($ M )
                    EFT24[i] = EFT24[i-1] +  EFT23[i];                                                       // NPV = discounted cumulative NCF after income + educ.  taxes = net present value ($ M )
                    //EFT25
                    ///* using addons methods (V8 or NAPI)
                    EFT26[i] = addonEco.IRR(EFT21);                                                           // undiscounted IRR = internal rate of return (% or fraction)
                    EFT27[i] = addonEco.IRR(EFT24);                                                           // discounted IRR (% or fraction)
                    EFT28[i] = EFT24[i]/addonEco.maximumOfDoubleArrayValues(EFT15);                           // VIR/PI = value investment ratio/profitability index or indicator (ratio)
                }

            }

        }


        function viscousEconomics()
        {
            //pending
        }


        switch(reservoirType)
        {
            case ("tight"):   //tight reservoir
                tightEconomics();

                break;

            case ("viscous"): //viscous reservoir
                viscousEconomics();
                break;
        }


        //economic function table: create an Array object (i.e. a table) to hold all the economic outputs
        var EFT = [];


        //populate the economic function table & format into smaller decimal places to reduce bytes
        //also convert all Typed Arrays to regular Arrays
        var fDM4 = 4; //decimal places formatting option
        var fDM2 = 2; //decimal places formatting option
        EFT[0]   = numberArrayDecimal(EFT0, fDM2);  //- 1 - time
        EFT[26]  = numberArrayDecimal(EFTx, fDM4);  //cum gross hc
        EFT[1]   = numberArrayDecimal(EFT1, fDM4);  //yearly gross prod
        EFT[2]   = numberArrayDecimal(EFT2, fDM4);  //yearly net hc
        EFT[3]   = numberArrayDecimal(EFT3, fDM4);  //hc price
        EFT[4]   = numberArrayDecimal(EFT4, fDM4);  //- 2a - net revenue
        EFT[5]   = numberArrayDecimal(EFT5, fDM4);  //- 2b -opex
        EFT[6]   = numberArrayDecimal(EFT6, fDM4);
        EFT[7]   = numberArrayDecimal(EFT7, fDM4);  //- 3 - NCF BITDA  = Op. Net Cash Flow BITDA
        EFT[8]   = numberArrayDecimal(EFT8, fDM4);
        EFT[9]   = numberArrayDecimal(EFT9, fDM4);
        EFT[10]  = numberArrayDecimal(EFT10, fDM4);
        EFT[11]  = numberArrayDecimal(EFT11, fDM4);
        EFT[12]  = numberArrayDecimal(EFT12, fDM4);
        EFT[13]  = numberArrayDecimal(EFT13, fDM4);
        EFT[14]  = numberArrayDecimal(EFT14, fDM4);
        EFT[15]  = numberArrayDecimal(EFT15x,fDM4); // - 4i   - capex
        EFT[16]  = numberArrayDecimal(EFT15, fDM4); // - 5    - allowable capex for deductions
        EFT[17]  = numberArrayDecimal(EFT16, fDM4); // - ?    - NCF (net cash flow) before income tax + edu. tax ($ M ) but after depreciation and amort.
        EFT[18]  = numberArrayDecimal(EFT17, fDM4); // - 6ii  - cumulative NCF before income tax + edu. tax ($ M )
        EFT[19]  = numberArrayDecimal(EFT18, fDM4); // - 7iii - income tax ($ M )
        EFT[20]  = numberArrayDecimal(EFT19, fDM4); // - 8iv  - education tax ($ M )
        EFT[21]  = numberArrayDecimal(EFT20, fDM4); // - 9v   - NCF (net cash flow) after income + educ.  taxes ($ M ) + depr/amort
        EFT[22]  = numberArrayDecimal(EFT21, fDM4); // - 10x  - PV = cumulative NCF after income + educ. taxes = present value ($ M
        EFT[23]  = numberArrayDecimal(EFT22, fDM4); // - ?    - discount rate
        EFT[24]  = numberArrayDecimal(EFT23, fDM4); // - ?    - discounted NCF (net cash flow) after income + educ.  taxes ($ M )
        EFT[25]  = numberArrayDecimal(EFT24, fDM4); // - 11y  - NPV = discounted cumulative NCF after income + educ.  taxes = net present value ($ M )
        //ETF[26]= numberArrayDecimal(EFTx, fDM4);  // - ?    - cum gross hc
        EFT[27]  = numberArrayDecimal(EFT26, fDM4); // - 12j  - undiscounted IRR
        EFT[28]  = numberArrayDecimal(EFT27, fDM4); // - 13k  - discounted   IRR
        EFT[29]  = numberArrayDecimal(EFT28, fDM4); // - 14l  - VIR/PI
        
        //3 figures require for plots
        //1 - cash flow vs time   (net revenue-2a, PV-10x and NPV-discounted PV-11y)
        //2 - cash flow break out (capex-4i, opex-2b, education tax-8iv, income tax-7iii, NCF retained - AITDA-9v)
        //3 - profitability indicator (undis. IRR-12j, discounted IRR-13k and VIR/PI-14l)
        //print economic results
        printSummary(addonEcotertURPPS, EFT, EFTLen, EFT21, EFT24, EFT26, EFT27, EFT28, discountWACC);


        //return the economics table to enable accessibility and printout
        return EFT;
    }


    //export all prototype functions on main
    module.exports = main;

    //return constructor to make all properties associated with it PUBLIC
    return main;

}());
