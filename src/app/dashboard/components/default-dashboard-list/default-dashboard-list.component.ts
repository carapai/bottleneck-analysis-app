import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { generateUid } from '../../../helpers/generate-uid.helper';
import { Store } from '@ngrx/store';

import * as fromInterventionReducer from '../../store/reducers/intervention.reducer';
import * as fromInterventionActions from '../../store/actions/intervention.actions';
import * as fromInterventionSelectors from '../../store/selectors/intervention.selectors';
import { Observable } from 'rxjs';

interface DefaultDashboard {
  id: string;
  name: string;
  showEditForm?: boolean;
  showDeleteDialog?: boolean;
}

const DASHBOARD_ITEMS = [
  {
    shape: 'FULL_WIDTH',
    type: 'CHART'
  },
  {
    shape: 'FULL_WIDTH',
    type: 'REPORT_TABLE'
  },
  {
    shape: 'FULL_WIDTH',
    type: 'APP'
  }
];

@Component({
  selector: 'app-default-dashboard-list',
  templateUrl: './default-dashboard-list.component.html',
  styleUrls: ['./default-dashboard-list.component.scss']
})
export class DefaultDashboardListComponent implements OnInit {
  @Input()
  defaultDashboardList: DefaultDashboard[];
  showDefaultList: boolean;
  showInterventionForm: boolean;
  newInterventionName: string;
  savingIntervention: boolean;
  searchTerm: string;

  loadingInterventions$: Observable<boolean>;
  interventionLoaded$: Observable<boolean>;
  interventions$: Observable<any[]>;
  interventionNotification$: Observable<any>;

  @Output()
  create: EventEmitter<any> = new EventEmitter<any>();
  constructor(private interventionStore: Store<fromInterventionReducer.State>) {
    interventionStore.dispatch(new fromInterventionActions.LoadInterventions());

    this.loadingInterventions$ = interventionStore.select(
      fromInterventionSelectors.getInterventionLoading
    );

    this.interventionLoaded$ = interventionStore.select(
      fromInterventionSelectors.getInterventionLoaded
    );

    this.interventions$ = interventionStore.select(
      fromInterventionSelectors.getSortedInterventions
    );

    this.interventionNotification$ = interventionStore.select(
      fromInterventionSelectors.getInterventionNotification
    );
  }

  ngOnInit() {}

  onSearchDashboard(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value.trim();
    this.showDefaultList = true;
  }

  onAddDashboard(dashboard: DefaultDashboard, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.showDefaultList = false;
    this.create.emit({ ...dashboard, dashboardItems: DASHBOARD_ITEMS });
  }

  onToggleInterventionList(e) {
    e.stopPropagation();
    this.showDefaultList = !this.showDefaultList;
  }

  onToggleInterventionForm(e?) {
    if (e) {
      e.stopPropagation();
    }
    this.showInterventionForm = !this.showInterventionForm;
  }

  onToggleInterventionEditForm(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.defaultDashboardList = _.map(
      this.defaultDashboardList,
      (interventionItem: any) => {
        return intervention.id === interventionItem.id
          ? {
              ...interventionItem,
              showEditForm: !interventionItem.showEditForm
            }
          : interventionItem;
      }
    );
  }

  onToggleInterventionDelete(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.defaultDashboardList = _.map(
      this.defaultDashboardList,
      (interventionItem: any) => {
        return intervention.id === interventionItem.id
          ? {
              ...interventionItem,
              showDeleteDialog: !interventionItem.showDeleteDialog
            }
          : interventionItem;
      }
    );
  }

  onEnterInterventionName(e) {
    e.stopPropagation();
    this.newInterventionName = e.target.value.trim();
  }

  onAddIntervention(intervention: any) {
    this.showInterventionForm = false;
    this.interventionStore.dispatch(
      new fromInterventionActions.CreateIntervention(intervention)
    );
  }

  onUpdateIntervention(intervention: any) {
    this.defaultDashboardList = _.map(
      this.defaultDashboardList,
      (interventionItem: any) => {
        return intervention.id === interventionItem.id
          ? {
              ...interventionItem,
              showEditForm: !interventionItem.showEditForm,
              name: intervention.name
            }
          : interventionItem;
      }
    );
  }

  onDeleteIntervention(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.defaultDashboardList = _.map(
      this.defaultDashboardList,
      (interventionItem: any) => {
        return intervention.id === interventionItem.id
          ? {
              ...interventionItem,
              showDeleteDialog: !interventionItem.showDeleteDialog,
              deleting: true
            }
          : interventionItem;
      }
    );
  }
}
