import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Filter } from '../../../../models/filter/filter.model';
import { FilterCheckboxComponent } from './filter-checkbox.component';

describe('Filter Checkbox Component', () => {
  let component: FilterCheckboxComponent;
  let fixture: ComponentFixture<FilterCheckboxComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterCheckboxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    const filterElement = {
      name: 'Brands',
      facets: [
        { name: 'AsusName', count: 4, link: { title: 'Asus' } },
        { name: 'LogitechName', count: 5, link: { title: 'Logitech' }, selected: true },
      ],
    } as Filter;
    fixture = TestBed.createComponent(FilterCheckboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.filterElement = filterElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
