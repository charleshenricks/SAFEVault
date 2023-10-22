import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundItemsPageComponent } from './found-items-page.component';

describe('FoundItemsPageComponent', () => {
  let component: FoundItemsPageComponent;
  let fixture: ComponentFixture<FoundItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoundItemsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
