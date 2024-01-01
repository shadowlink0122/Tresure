import request from 'supertest';

const TEST_TOPPAGE_URL = '/';

describe('continuous', () => {
  const agent = request.agent('http://localhost:3000');
  const getRequestWithParams = async () => {
    return await agent.get(TEST_TOPPAGE_URL);
  }

  describe('GET request', () => {
    describe('成功パターン', () => {
      it('パラメータを指定しない', async () => {
        const getTopPageResult = await getRequestWithParams();
        expect(getTopPageResult.status).toBe(200);
      });
    })
  });
});
