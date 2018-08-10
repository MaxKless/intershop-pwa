import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { RouteNavigation, ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  skip,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { LocaleActionTypes } from '../../../core/store/locale';
import { mapErrorToAction } from '../../../utils/operators';
import { ProductsService } from '../../services/products/products.service';
import { SetProductSkusForCategory } from '../categories';
import { ShoppingState } from '../shopping.state';
import { getSortBy, SetSortKeys } from '../viewconf';
import * as productsActions from './products.actions';
import * as productsSelectors from './products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState | CoreState>,
    private productsService: ProductsService,
    private router: Router
  ) {}

  @Effect()
  loadProduct$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProduct),
    map((action: productsActions.LoadProduct) => action.payload),
    mergeMap(sku =>
      this.productsService.getProduct(sku).pipe(
        map(product => new productsActions.LoadProductSuccess(product)),
        mapErrorToAction(productsActions.LoadProductFail)
      )
    )
  );

  @Effect()
  loadProductsForCategory$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProductsForCategory),
    map((action: productsActions.LoadProductsForCategory) => action.payload),
    withLatestFrom(this.store.pipe(select(getSortBy))),
    concatMap(([categoryUniqueId, sortBy]) =>
      this.productsService.getCategoryProducts(categoryUniqueId, sortBy).pipe(
        withLatestFrom(this.store.pipe(select(productsSelectors.getProductEntities))),
        switchMap(([res, entities]) => [
          new SetProductSkusForCategory({ categoryUniqueId: res.categoryUniqueId, skus: res.skus }),
          new SetSortKeys(res.sortKeys),
          ...res.products.filter(stub => !entities[stub.sku]).map(stub => new productsActions.LoadProductSuccess(stub)),
        ]),
        mapErrorToAction(productsActions.LoadProductFail)
      )
    )
  );

  @Effect()
  routeListenerForSelectingProducts$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    map((action: RouteNavigation) => action.payload.params.sku),
    withLatestFrom(this.store.pipe(select(productsSelectors.getSelectedProductId))),
    filter(([fromAction, fromStore]) => fromAction !== fromStore),
    map(([sku]) => new productsActions.SelectProduct(sku))
  );

  @Effect()
  selectedProduct$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.SelectProduct),
    map((action: productsActions.SelectProduct) => action.payload),
    filter(sku => !!sku),
    map(sku => new productsActions.LoadProduct(sku))
  );

  /**
   * reload the current (if available) product when language is changed
   */
  @Effect()
  languageChange$ = this.actions$.pipe(
    ofType(LocaleActionTypes.SelectLocale),
    distinctUntilChanged(),
    skip(1), // ignore app init language selection
    withLatestFrom(this.store.pipe(select(productsSelectors.getSelectedProductId))),
    filter(([, sku]) => !!sku),
    map(([, sku]) => new productsActions.LoadProduct(sku))
  );

  @Effect({ dispatch: false })
  redirectIfErrorInProducts$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProductFail),
    tap(() => this.router.navigate(['/error']))
  );
}
