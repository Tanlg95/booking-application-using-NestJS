import { Body, Controller, Get , Next, Post, Query, Response, UseGuards} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentService } from './payment.service';
import { map } from 'rxjs';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/support/guards/accessToken.guard';
import { md5 } from 'js-md5';
import * as fd from 'form-data';
import axios from 'axios';

@Controller('payment')
export class PaymentController {
    constructor( 
            private paymentService: PaymentService,
           // private httpService: HttpService
    ){}

    // create order

    @ApiTags('Payment operations')
    @Post()
    @ApiOperation({summary:"create order", description:`

            /*  from-data send to the order payment gate (demo vietcombank) */


                function:{ type:"string", example: "CreateOrder",  },
                merchant_site_code:{ type:"string", example: "7",  },
                order_code:{ type:"string", example: "OD43248239",  },
                order_description:{ type:"string", example: "",  },
                amount:{ type:"number", example: 2500000,  },
                currency:{ type:"string", example: "VND",  },
                buyer_fullname:{ type:"string", example: "daniel chung",  },
                buyer_email:{ type:"string", example: "daniel@gmail.com",  },
                buyer_mobile:{ type:"string", example: "099884732",  },
                buyer_address:{ type:"string", example: "TPHCM",  },
                return_url:{ type:"string", example: "localhost:3000/payment-success",  },
                cancel_url:{ type:"string", example: "localhost:3000/payment-fail",  },
                notify_url:{ type:"string", example: "",  },
                language:{ type:"string", example: "vi",  },
                version:{ type:"string", example: "",  },
                payment_method_code:{ type:"string", example: "",  },
                bank_code:{ type:"string", example: "",  },
                checksum:{ type:"string", example: "jdfibedfghwoihefkjwenfwfwefwe", description: "
                        checksum = MD5(
                                    merchant_site_code + '|' + order_code + '|' +
                                    order_description + '|' + amount + '|' + currency +
                                    '|'
                                    + buyer_fullname + '|' + buyer_email + '|' +
                                    buyer_mobile + '|' + buyer_address + '|' + return_url
                                    + '|' + cancel_url + '|' + notify_url + '|' + language +
                                    '|' + merchant_passcode)
                    "  }
        `})
    // @ApiBody({
    //     schema:{
    //         type:"object",
    //         properties:{
    //             function:{ type:"string", example: "CreateOrder",  },
    //             merchant_site_code:{ type:"string", example: "7",  },
    //             order_code:{ type:"string", example: "OD43248239",  },
    //             order_description:{ type:"string", example: "",  },
    //             amount:{ type:"number", example: 2500000,  },
    //             currency:{ type:"string", example: "VND",  },
    //             buyer_fullname:{ type:"string", example: "daniel chung",  },
    //             buyer_email:{ type:"string", example: "daniel@gmail.com",  },
    //             buyer_mobile:{ type:"string", example: "099884732",  },
    //             buyer_address:{ type:"string", example: "TPHCM",  },
    //             return_url:{ type:"string", example: "localhost:3000/payment/payment-success",  },
    //             cancel_url:{ type:"string", example: "localhost:3000/payment/payment-fail",  },
    //             notify_url:{ type:"string", example: "",  },
    //             language:{ type:"string", example: "vi",  },
    //             version:{ type:"string", example: "",  },
    //             payment_method_code:{ type:"string", example: "",  },
    //             bank_code:{ type:"string", example: "",  },
    //             checksum:{ type:"string", example: "jdfibedfghwoihefkjwenfwfwefwe", description: `
    //                     checksum = MD5(
    //                                 merchant_site_code + '|' + order_code + '|' +
    //                                 order_description + '|' + amount + '|' + currency +
    //                                 '|'
    //                                 + buyer_fullname + '|' + buyer_email + '|' +
    //                                 buyer_mobile + '|' + buyer_address + '|' + return_url
    //                                 + '|' + cancel_url + '|' + notify_url + '|' + language +
    //                                 '|' + merchant_passcode)
    //                 `  }
    //         }
    //     }
    // })
    @ApiResponse({ status: 200, description: "Ok",
        schema:{
            type:"object",
            properties:{
                result_code:{
                    type:"string",
                    example: "0000",
                    description: "status respone (id)"
                },
                result_data_checkout_url:{
                    type:"string",
                    example: "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/version_1/index/177124-CO1232117C00?method_code=ATM-CARD",
                      description: "payment link"
                },
                result_data_token_code:{
                    type:"string",
                    example: "177124-CO1232117C00",
                    description: "The unique token of the payment order, this token will be used in the CheckOrder API to get the order status on the payment gateway"
                },
                result_message:{
                    type:"string",
                    example: "Success",
                    description: "status respone (description)"
                }
            }
        }
    })
    @ApiResponse({ status: 500, description: "Internal server error" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    async paymentCreate(@Query('confirmation_no') confirmation_no : number)
    {
        const respone = await this.paymentService.createOrder(confirmation_no);
        return respone;
    }

    // check order

    @ApiTags('Payment operations')
    @ApiOperation({summary:"check order", description:`

        /*  body-JSON send to the order payment gate (demo vietcombank) to check order */

            {
                "function":"CheckOrder", // default "CheckOrder"
                "merchant_site_code":"7", // depend on your site code
                "token_code":"177149-COD918026438" // depend on your token that was created during the order operation
            }
        /* JSON respone */
        {
            "result_code": "0000",
            "result_data": {
                "token_code": "177149-COD918026438",
                "version": "1.0",
                "order_code": "HAUEW924324",
                "order_description": "",
                "amount": "2300000",
                "sender_fee": 2400,
                "receiver_fee": 0,
                "currency": "VND",
                "return_url": "localhost:3000/user/getAll",
                "cancel_url": "localhost:3000/user/getAll",
                "notify_url": "",
                "status": 3,
                "payment_method_code": "EXB-ATM-CARD",
                "payment_method_name": "Thanh toán bằng thẻ ATM ngân hàng Eximbank",
                "message": "Đã thanh toán",
                "message_error": ""
            },
            "result_message": "Success"
        }
    `})
    @ApiBody({
        schema:{
            type:"object",
            required:["function", "merchant_site_code", "token_code"],
            properties:{
                function:{ type:"string", example:"CheckOrder" },
                merchant_site_code: { type:"String", example:"7"},
                token_code: {type:"string", example:"177149-COD918026438"}
            }
        }
    })
    @ApiResponse({ status: 200, description: "Ok", })
    @ApiResponse({ status: 500, description: "Internal server error" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    @Post('checkOrder')
    async paymentCheckOrder(@Body() payload : any)
    {
        const respone = await this.paymentService.checkOrder(payload);
        return respone;
    }

    // get bank list

    @ApiOperation({summary:"get bank list", description:`

        /*  body-JSON send to the order payment gate (demo vietcombank) to get bank list */

            {
                "function": "GetBanks",
                "merchant_site_code": "7"
            }

        /*  JSON respone */
        {
            "result_code": "0000",
            "result_data": {
                "ATM-CARD": [
                    {
                        "code": "VCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VCB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng Vietcombank"
                    },
                    {
                        "code": "EXB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/EXB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng Eximbank"
                    },
                    {
                        "code": "ACB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/ACB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng ACB"
                    },
                    {
                        "code": "TCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/TCB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng Techcombank"
                    },
                    {
                        "code": "ICB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/ICB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng Vietinbank"
                    },
                    {
                        "code": "AGB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/AGB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  AGB"
                    },
                    {
                        "code": "BAB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/BAB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  BAB"
                    },
                    {
                        "code": "BIDV",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/BIDV.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  BIDV"
                    },
                    {
                        "code": "MSB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/MSB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  MSB"
                    },
                    {
                        "code": "STB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/STB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  STB"
                    },
                    {
                        "code": "SGB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/SGB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  SGB"
                    },
                    {
                        "code": "PGB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/PGB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  PGB"
                    },
                    {
                        "code": "GPB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/GPB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  GPB"
                    },
                    {
                        "code": "TPB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/TPB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  TPB"
                    },
                    {
                        "code": "VAB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VAB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  VAB"
                    },
                    {
                        "code": "VIB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VIB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  VIB"
                    },
                    {
                        "code": "DAB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/DAB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  DAB"
                    },
                    {
                        "code": "MB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/MB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  MB"
                    },
                    {
                        "code": "HDB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/HDB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  HDB"
                    },
                    {
                        "code": "VPB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VPB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  VPB"
                    },
                    {
                        "code": "OJB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/OJB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  OJB"
                    },
                    {
                        "code": "SHB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/SHB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  SHB"
                    },
                    {
                        "code": "NAB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/NAB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng  NAB"
                    },
                    {
                        "code": "PVCOMBANK",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/PVCOMBANK.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng PVcombank"
                    },
                    {
                        "code": "OCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/OCB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng OCB"
                    },
                    {
                        "code": "ABB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/ABB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng ABBank"
                    },
                    {
                        "code": "LVB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/LVB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng LienVietPostBank"
                    },
                    {
                        "code": "KLB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/KLB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng KienLong Bank"
                    },
                    {
                        "code": "GAB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/GAB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng DaiABank"
                    },
                    {
                        "code": "PBVN",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/PBVN.png",
                        "name": "Thanh toán bằng thẻ Public Bank"
                    },
                    {
                        "code": "SEA",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/SEA.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng SeABank"
                    },
                    {
                        "code": "SCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/SCB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng SCB"
                    },
                    {
                        "code": "NVB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/NVB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng Quốc Dân"
                    },
                    {
                        "code": "GDB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/GDB.png",
                        "name": "Thanh toán bằng thẻ ATM ngân hàng BVBank"
                    }
                ],
                "IB-ONLINE": [
                    {
                        "code": "VCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VCB.png",
                        "name": " Thanh toán bằng tài khoản Internet Banking Ngân hàng VCB"
                    },
                    {
                        "code": "BIDV",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/BIDV.png",
                        "name": " Thanh toán bằng tài khoản Internet Banking Ngân hàng BIDV"
                    },
                    {
                        "code": "TCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/TCB.png",
                        "name": " Thanh toán bằng tài khoản Internet Banking Ngân hàng TCB"
                    },
                    {
                        "code": "DAB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/DAB.png",
                        "name": " Thanh toán bằng tài khoản Internet Banking Ngân hàng DAB"
                    },
                    {
                        "code": "PVCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/PVCB.png",
                        "name": "Thanh toán bằng tài khoản Internet Banking Ngân hàng PVCombank"
                    },
                    {
                        "code": "ABB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/ABB.png",
                        "name": "Thanh toán bằng tài khoản Internet Banking Ngân hàng ABBank"
                    }
                ],
                "WALLET": [
                    {
                        "code": "NGANLUONG",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/NGANLUONG.png",
                        "name": "Thanh toán bằng ví điện tử NgânLượng.vn"
                    }
                ],
                "QR-CODE": [
                    {
                        "code": "VCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VCB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Vietcombank"
                    },
                    {
                        "code": "EXB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/EXB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Eximbank"
                    },
                    {
                        "code": "BIDV",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/BIDV.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng BIDV"
                    },
                    {
                        "code": "STB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/STB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Sacombank"
                    },
                    {
                        "code": "AGB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/AGB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Agribank"
                    },
                    {
                        "code": "BAB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/BAB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Bắc Á"
                    },
                    {
                        "code": "MSB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/MSB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Maritimebank"
                    },
                    {
                        "code": "SGB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/SGB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Saigonbank"
                    },
                    {
                        "code": "NVB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/NVB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Nam Việt"
                    },
                    {
                        "code": "ICB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/ICB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Viettinbank"
                    },
                    {
                        "code": "TPB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/TPB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng TienPhong"
                    },
                    {
                        "code": "VAB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VAB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Việt Á"
                    },
                    {
                        "code": "MB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/MB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Quân Đội"
                    },
                    {
                        "code": "HDB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/HDB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng HDBank"
                    },
                    {
                        "code": "VPB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VPB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng VPBank"
                    },
                    {
                        "code": "OJB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/OJB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Đại Dương"
                    },
                    {
                        "code": "ABB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/ABB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng An Bình"
                    },
                    {
                        "code": "NAB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/NAB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Nam Á"
                    },
                    {
                        "code": "IVB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/IVB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Indovina"
                    },
                    {
                        "code": "VIETTELPAY",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VIETTELPAY.png",
                        "name": "Thanh toán bằng mã QR Viettelpay"
                    },
                    {
                        "code": "VB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Vietbank"
                    },
                    {
                        "code": "PVCOMBANK",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/PVCOMBANK.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng PVCombank"
                    },
                    {
                        "code": "GDB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/GDB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng Bản Việt"
                    },
                    {
                        "code": "SCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/SCB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng SCB"
                    },
                    {
                        "code": "SHB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/SHB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng SHB"
                    },
                    {
                        "code": "SEA",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/SEA.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng SEA"
                    },
                    {
                        "code": "OCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/OCB.png",
                        "name": "Thanh toán bằng mã QR Ngân hàng OCB"
                    },
                    {
                        "code": "MOMO",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/MOMO.png",
                        "name": "Thanh toán bằng mã QR Ví điện tử Momo"
                    },
                    {
                        "code": "NGANLUONG",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/NGANLUONG.png",
                        "name": "Thanh toán QR qua ví Ngân Lượng"
                    },
                    {
                        "code": "VIETQR",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VIETQR.png",
                        "name": "Thanh toán bằng QRcode bank chuẩn VietQR"
                    },
                    {
                        "code": "ZALO",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/ZALO.png",
                        "name": "Thanh toán bằng mã QR Ví điện tử ZaloPay"
                    }
                ],
                "CREDIT-CARD": [
                    {
                        "code": "VISA",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VISA.png",
                        "name": "Thanh toán quốc tế qua thẻ Visa"
                    },
                    {
                        "code": "MASTER",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/MASTER.png",
                        "name": "Thanh toán quốc tế qua thẻ MasterCard"
                    },
                    {
                        "code": "MASTERCARD",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/MASTERCARD.png",
                        "name": "Thanh toán quốc tế qua thẻ MasterCard"
                    },
                    {
                        "code": "JCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/JCB.png",
                        "name": "Thanh toán quốc tế qua thẻ JCB"
                    },
                    {
                        "code": "AMEX",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/AMEX.png",
                        "name": "Thanh toán quốc tế qua thẻ Amex"
                    },
                    {
                        "code": "UPI",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/UPI.png",
                        "name": "Thanh toán quốc tế qua thẻ UnionPay"
                    }
                ],
                "QRCODE247": [
                    {
                        "code": "ACB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/ACB.png",
                        "name": "Thanh toán bằng QRCODE Napas247 ngân hàng ACB "
                    }
                ],
                "CREDIT-CARD-INTERNATIONAL": [
                    {
                        "code": "VISA",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/VISA.png",
                        "name": "Thanh toán quốc tế qua thẻ Visa - Phát hành ngoài nước"
                    },
                    {
                        "code": "JCB",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/JCB.png",
                        "name": "Thanh toán quốc tế qua thẻ JCB - Phát hành ngoài nước"
                    },
                    {
                        "code": "MASTERCARD",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/MASTERCARD.png",
                        "name": "Thanh toán quốc tế qua thẻ MasterCard - Phát hành ngoài nước"
                    },
                    {
                        "code": "AMEX",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/AMEX.png",
                        "name": "Thanh toán quốc tế qua thẻ Amex - Phát hành ngoài nước"
                    }
                ],
                "MOBILE-PAYMENT": [
                    {
                        "code": "APPLE",
                        "logo": "https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/bank/ie/APPLE.png",
                        "name": "Thanh toán bằng Apple Pay"
                    }
                ]
            },
            "result_message": "Success"
        }
    `})
    @ApiBody({
        schema:{
            type:"object",
            required:["function", "merchant_site_code"],
            properties:{
                function:{ type:"string", example:"GetBanks" },
                merchant_site_code: { type:"string", example:"7"}
            }
        }
    })
    @ApiResponse({ status: 201, description: "Ok"})
    @ApiResponse({ status: 500, description: "Internal server error" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiTags('Payment operations')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    @Post('getBanks')
    async paymentGetBanks(@Body() payload : any)
    {
        const respone = await this.paymentService.getBank(payload);
        return respone;
    }
}
