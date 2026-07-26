import js from '@eslint/js'; import hooks from 'eslint-plugin-react-hooks';
export default [js.configs.recommended,{files:['src/**/*.{js,jsx}'],languageOptions:{ecmaVersion:2023,sourceType:'module',globals:{window:'readonly',document:'readonly',localStorage:'readonly'}},plugins:{'react-hooks':hooks},rules:{...hooks.configs.recommended.rules,'no-unused-vars':['error',{argsIgnorePattern:'^_'}]}}];
