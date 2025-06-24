const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('mocks/db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

// Custom routes that ignore query parameters
server.use((req, res, next) => {
  req.query = {};
  next();
});

server.get('/api/trip/search', (req, res) => {
  const dbData = router.db.getState();
  res.jsonp(dbData.tripResponse || []);
})

server.get('/api/station/search', (req, res) => {
  const dbData = router.db.getState();
  res.jsonp(dbData.stationResponse || []);
})

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
