const fetch = require('node-fetch');
const cheerio = require('cheerio');
const _ = require('lodash');
const crypto = require('crypto');
const matchers = require('./matchers'); 

function checkIfPagesAdded() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(id) cnt FROM website_titles`, [], (err, result) => {
            if (err) {
                reject(err);
            }
            return resolve(_.get(result, '0.cnt', 0));
        })
    })
}

async function getHomepage(req, res) {
    const configured = await checkIfPagesAdded();

    res.render('index', {
        title: 'Media.net | Search Engine',
        configured,
    });
}

async function getConfigurationPage(req, res) {
    res.render('configure');
}

function isValidURL(url) {
    if (_.isNull(url)) return false;
    url = url.trim();
    return url.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
}

async function crawlWebpage(url) {
    if (!isValidURL(url)) {
        throw "Not a valid URL";
    }
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const title = $('title').html();

    if (title) {
        const url_hash = crypto.createHash('sha1').update(title).digest('base64');
        try {
            await storeUrl({ title, url, url_hash });
        } catch (err) {
            throw err;
        }
    }
    return title;
}

function storeUrl({ title, url, url_hash }) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT IGNORE INTO website_titles(title, url, url_hash) VALUES(?, ?, ?)`,
        [title, url, url_hash], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

function search({ query, fuzzy }) {
    if (!query) return Promise.resolve(true);

    if (fuzzy) {
        return fuzzySearch(query);
    }
    
    return normalSearch(query);
}

async function normalSearch(query) {
    query = parseQuery(query);
    return await getSearchResults(query);
}

async function fuzzySearch(query) {
    let rankQuery = buildQueryForFuzzySearch(query);
    return await getFuzzySearchResults(rankQuery);
}

function parseQuery(query) {
    query = query.split(' ').join('* ') + '*';
    return query;
}

function buildQueryForFuzzySearch(searchString) {
    let query = [];

    _.map(matchers, (matcher, key) => {
        query.push(matcher('title', searchString));
    });

    query = `( ${ query.join('+') } ) AS rnk`;
    return query;
}

function getSearchResults(query) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT title, url FROM website_titles WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE)`,
        [query], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

function getFuzzySearchResults(rankQuery) {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT
                *
            FROM (
                SELECT
                    title,
                    url,
                    ${ rankQuery }
                FROM
                    website_titles) x
            WHERE
                rnk > 10
            ORDER BY
                rnk DESC;`;

        db.query(query, [], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

module.exports = {
    getHomepage,
    getConfigurationPage,
    crawlWebpage,
    search,
}
