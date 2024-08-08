import { Controller, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { XmlService } from './xml.service';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/support/guards/accessToken.guard';

@Controller('xml')
export class XmlController {

    constructor( private xmlService: XmlService){}

    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    @ApiTags('Convert XML to JSON')
    @ApiOperation({summary:"function Convert xml to json format"})
    @ApiResponse({ status: 200, description: "Ok",
        schema:{
            title: "respone data",
            type: "object",
            properties:{
                confirmation_no:{ type:"string", example:"173903", description: "confirmation_no"},
                resv_name_id:{ type:"string", example:"161987", description: "resv_name_id"},
                arrival:{ type:"datetime", example:"2024-04-04T00:00:00", description: "arrival time"},
                departure:{ type:"datetime", example:"2024-04-04T00:00:00", description: "departure time"},
                adults:{ type:"number", example: 4, description: "total adults"},
                children:{ type:"number", example: 0, description: "total children"},
                roomtype:{ type:"string", example:"FSDT", description: "room type"},
                ratecode:{ type:"string", example:"RTOF1", description: "ratecode"},
                rateamount_amount:{ type:"number", example: 2047500, description: "rate amount"},
                rateamount_currency:{ type:"string", example:"VND", description: "rate currency"},
                guarantee:{ type:"string", example:"6PM", description: "guarantee"},
                method_payment:{ type:"string", example:"CL", description: "method payment"},
                computed_resv_status:{ type:"string", example:"DUEIN", description: "computed_resv_status"},
                last_name:{ type:"string", example:"Hoge", description: "last name"},
                first_name:{ type:"string", example:"Yves", description: "first name"},
                title:{ type:"string", example: null, description: "title"},
                phone_number:{ type:"string", example:"84123456789", description: "phone number"},
                email:{ type:"string", example:"test@email.com", description: "email"},
                booking_balance:{ type:"string", example: -22522500, description: "booking balance"},
                booking_created_date:{ type:"datetime", example:"2009-03-14T02:48:16.071875+07:00", description: "booking created date"}
            }
        }
    })
    @ApiResponse({ status: 500, description: "Internal server error" })
    @Post('json')
    async convertToJson(@Query('confirmation_no') confirmation_no : number)
    {
        // console.log(`check: ${confirmation_no}`);
        return this.xmlService.getPaymentDocXml(confirmation_no);
    }

}
