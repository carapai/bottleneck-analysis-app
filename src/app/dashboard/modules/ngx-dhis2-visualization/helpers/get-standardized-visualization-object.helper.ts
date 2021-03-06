import { Visualization } from '../models';
import * as _ from 'lodash';
import { generateUid } from '../../../../helpers/generate-uid.helper';
import { checkIfVisualizationIsNonVisualizable } from './check-if-visualization-is-non-visualizable.helper';

export function getStandardizedVisualizationObject(
  visualizationItem: any,
  dataSelections?: any[]
): Visualization {
  const isNonVisualizable = checkIfVisualizationIsNonVisualizable(
    visualizationItem.type
  );
  const visualizationObject = {
    id: visualizationItem.id,
    title: getVisualizationTitle(visualizationItem),
    name: getVisualizationName(visualizationItem),
    type: visualizationItem.type,
    favorite: getFavoriteDetails(visualizationItem, dataSelections),
    created: visualizationItem.created,
    appKey: visualizationItem.appKey,
    lastUpdated: visualizationItem.lastUpdated,
    isNew: visualizationItem.isNew,
    isNonVisualizable,
    progress: {
      statusCode: 200,
      statusText: 'OK',
      percent: 0,
      message: 'Loading..'
    },
    layers: []
  };
  return visualizationObject;
}

function getVisualizationName(visualizationItem: any) {
  if (!visualizationItem) {
    return null;
  }

  switch (visualizationItem.type) {
    case 'APP':
      return visualizationItem.appKey;
    case 'MESSAGES':
      return 'Messages';
    case 'RESOURCES':
      return 'Resources';
    case 'REPORTS':
      return 'Reports';
    case 'USERS':
      return 'Users';
    default:
      return visualizationItem.name
        ? visualizationItem.name
        : visualizationItem.type &&
          visualizationItem.hasOwnProperty(_.camelCase(visualizationItem.type))
          ? _.isPlainObject(
              visualizationItem[_.camelCase(visualizationItem.type)]
            )
            ? visualizationItem[_.camelCase(visualizationItem.type)].displayName
            : 'Untitled'
          : 'Untitled';
  }
}

function getVisualizationTitle(visualizationItem: any) {
  return visualizationItem.title
    ? visualizationItem.title
    : visualizationItem.type &&
      visualizationItem.hasOwnProperty(_.camelCase(visualizationItem.type))
      ? _.isPlainObject(visualizationItem[_.camelCase(visualizationItem.type)])
        ? visualizationItem[_.camelCase(visualizationItem.type)].title
        : undefined
      : undefined;
}

function getFavoriteDetails(visualizationItem: any, dataSelections?: any[]) {
  if (!visualizationItem) {
    return null;
  }
  const favoriteItem = visualizationItem[_.camelCase(visualizationItem.type)];
  return _.isPlainObject(favoriteItem)
    ? {
        id: favoriteItem.id,
        type: _.camelCase(visualizationItem.type),
        visualizationType: visualizationItem.type,
        name: getVisualizationName(visualizationItem),
        useTypeAsBase: true,
        requireAnalytics: true,
        dataSelections
      }
    : {
        id: generateUid(),
        name: getVisualizationName(visualizationItem),
        type: _.camelCase(visualizationItem.type),
        visualizationType: visualizationItem.type,
        dataSelections
      };
}
