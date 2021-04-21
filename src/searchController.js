const fetch = require('node-fetch');
const cheerio = require('cheerio');
const _ = require('lodash');
const crypto = require('crypto');

function checkIfPagesAdded() {
    db.query(`SELECT COUNT(id) cnt FROM website_titles`, [], (err, result) => {
        if (err) {
            throw err;
        }
        return _.get(result, '0.cnt', 0);
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

async function crawlWebpage(req, res) {
    const url = _.get(req, 'body.url', '');
    console.log(url);
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const title = $('title').html();
    if (title) {
        const url_hash = crypto.createHash('sha1').update(title).digest('base64');
        try {
            await storeUrl({ title, url, url_hash });
        } catch (err) {
            console.log(err);
        }
    }
    return res.json({
        isOk: true,
        data: title,
    })
}

function storeUrl({ title, url, url_hash }) {
    db.query(`INSERT IGNORE INTO website_titles(title, url, url_hash) VALUES(?, ?, ?)`,
        [title, url, url_hash], (err, result) => {
            if (err) {
                throw err;
            }
            return true;
        })
}

module.exports = {
    getHomepage,
    getConfigurationPage,
    crawlWebpage,
}
