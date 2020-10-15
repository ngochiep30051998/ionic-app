import { Pipe, PipeTransform } from '@angular/core';
import { IMenu } from '../interfaces/menu.interfaces';

@Pipe({
  name: 'filterMenu'
})
export class FilterMenuPipe implements PipeTransform {

  transform(value: any, ...args): any {
    if (args.length > 1) {
      const arr = args[1].find((x: IMenu) => x.id === args[0]);
      if (arr && arr[value]) {
        return arr[value];
      }
    }
    return [];
  }

}
