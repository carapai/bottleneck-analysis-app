import * as _ from 'lodash';
import { generateUid } from './generate-uid.helper';
import { Legend } from '../dashboard/modules/ngx-dhis2-visualization/modules/ngx-dhis2-table/models/legend-set.model';

export function getAutoGeneratedLegends(): Legend[] {
  const rangeOfValues = _.range(0, 100, 100 / 3);
  const rangeOfColors = ['#FF0000', '#FFFF00', '#008000'];
  const legendNames = ['Low', 'Average', 'High'];
  return _.map(
    _.filter(
      _.map(rangeOfValues, (startValue: number, valueIndex: number) => {
        const endValue = rangeOfValues[valueIndex + 1] || 100;

        return endValue
          ? {
              id: generateUid(),
              endValue: Math.ceil(endValue),
              color: rangeOfColors[valueIndex],
              startValue: Math.ceil(startValue)
            }
          : null;
      }),
      (legend: any) => legend !== null
    ),
    (legend: Legend, legendIndex: number) => {
      return {
        ...legend,
        name: legendNames[legendIndex]
      };
    }
  );
}
