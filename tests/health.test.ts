import request from 'supertest';
import { createApp } from '../src/app';

describe('Health route', () => {
  it('returns ok', async () => {
    const app = createApp();

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: 'ok',
      },
    });
  });
});
