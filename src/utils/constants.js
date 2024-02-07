let apiRoot = ''

// console.log('import.meta.env:',import.meta.env);
// console.log('process.env',process.env);

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://jm-api-7t5n.onrender.com'
}

export const API_ROOT = apiRoot
