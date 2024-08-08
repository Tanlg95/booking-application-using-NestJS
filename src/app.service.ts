import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  // getEmployee(): Array<any> {
  //   return [
  //       {
  //         employeeId: "SIV0001",
  //         employeeName: "châu nhuận phát",
  //         birthDate: "1995-09-22",
  //         employedDate: "2024-08-10",
  //         isActive: true,
  //         basicSalary: 20000000
  //       },
  //       {
  //         employeeId: "SIV0002",
  //         employeeName: "trương minh nhạn",
  //         birthDate: "1994-03-12",
  //         employedDate: "2024-05-10",
  //         isActive: true,
  //         basicSalary: 40000000
  //       },
  //       {
  //         employeeId: "SIV0003",
  //         employeeName: "huỳnh minh thành",
  //         birthDate: "1992-11-18",
  //         employedDate: "2024-08-01",
  //         isActive: true,
  //         basicSalary: 50000000
  //       }
  //   ]
  // }

}
