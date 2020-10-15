import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(value: any, ...args): any {

    if (args && args.length > 1 && Number(args[0]) > 0) {
      return (100 - (args[1] * 100 / args[0])).toFixed(1);
    }
    return 0;
  }

}
