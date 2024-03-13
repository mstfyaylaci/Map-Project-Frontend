import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryPointModalComponent } from './query-point-modal.component';

describe('QueryPointModalComponent', () => {
  let component: QueryPointModalComponent;
  let fixture: ComponentFixture<QueryPointModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QueryPointModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueryPointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
