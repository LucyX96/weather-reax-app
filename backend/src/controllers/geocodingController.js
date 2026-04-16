/**
 * GeocodingController
 * Handles HTTP requests for geocoding endpoints
 */
class GeocodingController {
  constructor(geocodingService) {
    this.geocodingService = geocodingService;
  }

  /**
   * GET /api/geocode
   * Geocodes a city name
   */
  async geocode(req, res, next) {
    try {
      const { q } = req.query;
      const result = await this.geocodingService.geocodeCity(q);
      res.json(result.toObject());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GeocodingController;
