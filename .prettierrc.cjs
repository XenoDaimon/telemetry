module.exports = {
    arrowParens: 'always',
    bracketSameLine: true,
    printWidth: 120,
    singleAttributePerLine: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    overrides: [
        {
            files: ['tsconfig*.json'],
            options: {
                parser: 'json',
                trailingComma: 'none',
            },
        },
    ],
};
