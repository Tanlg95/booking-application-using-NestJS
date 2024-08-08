import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class XmlService {

     
    async getPaymentDocXml(confirmation_no : number)
    {  
        // get all files in xml folder
        const respone = fs.readdirSync('./xml/',{encoding: 'utf-8'});

        let xmlParseString = undefined;
        let readFile = undefined;
        let path_xml = undefined;
        let xmlToString = undefined;
        // list valid doc 
        const listDocument = [];
        // list unvalid doc ( syntax error )
        const listDocumentFail = [];
        for (let ele of respone)
        {
            try {
                // get path 
                path_xml = `./xml/${ele}`;
                // read file
                readFile = fs.readFileSync(path_xml,{encoding: 'utf-8'});
                // parse string xml
                xmlParseString = await xml2js.parseStringPromise(readFile);
                xmlToString = JSON.stringify(xmlParseString);
                // push it to valid doc array
                listDocument.push(xmlToString);
            } catch {
                // push it to unvalid doc array
                listDocumentFail.push(path_xml);
                continue;
            }
        }
        // filter confirmation_no
        const result = listDocument.filter( ele => ele.includes(confirmation_no.toString()))[0];
        // cast XML to JSON
        return this.xmlToJson(xmlToString, JSON.parse(result));
    }      

    async xmlToJson(checkJson : string, pool : JSON)
    {
        function checkExistsFieldJson(listField : Array<string>)
        {
            //const listUnmatch = [];
            // the length of list words
            const N = listField.length;
            // the number of total matching words
            const totalMatched = listField.reduce((val, curr) =>{
                if(checkJson.includes(curr))
                {
                    val ++;
                }
                // else{
                //     listUnmatch.push(curr);
                // }
                return val;
            },0)
            if(N === totalMatched)
            return true;
                return false;
        }
        
        // list of matching words 
        const checkExists_confirmation_no = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:UniqueIDList", "c:UniqueID", "_"];
        const checkExists_resv_name_id = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:UniqueIDList", "c:UniqueID", "_"];
        const checkExists_arrival = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:ResGuests", "r:ResGuest", "r:ArrivalTransport", "$", "time"];
        const checkExists_departure = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:ResGuests", "r:ResGuest", "r:DepartureTransport", "$", "time"];
        const checkExists_roomType = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:RoomStays", "hc:RoomStay", "hc:RoomTypes","hc:RoomType", "$", "roomTypeCode"];
        const checkExists_ratecode = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:RoomStays", "hc:RoomStay", "hc:RatePlans", "hc:RatePlan", "$", "ratePlanCode"];
        const checkExists_amount = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:RoomStays", "hc:RoomStay", "hc:RoomRates", "hc:RoomRate", "hc:Rates", "hc:Rate", "hc:Base", "_"];
        const checkExists_currency = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:RoomStays", "hc:RoomStay", "hc:RoomRates", "hc:RoomRate", "hc:Rates", "hc:Rate", "hc:Base", "$", "currencyCode"];
        const checkExists_guarantee = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:RoomStays", "hc:RoomStay", "hc:Guarantee", "$", "guaranteeType"];
        const checkExists_method_payment = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:ReservationPayments", "r:ReservationPaymentInfo", "$", "PaymentType"];
        const checkExists_computed_resv_status = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "$", "computedReservationStatus"];
        const checkExists_last_name = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:ResGuests", "r:ResGuest", "r:Profiles", "Profile", "Customer", "PersonName", "c:lastName"];
        const checkExists_first_name = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:ResGuests", "r:ResGuest", "r:Profiles", "Profile", "Customer", "PersonName", "c:firstName"];
        const checkExists_title = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:ResGuests", "r:ResGuest", "r:Profiles", "Profile", "Customer", "PersonName", "c:nameTitle"];
        const checkExists_booking_balance = ["soap:Envelope", "soap:Body", "FetchBookingResponse", "HotelReservation", "r:RoomStays", "hc:RoomStay", "hc:CurrentBalance", "_"];
        const checkExists_created_date = ["soap:Envelope", "soap:Header", "OGHeader", "$", "timeStamp"];
        // console.log(`check: ${checkExistsFieldJson(checkExists_roomType).unmatch}`)

        const final_json = {
            confirmation_no:(checkExistsFieldJson(checkExists_confirmation_no)) ?  pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:UniqueIDList"][0]["c:UniqueID"][0]["_"] : null,
            resv_name_id:(checkExistsFieldJson(checkExists_resv_name_id)) ?  pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:UniqueIDList"][0]["c:UniqueID"][1]["_"] : null,
            arrival: (checkExistsFieldJson(checkExists_arrival)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:ResGuests"][0]["r:ResGuest"][0]["r:ArrivalTransport"][0]["$"]["time"] : null,
            departure: (checkExistsFieldJson(checkExists_departure)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:ResGuests"][0]["r:ResGuest"][0]["r:DepartureTransport"][0]["$"]["time"] : null,
            adults: 4,
            children: 0,
            roomtype: (checkExistsFieldJson(checkExists_roomType)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:RoomStays"][0]["hc:RoomStay"][0]["hc:RoomTypes"][0]["hc:RoomType"][0]["$"]["roomTypeCode"]  : null,
            ratecode: (checkExistsFieldJson(checkExists_ratecode)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:RoomStays"][0]["hc:RoomStay"][0]["hc:RatePlans"][0]["hc:RatePlan"][0]["$"]["ratePlanCode"] : null,
            rateamount: {
                amount: (checkExistsFieldJson(checkExists_amount)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:RoomStays"][0]["hc:RoomStay"][0]["hc:RoomRates"][0]["hc:RoomRate"][0]["hc:Rates"][0]["hc:Rate"][0]["hc:Base"][0]["_"] : null,
                currency: (checkExistsFieldJson(checkExists_currency)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:RoomStays"][0]["hc:RoomStay"][0]["hc:RoomRates"][0]["hc:RoomRate"][0]["hc:Rates"][0]["hc:Rate"][0]["hc:Base"][0]["$"]["currencyCode"] : null
            },
            guarantee: (checkExistsFieldJson(checkExists_guarantee)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:RoomStays"][0]["hc:RoomStay"][0]["hc:Guarantee"][0]["$"]["guaranteeType"] : null,
            method_payment: (checkExistsFieldJson(checkExists_method_payment)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:ReservationPayments"][0]["r:ReservationPaymentInfo"][0]["$"]["PaymentType"] : null,
            computed_resv_status: (checkExistsFieldJson(checkExists_computed_resv_status)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["$"]["computedReservationStatus"] : null,
            last_name: (checkExistsFieldJson(checkExists_last_name)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:ResGuests"][0]["r:ResGuest"][0]["r:Profiles"][0]["Profile"][0]["Customer"][0]["PersonName"][0]["c:lastName"][0] : null,
            first_name: (checkExistsFieldJson(checkExists_first_name)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:ResGuests"][0]["r:ResGuest"][0]["r:Profiles"][0]["Profile"][0]["Customer"][0]["PersonName"][0]["c:firstName"][0] : null,
            title: (checkExistsFieldJson(checkExists_title)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:ResGuests"][0]["r:ResGuest"][0]["r:Profiles"][0]["Profile"][0]["Customer"][0]["PersonName"][0]["c:nameTitle"][0] : null,
            phone_number: "+84123456789",
            email: "test@email.com",
            booking_balance: (checkExistsFieldJson(checkExists_booking_balance)) ? pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:RoomStays"][0]["hc:RoomStay"][0]["hc:CurrentBalance"][0]["_"] : null,
            booking_created_date: (checkExistsFieldJson(checkExists_created_date)) ?  pool["soap:Envelope"]["soap:Header"][0]["OGHeader"][0]["$"]["timeStamp"] : null
        }
        /* for testing:
        return {
            json: pool["soap:Envelope"]["soap:Body"][0]["FetchBookingResponse"][0]["HotelReservation"][0]["r:RoomStays"][0]["hc:RoomStay"][0],
            jsonF: firnal_json,
            textFile: checkJson
        }
        */
        return final_json;
    }
}
