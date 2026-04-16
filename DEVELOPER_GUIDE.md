# Quick Reference Guide - Refactored Architecture

## Directory Navigation

### Backend Quick Paths
```bash
# Models/DTOs
cd backend/src/models/dto/

# Add business logic
cd backend/src/services/

# Add HTTP handlers
cd backend/src/controllers/

# Add external data sources
cd backend/src/repositories/

# Add validation rules
cd backend/src/middleware/
```

### Frontend Quick Paths
```bash
# Smart components (state, logic)
cd frontend/src/containers/

# UI components (props only, no state)
cd frontend/src/component/presentational/

# API calls to backend
cd frontend/src/services/weatherApiService.js

# Data structures
cd frontend/src/models/dto/

# Tests
cd frontend/src/test/
```

---

## Common Tasks

### Backend: Add a New API Endpoint

1. **Create DTO** (if needed):
   ```bash
   # frontend/src/models/dto/myFeature.dto.js
   class MyFeatureInputDTO { /* validation */ }
   class MyFeatureOutputDTO { /* serialization */ }
   ```

2. **Add Repository Method**:
   ```javascript
   // backend/src/repositories/weatherRepository.js
   async fetchMyFeatureData() {
     // Call external API
   }
   ```

3. **Add Service Method**:
   ```javascript
   // backend/src/services/myFeatureService.js
   async getMyFeature() {
     // Orchestrate: validate input → call repository → validate output
   }
   ```

4. **Add Controller Method**:
   ```javascript
   // backend/src/controllers/myFeatureController.js
   async getFeature(req, res, next) {
     const result = await this.service.getMyFeature(req.query);
     res.json(result.toObject());
   }
   ```

5. **Add Middleware Validation**:
   ```javascript
   // backend/src/middleware/validationMiddleware.js
   const validateMyFeature = [
     query('param').isString(),
     // more rules...
   ];
   ```

6. **Wire in Express App**:
   ```javascript
   // backend/src/app.js
   app.get('/api/feature',
     validateMyFeature,
     handleValidationErrors,
     (req, res, next) => featureController.getFeature(req, res, next)
   );
   ```

### Frontend: Add a New Page

1. **Create Presentational Component**:
   ```bash
   # frontend/src/component/MyPage.jsx
   function MyPage({ data, onAction, loading }) {
     return <div>/* Use props only */</div>;
   }
   ```

2. **Create Container**:
   ```bash
   # frontend/src/containers/MyPageContainer.jsx
   function MyPageContainer() {
     const [state, setState] = useState();
     return <MyPage data={state} onAction={...} />;
   }
   ```

3. **Add Route**:
   ```javascript
   // frontend/src/App.jsx
   <Route path="/mypage" element={<MyPageContainer />} />
   ```

### Frontend: Make API Calls

Use the **weatherApiService.js**:
```javascript
import { geocodeCity, getCurrentWeather } from '../services/weatherApiService';

async function doSomething() {
  const geocode = await geocodeCity('Roma');  // Returns GeocodeDTO
  const weather = await getCurrentWeather(geocode.latitude, geocode.longitude);
  // Data is validated and structured
}
```

### Backend: Test a Service

```javascript
// backend/src/services/myService.test.js
import { MyService } from '../services/myService';
import { MyRepository } from '../repositories/myRepository';

describe('MyService', () => {
  it('should work', async () => {
    const mockRepo = { fetchData: vi.fn(() => ({...})) };
    const service = new MyService(mockRepo);
    const result = await service.getData();
    expect(result).toBeDefined();
  });
});
```

### Frontend: Test a Component

```javascript
// frontend/src/test/MyComponent.test.jsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../component/presentational/MyComponent';

describe('MyComponent (Presentational)', () => {
  it('renders with props', () => {
    render(<MyComponent data={mockData} onAction={vi.fn()} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

---

## Data Flow

### Geocoding Request Flow (Backend)
```
HTTP Request → Validation Middleware → GeocodingController
↓
GeocodingService (validate input)
↓
WeatherRepository (call external API)
↓
GeocodeOutputDTO (wrap and validate output)
↓
Controller (serialize to JSON) → HTTP Response
```

### Geocoding Request Flow (Frontend)
```
User Input → HomeContainer
↓
useWeather Hook → weatherApiService
↓
geocodeCity() → API call to /api/geocode
↓
GeocodeDTO (validate response)
↓
Cache (save to localStorage)
↓
Container State Update → Presentational Components (via props)
```

---

## File Organization Rules

### Backend
- **Models**: DTOs with validation logic only
- **Services**: Business logic + orchestration (no HTTP, no DB directly)
- **Repositories**: External data sources only
- **Controllers**: HTTP request parsing + response formatting
- **Middleware**: Input validation + error handling
- **Utils**: Helpers (no side effects)

### Frontend
- **Containers**: State + logic + data fetching
- **Components/Presentational**: UI only, no state
- **Services**: API calls + external integrations
- **Models/DTOs**: Data structure validation
- **Utils**: Helpers (validation, sanitization)

---

## Validation & Error Handling

### Backend DTOs
```javascript
// Always include validate() method
class MyDTO {
  constructor(data) { this.data = data; }
  
  validate() {
    if (!this.data.required) throw new Error('Required field missing');
  }
  
  toObject() {
    return this.data; // Clean serialization
  }
  
  static fromApiResponse(apiData) {
    const dto = new MyDTO(apiData);
    dto.validate();
    return dto;
  }
}
```

### Backend Error Handling
```javascript
// Errors bubble up to middleware/errorHandler
// Error message includes context
throw new Error('Non trovato'); // errorHandler maps to 404
throw new Error('Timeout nella richiesta'); // errorHandler maps to 504
```

### Frontend DTOs
```javascript
// Same pattern as backend
export class MyDTO {
  validate() { /* throw if invalid */ }
  toObject() { /* clean output */ }
  static fromApiResponse(data) { /* create from API */ }
}
```

---

## Performance Tips

1. **Backend**: DTOs validate once, then safe to use
2. **Frontend**: Cache responses using CacheService
3. **Frontend**: Use memoization for expensive components
4. **Backend**: Timeout on external API calls (30s default)
5. **Frontend**: Lazy load routes with React.lazy()

---

## Debugging

### Backend
```bash
# Run with logging
NODE_DEBUG=* npm start

# Check specific route
curl -v http://localhost:3001/api/geocode?q=test

# View request in console
// app.use(morgan('dev')); // already enabled
```

### Frontend
```javascript
// Use ReactDevTools
// Check Network tab in DevTools
// Log state changes in containers
console.log('State updated:', state);
```

---

## Configuration

### Environment Variables
```bash
# backend/.env
PORT=3001
WEATHER_API_KEY=<your-key>
WEATHER_API_URL=https://api.open-meteo.com
WEATHER_GEOCODE_URL=https://geocoding-api.open-meteo.com
```

### Frontend Config
```javascript
// frontend/.env
VITE_API_BASE_URL=http://localhost:3001
```

---

## Quick Checklist for New Features

- [ ] Create DTO with validation
- [ ] Add repository method if needed
- [ ] Add service method
- [ ] Add controller/container
- [ ] Add validation middleware
- [ ] Update tests
- [ ] Document API changes
- [ ] Test with curl/Postman
- [ ] Test frontend integration
- [ ] Update REFACTORING_SUMMARY.md

---

## Common Error Patterns

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot find module" | Wrong import path | Check layer structure |
| DTO validation fails | Invalid data structure | Check API response format |
| API timeout | External service slow | Increase timeout or queue requests |
| State not updating | Container not re-rendering | Check hook dependencies |
| Cache interfering | Stale cache | Clear with ClearAllCache() |

---

## Resources

- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Full architecture docs
- [Backend folder](./backend/src/) - Implementation examples
- [Frontend folder](./frontend/src/) - Component examples
- Open-Meteo API: https://open-meteo.com/

---

## Support

For questions about the architecture:
1. Review REFACTORING_SUMMARY.md
2. Check similar implementation in the codebase
3. Follow the file organization rules
4. Add tests before adding features
