const fs = require('fs');
const util = require('util');

// For now its a static json file,
// maybe later we can input the json file name as an argument
const fileName = 'countries.json';

main();

function main() {
    try {
        const translationKey = _extractTranslationKey(process.argv);

        _outputOfficialCountryNamesForTranslationKey(translationKey, fileName)
            .catch(e => console.error(e.message));
    } catch (e) {
        console.error(e.message);
    }
}
async function _outputOfficialCountryNamesForTranslationKey(translationKey, fileName) {
    const countries = await _importCountries(fileName);

    let officialNames = _getOfficialNamesForTranslationKey(countries, translationKey);

    _outputOfficialNames(translationKey, officialNames);
}

function _extractTranslationKey(argv) {
    const inputArgs = argv.slice(2);
    if ((inputArgs?.length ?? 0) === 0) {
        throw new Error('Translation key was not inserted');
    } else if (inputArgs.length > 1) {
        throw new Error('Only one translation key should be inserted');
    }
    return inputArgs[0];
}

function _importCountries(fileName) {
    return util.promisify(fs.readFile)(fileName)
        .then(data => JSON.parse(data));
}

function _getOfficialNamesForTranslationKey(countries, translationKey) {
    return countries
        .map(country => country?.translations)
        .map(translations => translations?.[translationKey])
        .map(translation => translation?.official)
        .filter(name => name);
}

function _outputOfficialNames(translationKey, officialNames) {
    if ((officialNames?.length ?? 0) === 0) {
        console.log('The translation key does not exist');
    } else {
        console.log(`The official names of all countries using the translation key '${translationKey}':`)
        officialNames.forEach(officialName => console.log(officialName));
    }
}
