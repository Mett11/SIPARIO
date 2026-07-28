const fs = require('fs');
let code = fs.readFileSync('src/pages/PrenotaPage.tsx', 'utf8');

code = code.replace(/const \[privacyConsented,[\s\S]*?setPrivacyConsented\] = useState\(false\);/, "const [privacyConsented, setPrivacyConsented] = useState(false);");

fs.writeFileSync('src/pages/PrenotaPage.tsx', code);
