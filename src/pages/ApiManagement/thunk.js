import { mockApis, availableApis } from './mock';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchApiList = async () => {
  await delay(300);
  return mockApis;
};

export const fetchAvailableApis = async (auth) => {
  await delay(300);
  return availableApis[auth] || null;
};

export const fetchApiModules = async (auth) => {
  await delay(300);
  return availableApis[auth]?.modules || [];
};

export const fetchFilteredApis = async ({ auth, name, scope, needReview }) => {
  await delay(300);
  let apis = availableApis[auth]?.apis || [];

  if (name) {
    apis = apis.filter(api => api.name.includes(name));
  }
  if (scope) {
    apis = apis.filter(api => api.scope.includes(scope));
  }
  if (needReview !== undefined && needReview !== 'all') {
    const needReviewBool = needReview === 'true';
    apis = apis.filter(api => api.needReview === needReviewBool);
  }
  return apis;
};