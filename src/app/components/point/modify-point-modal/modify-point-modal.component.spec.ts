import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPointModalComponent } from './modify-point-modal.component';

describe('ModifyPointModalComponent', () => {
  let component: ModifyPointModalComponent;
  let fixture: ComponentFixture<ModifyPointModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyPointModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyPointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
