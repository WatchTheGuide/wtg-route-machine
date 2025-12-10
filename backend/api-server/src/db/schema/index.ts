/**
 * Database schema exports
 * Re-exports all table schemas and types
 */

export { users, type User, type NewUser } from './users.js';
export {
  refreshTokens,
  type RefreshToken,
  type NewRefreshToken,
} from './refresh_tokens.js';
export { tours, type Tour, type NewTour } from './tours.js';
export { pois, type Poi, type NewPoi } from './pois.js';
export { tourPois, type TourPoi, type NewTourPoi } from './tour_pois.js';
