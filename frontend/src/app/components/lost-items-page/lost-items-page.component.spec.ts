import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostItemsPageComponent } from './lost-items-page.component';

describe('LostItemsPageComponent', () => {
  let component: LostItemsPageComponent;
  let fixture: ComponentFixture<LostItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LostItemsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LostItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
