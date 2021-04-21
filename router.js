const router = require('express').Router();
const searchController = require('./src/searchController');

router.get('/', searchController.getHomepage);
router.get('/configure', searchController.getConfigurationPage);
router.post('/crawl', searchController.crawlWebpage);

module.exports = router;