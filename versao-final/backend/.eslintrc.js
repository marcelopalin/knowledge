module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jest":true    
    },
    "extends": ["airbnb", "prettier"],
    "plugins": ["prettier"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "prettier/prettier": ["error"],
        "func-names": ["error", "never"],
        "no-unused-vars":"off",
        "no-console":"off",
    }
};