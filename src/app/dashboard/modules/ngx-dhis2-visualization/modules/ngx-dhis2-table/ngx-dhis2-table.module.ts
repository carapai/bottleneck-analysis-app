import { NgModule } from '@angular/core';
import { TableListComponent } from './components/table-list/table-list.component';
import { TableItemComponent } from './components/table-item/table-item.component';
import { CommonModule } from '@angular/common';
import { TableItemCellComponent } from './components/table-item-cell/table-item-cell.component';

import { DndModule } from 'ng2-dnd';

@NgModule({
  imports: [CommonModule, DndModule.forRoot()],
  declarations: [
    TableListComponent,
    TableItemComponent,
    TableItemCellComponent
  ],
  exports: [TableListComponent, TableItemComponent]
})
export class NgxDhis2TableModule {}
