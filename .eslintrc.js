module.exports = {
    "extends": "standard",
    "rules": {
        "semi": "off",
        "semi-spacing": "off",
        "spaced-comment": "off",
        "indent": "off",
        "comma-spacing": "off",
        "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true  }],
        "space-before-function-paren": ["error", { "anonymous": "ignore", "named": "ignore"  }],
        "space-before-blocks": "off",
        "arrow-spacing": "off",
        "block-spacing": "off",
        "keyword-spacing": "off",
        "key-spacing": "off",
        "func-call-spacing": "off",
    },
    "env": {
        "browser": true,
        "es6": true,
        "jquery": true
    },
    "globals":{
        "AV":true
    },
};
