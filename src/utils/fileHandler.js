const fs = require('fs').promises;

// Lit un fichier JSON et retourne un tableau
const readJSON = async (path) => {
    try {
        const data = await fs.readFile(path, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Écrit un tableau dans un fichier JSON
const writeJSON = async (path, data) => {
    await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = { readJSON, writeJSON };
