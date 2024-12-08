// import {danger, warn} from 'danger'

  
// // No PR is too small to include a description of why you made a change
// if (danger.github.pr.body.length < 10) {
//   warn('Please include a description of your PR changes.');
// }
import { danger, warn, fail } from 'danger';
import { ESLint } from 'eslint';

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
}

// Executar a função lint
lint().catch(error => {
  fail(`Erro ao executar lint: ${error.message}`);
});
