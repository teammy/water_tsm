import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGrahpComponent } from './card-grahp.component';

describe('CardGrahpComponent', () => {
  let component: CardGrahpComponent;
  let fixture: ComponentFixture<CardGrahpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardGrahpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardGrahpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
