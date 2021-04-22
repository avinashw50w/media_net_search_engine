const matchers = {
    exactMatcher: (column, query) => exactMatcher(column, query, 100),
    timesInStringMatcher: (column, query) => timesInStringMatcher(column, query, 67),
    startOfStringMatcher: (column, query) => startOfStringMatcher(column, query, 50),
    acronymMatcher: (column, query) => acronymMatcher(column, query, 42),
    consecutiveCharactersMatcher: (column, query) => consecutiveCharactersMatcher(column, query, 40),
    startOfWordsMatcher: (column, query) => startOfWordsMatcher(column, query, 35),
    studlyCaseMatcher: (column, query) => studlyCaseMatcher(column, query, 32),
    inStringMatcher: (column, query) => inStringMatcher(column, query, 30),
    missingCharacterMatcher: (column, query) => missingCharacterMatcher(column, query, 13),
}

/**
 * for exact match of query
 */
function exactMatcher(column, query, multiplier) {
    return buildSelectQuery({ column, query, multiplier, operator: '=' });
}

/**
 * Matches a string based on how many times the search string appears inside the string
 * it then applies the multiplier for each occurrence.
 * eg, a search for 'tha' would match; 'I hope that that cat has caught that mouse' (3 x 
 * multiplier) or 'Thanks, it was great!' (1 x multiplier)
 */
function timesInStringMatcher(column, query, multiplier) {
    return `${multiplier} * ROUND((CHAR_LENGTH(${column}) - CHAR_LENGTH( REPLACE(LOWER(${column}), '${query}', ''))) / LENGTH('${query}'))`;
}

/**
 * matches the start of the query
 * eg. app =>> apple, apply, ...
 */
function startOfStringMatcher(column, query, multiplier) {
    query = query + '%';
    return buildSelectQuery({ column, query, multiplier, operator: 'LIKE' });
}

/**
 * matches acronyms
 * eg. fb =>> Foo Bar, Free Beer, ...
 */
function acronymMatcher(column, query, multiplier) {
    const regex = /[^0-9a-zA-Z]/g;
    query = query.replace(regex, '');
    query = query.split('').join('% ') + '%';
    return buildSelectQuery({ column, query, multiplier, operator: 'LIKE' });
}

/**
 * matches consecutive characters
 * eg. a search for 'fba' would match; 'Foo Bar' or 'Afraid of bats'
 */
function consecutiveCharactersMatcher(column, query, multiplier) {
    const regex = /[^0-9a-zA-Z]/g;
    new_query = query.replace(regex, '');
    new_query = '%' + new_query.split('').join('% ') + '%';
    multiplier = `ROUND(${multiplier}) * (CHAR_LENGTH('${query}' / CHAR_LENGTH(${column})))`;
    return buildSelectQuery({ column, query, multiplier, operator: 'LIKE' });
}

/**
 Matches the start of each word against each word in a search.
 * eg, a search for 'jo ta' would match; 'John Taylor' or 'Joshua B. Takashi'
 */
function startOfWordsMatcher(column, query, multiplier) {
    const regex = /[^0-9a-zA-Z]/g;
    query = query.replace(regex, '');
    query = query.split(' ').join('% ') + '%';
    return buildSelectQuery({ column, query, multiplier, operator: 'LIKE' });
}

/**
 * Matches Studly Case strings using the first letters of the words only.
 * eg. a search for 'hp' would match; 'HtmlServiceProvider' or 'HashParser' but not 'hasProvider'
 */
function studlyCaseMatcher(column, query, multiplier) {
    const regex = /[^0-9a-zA-Z]/g;
    query = query.replace(regex, '');
    query = query.split('').join('%') + '%';
    return buildSelectQuery({ column, query, multiplier, operator: 'LIKE' });
}

/**
 * Matches against any occurrences of a string within a string and is case-insensitive.
 * eg, a search for 'smi' would match; 'John Smith' or 'Smiley Face'
 */
function inStringMatcher(column, query, multiplier) {
    query = '%' + query + '%';
    return buildSelectQuery({ column, query, multiplier, operator: 'LIKE' });
}

/**
 * Matches strings with missing characters
 * eg. matches avins with Avinash
 */
function missingCharacterMatcher(column, query, multiplier) {
    const regex = /[^0-9a-zA-Z]/g;
    query = query.replace(regex, '');
    query = '%' + query.split('').join('%') + '%';
    return buildSelectQuery({ column, query, multiplier, operator: 'LIKE' });
}

function buildSelectQuery({ column, query, multiplier, operator }) {
    return `IF(${column} ${operator} '${query}', ${multiplier}, 0)`;
}

module.exports = matchers;