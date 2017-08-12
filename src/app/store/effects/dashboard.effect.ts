import {Injectable} from '@angular/core';
import {DashboardService} from '../../providers/dashboard.service';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {
  CREATE_DASHBOARD_ACTION, CURRENT_DASHBOARD_CHANGE_ACTION, CurrentDashboardSaveAction, DASHBOARD_CREATED_ACTION,
  DASHBOARD_DELETED_ACTION,
  DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION,
  DASHBOARD_ITEM_ADD_ACTION,
  DashboardCreatedAction,
  DashboardDeletedAction,
  DashboardEditedAction, DashboardGroupSettingsUpdatedAction, DashboardItemAddedAction, DashboardNavigatedAction,
  DashboardRezisedAction, DashboardsCustomSettingsLoadedAction, DashboardSearchItemsLoadedAction,
  DashboardsLoadedAction,
  DELETE_DASHBOARD_ACTION, DELETE_VISUALIZATION_OBJECT_ACTION, EDIT_DASHBOARD_ACTION,
  ErrorOccurredAction, LOAD_DASHBOARD_SEARCH_ITEMS_ACTION,
  LOAD_DASHBOARDS_ACTION, LOAD_DASHBOARDS_CUSTOM_SETTINGS_ACTION, NAVIGATE_DASHBOARD_ACTION, NavigateDashboardAction,
  RESIZE_DASHBOARD_ACTION,
  VisualizationObjectDeletedAction
} from '../actions';
import {Action, Store} from '@ngrx/store';
import {ApplicationState} from '../application-state';
import {Dashboard} from '../../model/dashboard';
@Injectable()
export class DashboardEffect {
  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private dashboardService: DashboardService
  ) {}

  @Effect() dashboards$: Observable<Action> = this.actions$
    .ofType(LOAD_DASHBOARDS_ACTION)
    .switchMap(action => this.dashboardService.loadAll(action.payload))
    .map((dashboardResponse: any) => {

      if (!dashboardResponse.dashboards) {
        return new ErrorOccurredAction(dashboardResponse);
      }

      const newDashboards: Dashboard[] = dashboardResponse.dashboards;
      return new DashboardsLoadedAction(newDashboards)
    });

  @Effect() currentDashboardChange: Observable<Action> = this.actions$
    .ofType(CURRENT_DASHBOARD_CHANGE_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {

      if (store.uiState.dashboardLoaded && store.uiState.dashboardCustomSettingsLoaded) {
        const currentDashboard = _.find(store.storeData.dashboards, ['id', action.payload]);

        if (!currentDashboard) {
          return Observable.of(store.storeData.dashboards[0]);
        }
      }
      return Observable.of(action.payload);
    })
    .map(dashboard => {
      if (dashboard.id) {
        return new NavigateDashboardAction(dashboard)
      }

      return new CurrentDashboardSaveAction(dashboard);
    });

  @Effect() predefinedDashboards$: Observable<Action> = this.actions$
    .ofType(LOAD_DASHBOARDS_CUSTOM_SETTINGS_ACTION)
    .switchMap(action => this.dashboardService.loadCustomDashboardSettings(action.payload))
    .map(dashboards => new DashboardsCustomSettingsLoadedAction(dashboards));

  @Effect() updateDashboardsSettings$: Observable<Action> = this.actions$
    .ofType(DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION)
    .switchMap(action => this.dashboardService.updateCustomDashboardSettings(action.payload))
    .map(dashboardsSettings => new DashboardGroupSettingsUpdatedAction(dashboardsSettings))

  @Effect() createDashboard$: Observable<Action> = this.actions$
    .ofType(CREATE_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.create(action.payload))
    .map(dashboard => new DashboardCreatedAction(dashboard))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() navigateDashboard$: Observable<Action> = this.actions$
    .ofType(DASHBOARD_CREATED_ACTION)
    .switchMap(action => Observable.of(action.payload))
    .map(dashboard => new NavigateDashboardAction(dashboard));

  @Effect() dashboardNavigated$: Observable<Action> = this.actions$
    .ofType(NAVIGATE_DASHBOARD_ACTION)
    .switchMap(action => Observable.of(this.dashboardService.navigateToDashboard(action.payload)))
    .map(dashboard => new DashboardNavigatedAction(dashboard));


  @Effect() editDashboard$: Observable<Action> = this.actions$
    .ofType(EDIT_DASHBOARD_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      const apiRootUrl = store.uiState.systemInfo.apiRootUrl;
      return this.dashboardService.edit({apiRootUrl: apiRootUrl, dashboardData: action.payload})
    })
    .map(dashboard => new DashboardEditedAction(dashboard));

  @Effect() deleteDashboard$: Observable<Action> = this.actions$
    .ofType(DELETE_DASHBOARD_ACTION)
    .flatMap(action => this.dashboardService.delete(action.payload))
    .map(dashboard => new DashboardDeletedAction(dashboard))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() deletedDashboard$: Observable<Action> = this.actions$
    .ofType(DASHBOARD_DELETED_ACTION)
    .flatMap(action => Observable.of(action.payload))
    .map(dashboard => new NavigateDashboardAction(dashboard));

  @Effect() resizeDashboard$: Observable<Action> = this.actions$
    .ofType(RESIZE_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.resize(action.payload))
    .map(() => new DashboardRezisedAction())
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() loadDashboardSearchItems$: Observable<Action> = this.actions$
    .ofType(LOAD_DASHBOARD_SEARCH_ITEMS_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      return this.dashboardService.loadSearchItems({
        apiRootUrl: store.uiState.systemInfo.apiRootUrl,
        searchText: action.payload
      })
    })
    .map((searchResult) => new DashboardSearchItemsLoadedAction(searchResult))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() addDashboardItemAction$: Observable<Action> = this.actions$
    .ofType(DASHBOARD_ITEM_ADD_ACTION)
    .switchMap(action => this.dashboardService.addItems(action.payload))
    .map((dashboardDetails) => new DashboardItemAddedAction(dashboardDetails));

  @Effect() deleteVisualizationObject$: Observable<Action> = this.actions$
    .ofType(DELETE_VISUALIZATION_OBJECT_ACTION)
    .switchMap(action => this.dashboardService.deleteItem(action.payload))
    .map((dashboardDetails) => new VisualizationObjectDeletedAction(dashboardDetails));



}
