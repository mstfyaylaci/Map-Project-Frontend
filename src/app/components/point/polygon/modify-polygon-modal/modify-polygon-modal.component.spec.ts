import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPolygonModalComponent } from './modify-polygon-modal.component';

describe('ModifyPolygonModalComponent', () => {
  let component: ModifyPolygonModalComponent;
  let fixture: ComponentFixture<ModifyPolygonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyPolygonModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyPolygonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
