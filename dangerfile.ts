// import {danger, warn} from 'danger'

  
// // No PR is too small to include a description of why you made a change
// if (danger.github.pr.body.length < 10) {
//   warn('Please include a description of your PR changes.');
// }
import { danger, warn, fail } from 'danger';
import { ESLint } from 'eslint';
import semver from 'semver';

// Exemplo: Verificar se arquivos importantes foram modificados
if (!danger.git.modified_files.includes('README.md')) {
  warn('Você não modificou o README.md.');
}

async function lint() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(['src/**/*.ts']);

  for (const result of results) {
    for (const message of result.messages) {
      if (message.severity === 2) {
        // Erros
        fail(`ESLint Error: ${result.filePath} [${message.line},${message.column}]: ${message.message}`);
      } else if (message.severity === 1) {
        // Avisos
        warn(`ESLint Warning: ${result.filePath} [${message.line},${message.column}]: ${message.message}`);
      }
    }
  }

  const files = danger.git.modified_files;
  console.log(files);

  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      const content = await danger.github.utils.fileContents(file);
      console.log(content);
      if (/setInterval\s*\(/.test(content)) {
        warn(`Uso de setInterval detectado no arquivo ${file}. Considere usar alternativas como RxJS.`);
      }

      if (/setTimeout\s*\(/.test(content)) {
        warn(`Uso de setTimeout detectado no arquivo ${file}. Verifique se é necessário.`);
      }
    }
  }

  // Verificar a versão mínima do Angular
  // const packageJsonContent = await danger.github.utils.fileContents('package.json');
  // if (packageJsonContent) {
  //   const pkg = JSON.parse(packageJsonContent);
  //   const angularVersion = pkg.dependencies['@angular/core'];
  //   const versionMatch = angularVersion.match(/(\d+)\.(\d+)\.(\d+)/);
  //   console.log("versionMatch:",versionMatch)
  //   if (versionMatch && versionMatch.length >= 2) {
  //     const major = parseInt(versionMatch[1], 10);
  //     console.log("major:",major)
  //     if (major < 33) {
  //       warn(`A versão do Angular é ${angularVersion}. A versão mínima requerida é 33.`);
  //     }
  //   } else {
  //     warn('Não foi possível determinar a versão do Angular.');
  //   }
  // }

    // Verificar a versão mínima do Angular utilizando semver npm
    const packageJsonContent = await danger.github.utils.fileContents('package.json');
    if (packageJsonContent) {
      const pkg = JSON.parse(packageJsonContent);
      const angularVersion = pkg.dependencies && pkg.dependencies['@angular/core'];
  
      if (angularVersion) {
        // Tentar obter a versão do Angular usando semver
        const coercedVersion = semver.coerce(angularVersion);
  
        if (coercedVersion) {
          // Verificar se a versão é menor que 33.0.0
          if (semver.lt(coercedVersion, '33.0.0')) {
            warn(`A versão do Angular é ${angularVersion}. A versão mínima requerida é 33.`);
          }
        } else {
          warn('Não foi possível determinar a versão do Angular usando semver.');
        }
      } else {
        warn('Não foi encontrada a dependência @angular/core no package.json.');
      }
    }
}

// Executar a função lint
lint().catch(error => {
  fail(`Erro ao executar lint: ${error.message}`);
});
// nothing changed

