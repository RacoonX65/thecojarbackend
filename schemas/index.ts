import product from './product';
import category from './category';
import collection from './collection';
import customer from './customer';
import order from './order';
import paymentMethod from './paymentMethod';
import review from './review';
import reviewComment from './reviewComment';
import shippingMethod from './shippingMethod';
import seo from './seo';
import address from './address';
import brand from './brand';
import sneakerAttributes from './sneakerAttributes';
import iphoneAttributes from './iphoneAttributes';
import accessoryAttributes from './accessoryAttributes';
import siteSettings from './siteSettings';
import cart from './cart';
import coupon from './coupon';

export const schemaTypes = [
  // Document types
  product,
  category,
  collection,
  customer,
  order,
  paymentMethod,
  review,
  reviewComment,
  shippingMethod,
  brand,
  siteSettings,
  cart,
  coupon,
  
  // Object types
  seo,
  address,
  sneakerAttributes,
  iphoneAttributes,
  accessoryAttributes,
];

export {
  product,
  category,
  collection,
  customer,
  order,
  paymentMethod,
  review,
  reviewComment,
  shippingMethod,
  seo,
  address,
  brand,
  sneakerAttributes,
  iphoneAttributes,
  accessoryAttributes,
  siteSettings,
  cart,
  coupon,
};

export type { default as Product } from './product';
export type { default as Category } from './category';
export type { default as Customer } from './customer';
export type { default as Order } from './order';
export type { default as Brand } from './brand';
export type { default as SiteSettings } from './siteSettings';
export type { default as Cart } from './cart';
export type { default as Coupon } from './coupon';
