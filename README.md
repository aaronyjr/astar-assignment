# Take home assignment

## Assumptions

- **Environment Variables**:
  - All environment variables are hardcoded and stored in .env file. Assume these variables are correct before starting the application.

- **No caching**
  - The JWT token is retrieved everytime it is required when calling JWT protected APIs. Assume that caching is not required.

- **Rate limiting**
  - Assume that rate limiting is not required for all APIs.

## Architectural Considerations

- **Code Structure**: 
  - The application code is not separated into different folders (e.g., Routes, Controllers) to simplify viewing. This structure is appropriate for the small codebase but should be refactored as the application grows.

- **No database**:
  - The application does not use a database to store any information. Consider using one when the application scales.

## Steps to Run the App

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aaronyjr/astar-assignment.git
   ```

2. **Navigate to the project folder:**
   ```bash
   cd astar-assignment
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the app:**
   ```bash
   node index
   ```