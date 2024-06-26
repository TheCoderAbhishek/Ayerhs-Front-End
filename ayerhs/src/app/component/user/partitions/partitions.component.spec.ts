import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartitionsComponent } from './partitions.component';

describe('PartitionsComponent', () => {
  let component: PartitionsComponent;
  let fixture: ComponentFixture<PartitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
