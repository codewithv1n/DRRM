import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const distDir = path.resolve('./dist');

function obfuscateDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      obfuscateDirectory(fullPath);
    } else if (fullPath.endsWith('.js')) {
      if (file.startsWith('vendor-') || file.includes('vendor')) {
        console.log(`Skipping vendor file: ${file}`);
        continue;
      }

      const code = fs.readFileSync(fullPath, 'utf8');
      
      const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: false,
        shuffleStringArray: true,
        splitStrings: false,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        transformObjectKeys: false,
        unicodeEscapeSequence: false
      });
      
      fs.writeFileSync(fullPath, obfuscationResult.getObfuscatedCode(), 'utf8');
      console.log(`Obfuscated: ${fullPath}`);
    }
  }
}

console.log('Obfuscating production build...');
obfuscateDirectory(distDir);
console.log('Obfuscation complete!');
