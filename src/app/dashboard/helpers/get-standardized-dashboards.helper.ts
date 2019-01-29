import { Dashboard } from '../models';
import * as _ from 'lodash';
import { User, SystemInfo } from '../../models';
import { getDashboardBookmarkStatus } from './get-dashboard-bookmark-status.helper';
import { getStandardizedDashboard } from './get-standardized-dashboard.helper';

export function getStandardizedDashboards(
  dashboards: any[],
  currentUser: User,
  systemInfo: SystemInfo,
  dataGroups?: any[]
): Dashboard[] {
  return _.map(dashboards || [], dashboard =>
    getStandardizedDashboard(dashboard, currentUser, systemInfo, dataGroups)
  );
}
