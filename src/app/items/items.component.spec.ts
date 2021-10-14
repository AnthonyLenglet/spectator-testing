import { fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActivatedRouteStub,
  byTestId,
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
} from '@ngneat/spectator';
import { of } from 'rxjs';
import { ItemService } from '../item.service';
import { ItemsComponent } from './items.component';

describe('ItemsComponent', () => {
  let spectator: SpectatorRouting<ItemsComponent>;

  describe('simulating direct query param change', () => {
    const createComponentWithStubs = createRoutingFactory({
      component: ItemsComponent,
      providers: [
        mockProvider(ItemService, {
          itemsTodo$: of(['todo 1', 'todo 2']),
          itemsUnderReview$: of([
            'under review 1',
            'under review 2',
            'under review 3',
          ]),
          itemsReviewed$: of(['reviewed 1']),
        }),
      ],
      shallow: true,
    });

    beforeEach(() => {
      spectator = createComponentWithStubs();
    });

    it('should have 2 items in the "todo" tab', () => {
      spectator.setRouteQueryParam('pipeline', 'todo');
      expect(spectator.queryAll(byTestId('item-component')).length).toBe(2);
    });

    it('should have 3 items in the "under review" tab', () => {
      spectator.setRouteQueryParam('pipeline', 'under-review');
      expect(spectator.queryAll(byTestId('item-component')).length).toBe(3);
    });

    it('should have 1 item in the "reviewed" tab', () => {
      spectator.setRouteQueryParam('pipeline', 'reviewed');
      expect(spectator.queryAll(byTestId('item-component')).length).toBe(1);
    });
  });

  describe('simulating click', () => {
    const createComponentWithStubs = createRoutingFactory({
      component: ItemsComponent,
      providers: [
        mockProvider(ItemService, {
          itemsTodo$: of(['todo 1', 'todo 2']),
          itemsUnderReview$: of([
            'under review 1',
            'under review 2',
            'under review 3',
          ]),
          itemsReviewed$: of(['reviewed 1']),
        }),
      ],
      shallow: true,
    });

    beforeEach(() => {
      spectator = createComponentWithStubs();
    });

    it('should have 2 items in the "todo" tab', fakeAsync(() => {
      spectator.click(spectator.queryAll('a')[0]);
      tick();
      expect(spectator.queryAll('item-component').length).toBe(2);
    }));

    it('should have 3 items in the "under review" tab', fakeAsync(() => {
      spectator.click(spectator.queryAll('a')[1]);
      tick();
      expect(spectator.queryAll('item-component').length).toBe(3);
    }));

    it('should have 1 item in the "reviewed" tab', fakeAsync(() => {
      spectator.click(spectator.queryAll('a')[2]);
      tick();
      expect(spectator.queryAll('item-component').length).toBe(1);
    }));
  });

  describe('simulating click - with all stubs but activatedRoute disabled', () => {
    const createComponentWithoutStubs = createRoutingFactory({
      component: ItemsComponent,
      stubsEnabled: false,
      providers: [
        mockProvider(ItemService, {
          itemsTodo$: of(['todo 1', 'todo 2']),
          itemsUnderReview$: of([
            'under review 1',
            'under review 2',
            'under review 3',
          ]),
          itemsReviewed$: of(['reviewed 1']),
        }),
        {
          provide: ActivatedRoute,
          useExisting: ActivatedRouteStub,
        },
      ],
      routes: [
        {
          path: '',
          component: ItemsComponent,
        },
      ],
      shallow: true,
    });

    beforeEach(() => {
      spectator = createComponentWithoutStubs();
    });

    it('should have 2 items in the "todo" tab', fakeAsync(() => {
      spectator.click(spectator.queryAll('a')[0]);
      tick();
      const router = spectator.inject(Router);
      console.log('should have 2 items in the "todo" tab', router.url); // logs "should have 2 items in the "todo" tab /?pipeline=todo"
      expect(spectator.queryAll('item-component').length).toBe(2); // false
    }));

    it('should have 3 items in the "under review" tab', fakeAsync(() => {
      spectator.click(spectator.queryAll('a')[1]);
      tick();
      const router = spectator.inject(Router);
      console.log('should have 3 items in the "under review" tab', router.url); // logs "should have 2 items in the "todo" tab /?pipeline=todo"
      expect(spectator.queryAll('item-component').length).toBe(3); // false
    }));

    it('should have 1 item in the "reviewed" tab', fakeAsync(() => {
      spectator.click(spectator.queryAll('a')[2]);
      tick();
      const router = spectator.inject(Router);
      console.log('should have 1 item in the "reviewed" tab', router.url); // logs "should have 1 item in the "reviewed" tab /?pipeline=reviewed"
      expect(spectator.queryAll('item-component').length).toBe(1); // false
    }));
  });
});
