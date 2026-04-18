const { Project, SyntaxKind } = require("ts-morph");

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const sourceFiles = project.addSourceFilesAtPaths("src/components/calculators/**/*.tsx");
let modifiedCount = 0;

for (const sourceFile of sourceFiles) {
  let fileModified = false;

  // Add import if not exists
  const hasImport = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === "@/lib/sanitize");
  if (!hasImport) {
    sourceFile.addImportDeclaration({
      namedImports: ["sanitizeResult"],
      moduleSpecifier: "@/lib/sanitize",
    });
    fileModified = true;
  }

  // Find all calls to setResult
  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  const targetCalls = callExpressions.filter(c => c.getExpression().getText() === "setResult");
  
  for (const callExpr of targetCalls) {
    const args = callExpr.getArguments();
    if (args.length === 1) {
      const arg = args[0];
      const argText = arg.getText();
      // Skip if already wrapped or just null
      if (!argText.startsWith("sanitizeResult(") && argText !== "null") {
        arg.replaceWithText(`sanitizeResult(${argText})`);
        fileModified = true;
      }
    }
  }

  if (fileModified) {
    sourceFile.saveSync();
    modifiedCount++;
  }
}

console.log(`Successfully fixed ${modifiedCount} calculators.`);
