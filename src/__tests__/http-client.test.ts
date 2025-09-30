import { HttpClient } from '../http-client';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup axios.create mock
    const mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    httpClient = new HttpClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
    });
  });

  it('should create axios instance with correct config', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should create axios instance with custom headers', () => {
    const customHeaders = { 'X-API-Key': 'test-key' };
    
    new HttpClient({
      baseURL: 'https://api.example.com',
      headers: customHeaders,
    });

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com',
      timeout: 30000, // default timeout
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key',
      },
    });
  });

  // Note: Due to the complexity of testing interceptors and error handling
  // in this mock setup, we're keeping the tests simple. In a real-world scenario,
  // you might want to test error handling more thoroughly with integration tests.
});
