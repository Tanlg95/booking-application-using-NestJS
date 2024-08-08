import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { XmlService } from 'src/support/file-format/xml/xml.service';
import { md5 } from 'js-md5';
import * as fd from 'form-data';

@Injectable()
export class PaymentService {
    constructor( private xmlService: XmlService){}
    private orderURL : string = process.env.ORDER_URL;

    // create order

    async createOrder (confirmation_no : number)
    {
        const payload = await this.xmlService.getPaymentDocXml(confirmation_no);
       
        const merchant_passcode = process.env.MERCHANT_PASSCODE;
        const request = {
            function: "CreateOrder",
            merchant_site_code: process.env.MERCHANT_SITE_CODE,
            order_code: payload.confirmation_no,
            order_description: '',
            amount: Number(payload.rateamount.amount),
            currency: payload.rateamount.currency,
            buyer_fullname: ((!(payload.first_name))? 'unknow_f' : payload.first_name) + ' ' + ((!(payload.last_name))? 'unknow_l' : payload.last_name),
            buyer_email: (!(payload.email)) ? 'checkOrder@gmail.com' : payload.email,
            buyer_mobile: (!(payload.phone_number)) ? '0887887767' : payload.phone_number,
            buyer_address: 'TPHCM',
            return_url: 'localhost:3000/payment-success',
            cancel_url: 'localhost:3000/payment-fail',
            notify_url: '',
            language: 'vi',
            version: '',
            payment_method_code: '',
            bank_code: '',
        }
        const from_data = new fd();
        from_data.append('function', request.function);
        from_data.append('merchant_site_code', request.merchant_site_code);
        from_data.append('order_code', request.order_code);
        from_data.append('order_description', request.order_description);
        from_data.append('amount', request.amount);
        from_data.append('currency', request.currency);
        from_data.append('buyer_fullname', request.buyer_fullname);
        from_data.append('buyer_email', request.buyer_email);
        from_data.append('buyer_mobile', request.buyer_mobile);
        from_data.append('buyer_address', request.buyer_address);
        from_data.append('return_url', request.return_url);
        from_data.append('cancel_url', request.cancel_url);
        from_data.append('notify_url',request.notify_url);
        from_data.append('language', request.language);
        from_data.append('version', request.version);
        from_data.append('payment_method_code', request.payment_method_code);
        from_data.append('bank_code', request.bank_code);
        from_data.append('checksum',
            md5(request.merchant_site_code + '|' + request.order_code + '|' +
                request.order_description + '|' + request.amount + '|' + request.currency +
            '|'
            + request.buyer_fullname + '|' + request.buyer_email + '|' +
            request.buyer_mobile + '|' + request.buyer_address + '|' + request.return_url
            + '|' + request.cancel_url + '|' + request.notify_url + '|' + request.language +
            '|' + merchant_passcode)
        );
        const pool = await axios({
            method: "post",
            url: this.orderURL,
            data: from_data,
            headers: { "Content-Type": "multipart/form-data" },
          })
        return pool.data;
    }

    // check order

     async checkOrder(payload)
     {
        const  merchant_passcode = process.env.MERCHANT_PASSCODE;
        const request = {
            function: payload.function,
            merchant_site_code: process.env.MERCHANT_SITE_CODE,
            token_code: payload.token_code
        }
        // console.log(request);
        const from_data = new fd();
        from_data.append('function', request.function);
        from_data.append('merchant_site_code', request.merchant_site_code);
        from_data.append('token_code', request.token_code);
        from_data.append('checksum',
            md5(request.merchant_site_code + '|' + request.token_code + '|' +
                merchant_passcode )
        );
        const pool = await axios({
            method: "post",
            url: this.orderURL,
            data: from_data,
            headers: { "Content-Type": "multipart/form-data" },
          })
        return pool.data;
     }

    // get bank list

     async getBank(payload)
     {
        const  merchant_passcode = process.env.MERCHANT_PASSCODE;
        const request = {
            function: payload.function,
            merchant_site_code: process.env.MERCHANT_SITE_CODE,
        }
        // console.log(request);
        const from_data = new fd();
        from_data.append('function', request.function);
        from_data.append('merchant_site_code', request.merchant_site_code);
        from_data.append('checksum',
            md5(request.merchant_site_code + '|' +
                merchant_passcode )
        );
        
        const pool = await axios({
            method: "post",
            url: this.orderURL,
            data: from_data,
            headers: { "Content-Type": "multipart/form-data" },
          })
        return pool.data;
     }

}
