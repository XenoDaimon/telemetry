const tsConfigJson = require('./tsconfig.json');

/**
 * @param {Object} tsconfigJson
 *
 * @returns {string}
 */
function buildRegexForTsConfigPaths(tsconfigJson) {
    if (tsconfigJson.compilerOptions?.paths) {
        const paths = Object.keys(tsconfigJson.compilerOptions.paths).join('|');

        return `^(?!\\.|${paths})`;
    }

    return `^(?!\\.)`;
}

/**
 * @param {Object} options
 * @param {string} options.tsconfigRootDir - Path of directory where tsConfig sits.
 */
function typescriptExtends(options) {
    return {
        extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:prettier/recommended',
        ],
        parser: '@typescript-eslint/parser',
        parserOptions: {
            ecmaVersion: 'latest',
            project: 'tsconfig.json',
            sourceType: 'module',
            tsconfigRootDir: options.tsconfigRootDir,
        },
    };
}

const commonRules = {
    'sort-keys': ['error', 'asc', { natural: true }],
};

/**
 * @param {Object} options
 * @param {string | undefined} options.importSortGroupPattern - Pattern used to sort imports.
 * @param {string[]} options.noRestrictedImportsPattern - Pattern used to forbid imports.
 */
function typescriptRules(options) {
    return {
        '@typescript-eslint/explicit-function-return-type': ['error'],
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
                overrides: {
                    accessors: 'explicit',
                    constructors: 'explicit',
                    methods: 'explicit',
                    parameterProperties: 'explicit',
                    properties: 'explicit',
                },
            },
        ],
        '@typescript-eslint/interface-name-prefix': ['off'],
        '@typescript-eslint/member-ordering': [
            'error',
            {
                default: {
                    order: 'alphabetically-case-insensitive',
                },
            },
        ],
        '@typescript-eslint/no-explicit-any': ['error'],
        '@typescript-eslint/no-non-null-assertion': ['error'],
        '@typescript-eslint/no-unused-vars': ['error'],
        'import/first': ['error'],
        'import/newline-after-import': ['error'],
        'import/no-duplicates': ['error'],
        'no-restricted-imports': [
            'error',
            {
                patterns: options?.noRestrictedImportsPattern ?? [],
            },
        ],
        'no-return-await': ['error'],
        'padding-line-between-statements': ['error', { blankLine: 'always', next: 'return', prev: '*' }],
        'require-await': ['error'],
        'simple-import-sort/imports': [
            'error',
            {
                groups: [[options.importSortGroupPattern]],
            },
        ],
    };
}

module.exports = {
    env: {
        browser: true,
        es2022: true,
        jest: true,
        node: true,
    },
    ignorePatterns: ['**/dist/', '**/node_modules/'],
    plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
    root: true,
    overrides: [
        // add rules for js files
        {
            extends: ['eslint:recommended', 'plugin:prettier/recommended'],
            files: ['*.cjs', '*.js', '*.mjs'],
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            rules: {
                ...commonRules,
            },
        },
        {
            ...typescriptExtends({ tsconfigRootDir: '.' }),
            files: ['**/*.{ts,tsx}', '**/*.{ts,tsx}'],
            rules: {
                ...commonRules,
                ...typescriptRules({
                    importSortGroupPattern: buildRegexForTsConfigPaths(tsConfigJson),
                    noRestrictedImportsPattern: ['./*', '../*'],
                }),
            },
        },
    ],
};
