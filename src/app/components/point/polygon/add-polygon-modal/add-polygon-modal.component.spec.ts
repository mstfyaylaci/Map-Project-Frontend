import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPolygonModalComponent } from './add-polygon-modal.component';

describe('AddPolygonModalComponent', () => {
  let component: AddPolygonModalComponent;
  let fixture: ComponentFixture<AddPolygonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPolygonModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPolygonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
