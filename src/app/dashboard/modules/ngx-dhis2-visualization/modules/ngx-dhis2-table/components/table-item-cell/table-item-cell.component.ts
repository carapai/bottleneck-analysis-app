import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { LegendSet } from '../../../../models';
import { Legend } from '../../../../../../../models';

@Component({
  selector: 'app-table-item-cell',
  templateUrl: './table-item-cell.component.html',
  styleUrls: ['./table-item-cell.component.scss']
})
export class TableItemCellComponent implements OnInit {
  @Input()
  dataRowIds: string[];

  @Input()
  dataDimensions: string[];

  @Input()
  dataSelections: any[];

  @Input()
  analyticsObject: any;

  @Input()
  legendSet: LegendSet;

  dataValue: any;
  color: string;
  tooltip: string;

  constructor() {}

  ngOnInit() {
    const dataValues = this.findDataValuesFromAnalytics(
      this.analyticsObject,
      this.dataRowIds
    );

    const isRatio = _.some(
      dataValues,
      dataValue => dataValue.toString().split('.')[1]
    );

    const dataValuesSum = dataValues.length > 0 ? _.sum(dataValues) : NaN;

    this.dataValue = isRatio
      ? parseFloat((dataValuesSum / dataValues.length).toFixed(2))
      : !isNaN(dataValuesSum)
      ? dataValuesSum
      : '';

    // Find color for the cell
    const dxIndex = this.dataDimensions.indexOf('dx');
    const dxId = this.dataRowIds[dxIndex];
    const dxDataSelection = _.find(this.dataSelections, ['dimension', 'dx']);
    const currentDxItem = _.find(dxDataSelection ? dxDataSelection.items : [], [
      'id',
      dxId
    ]);

    const legends: Legend[] =
      currentDxItem && currentDxItem.legendSet
        ? currentDxItem.legendSet.legends
        : this.legendSet
        ? this.legendSet.legends
        : [];
    const associatedLegend: Legend = _.filter(legends, (legend: Legend) => {
      return (
        this.dataValue >= legend.startValue && this.dataValue < legend.endValue
      );
    })[0];

    this.color =
      legends.length > 0
        ? associatedLegend && this.dataValue !== ''
          ? associatedLegend.color
          : '#ffffff'
        : this.dataValue !== ''
        ? '#eeeeee'
        : '#ffffff';

    // Find table cell tooltip
    this.tooltip =
      _.join(
        [
          ..._.map(this.dataRowIds, (dataId: string) =>
            this.analyticsObject &&
            this.analyticsObject.metaData &&
            this.analyticsObject.metaData.names
              ? this.analyticsObject.metaData.names[dataId]
              : null
          )
        ],
        ' - '
      ) +
      ' ' +
      this.dataValue;
  }

  findDataValuesFromAnalytics(analyticsObject: any, dataRowIds: string[]) {
    const dataIndex = analyticsObject.headers.indexOf(
      _.find(analyticsObject.headers, ['name', 'value'])
    );

    return _.filter(
      _.map(
        _.filter(
          analyticsObject ? analyticsObject.rows || [] : [],
          (row: any[]) =>
            _.intersection(dataRowIds, row).length === dataRowIds.length
        ),
        dataRow => parseFloat(dataRow[dataIndex])
      ),
      dataValue => !isNaN(dataValue)
    );
  }
}
