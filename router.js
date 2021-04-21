const _ = require('lodash');
const router = require('express').Router();
const searchController = require('./src/searchController');

router.get('/', searchController.getHomepage);
router.get('/configure', searchController.getConfigurationPage);
router.post('/crawl', searchController.crawlWebpage);
router.get('/search', (req, res) => {
    const data = {
        query: _.get(req, 'query.q', ''),
        fuzzy: +(_.get(req, 'query.fuzzy', 0)),
    }
    return searchController.search(data)
        .then((result) => {
            return res.json({
                isOk: true,
                data: result
            })
        })
        .catch((error) => {
            console.log(error);
            return res.json({
                isOk: false,
            })
        })
});

module.exports = router;