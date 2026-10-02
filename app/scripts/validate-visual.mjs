//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

/**
 * validate:visual — static check for this app's Vega-Lite specs.
 *
 * The host plugin requires this script for any app that renders visuals. It runs
 * offline, so it cannot prove a chart looks right — open the app in the Fabric
 * portal and check it (see the app-validation skill). Of the specs it can read,
 * it checks that:
 *
 *   1. every spec is valid JSON and an object
 *   2. every spec validates against the official Vega-Lite JSON schema, when
 *      the schema and a validator are installed
 *   3. every spec resolves to a mark somewhere (unit or composite)
 *   4. a selection param above a root multi-child `layer` is scoped to a child
 *
 * 3 is not redundant with 2: the schema requires `mark` on a unit spec but
 * accepts an empty composite such as `{ layer: [] }`, which renders nothing. It
 * is also the fallback for every shape when the schema cannot be compiled.
 *
 * A spec prop the compiler can judge — missing, bare, or a non-string value — is
 * left to `npm run typecheck`, a required gate that runs first, and reported
 * here as a note rather than a second failure.
 *
 * Authored rows are judged by position. Rows the top-level spec draws in a
 * model-backed app fail, because the chart is then showing something other than
 * the model it connects to. Rows on a child layer are reported instead, since
 * that is equally how a threshold or annotation is drawn beside the model's
 * data.
 *
 * Specs are read from .json under src/queries/ and from object literals in
 * source, parsed with the TypeScript compiler so a spec is resolved as a binding
 * and each <VegaVisual> is tracked as its own element.
 *
 * An app with no specs is not a failure: the visuals capability is selected from
 * words like "table" and "report", so a CRUD list legitimately arrives here with
 * nothing to check.
 *
 * Emits status "complete", "incomplete", or "failed". A runtime or computed
 * spec that could not be schema-checked is incomplete, not successful.
 * Incomplete coverage exits nonzero when zero schemas were checked and exits
 * zero when coverage is partial. `--allow-incomplete` permits only the
 * zero-schema case to proceed to browser validation; it never hides a tooling
 * or spec failure.
 */

import { constants } from 'node:fs';
import { access, readdir, readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const rootFlag = args.indexOf('--root');
const allowIncomplete = process.argv.includes('--allow-incomplete');
const argumentFailures = [];
const rootArgument = rootFlag === -1 ? undefined : args[rootFlag + 1];
if (
  rootFlag !== -1 &&
  (rootArgument === undefined || rootArgument.startsWith('--'))
) {
  argumentFailures.push(
    '`--root` requires a directory path and cannot consume another option as its value.'
  );
}
const root =
  rootArgument !== undefined && !rootArgument.startsWith('--')
    ? path.resolve(rootArgument)
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'packages', 'frontend', 'src');
const queriesDir = path.join(sourceRoot, 'queries');
const failures = [...argumentFailures];
const notes = [];
try {
  await access(root, constants.R_OK);
  const rootStat = await stat(root);
  if (!rootStat.isDirectory()) {
    failures.push(`Validation root ${root} is not a directory.`);
  }
} catch (error) {
  failures.push(
    `Validation root ${root} does not exist or cannot be read (${error.code ?? 'unknown error'}).`
  );
}

async function walk(directory) {
  const found = [];
  const entries = await readdir(directory, { withFileTypes: true }).catch(
    (error) => {
      // A missing directory is ordinary - not every app has src/queries. Any
      // other failure means files exist here that this run cannot see, so it
      // must not be reported as an empty directory.
      if (error.code !== 'ENOENT') {
        failures.push(
          `${path.relative(root, directory) || '.'} could not be listed (${error.code ?? 'unknown error'}), so` +
            ' anything inside it was not checked.'
        );
      }
      return [];
    }
  );
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(target)));
    else if (entry.isFile()) found.push(target);
  }
  return found;
}

/**
 * Resolves a package from the app being checked.
 *
 * Node's own resolution, anchored at the app, so a hoisted parent
 * `node_modules` still works. Never a bare specifier: that resolves from beside
 * this script, which under `--root` means checking an app with a toolchain it
 * never declared.
 */
function resolveFromApp(specifier) {
  try {
    return createRequire(
      path.join(root, 'packages', 'frontend', 'package.json')
    ).resolve(specifier);
  } catch {
    return null;
  }
}

/**
 * Compiles the official Vega-Lite schema.
 *
 * The visuals pack declares both `ajv` and `vega-lite`, so in an app that
 * applied the pack and installed, this resolves. Missing dependencies and
 * installed-but-broken schema tooling are distinguished so the recovery
 * message describes the actual failure.
 *
 * Returns either a compiled validator or a detailed tooling failure.
 */
async function loadSchemaValidator() {
  // The `exports` map publishes only this short specifier; the `build/...` path
  // the file actually lives at throws ERR_PACKAGE_PATH_NOT_EXPORTED.
  const schemaPath = resolveFromApp('vega-lite/vega-lite-schema.json');
  if (schemaPath === null) {
    return {
      status: 'failed',
      error:
        'The installed app cannot resolve `vega-lite/vega-lite-schema.json`. Reapply the visuals pack and run `npm install`.',
    };
  }
  let schemaText;
  try {
    schemaText = await readFile(schemaPath, 'utf8');
  } catch (error) {
    return {
      status: 'failed',
      error: `The Vega-Lite schema could not be read: ${error.message ?? String(error)}.`,
    };
  }
  let schema;
  try {
    schema = JSON.parse(schemaText);
  } catch (error) {
    return {
      status: 'failed',
      error: `The installed Vega-Lite schema is not valid JSON: ${error.message ?? String(error)}.`,
    };
  }
  const entry = resolveFromApp('ajv');
  if (entry === null) {
    return {
      status: 'failed',
      error:
        'The installed app cannot resolve `ajv`. Reapply the visuals pack and run `npm install`.',
    };
  }
  let local;
  try {
    local = await import(pathToFileURL(entry).href);
  } catch (error) {
    return {
      status: 'failed',
      error: `The installed AJV module could not be loaded: ${error.message ?? String(error)}.`,
    };
  }
  // ajv 8's CommonJS build nests the class one level deeper under interop.
  const Ajv = local?.default?.default ?? local?.default;
  if (typeof Ajv !== 'function') {
    return {
      status: 'failed',
      error:
        'The installed AJV module exposes no validator constructor. Reinstall the visuals pack dependencies.',
    };
  }
  try {
    // The schema names three formats: `uri`, `uri-reference` and `color-hex`.
    // ajv 8 ships none of them, since formats moved to `ajv-formats`. An unknown
    // format is fatal at compile time, which is what the stubs below are for.
    //
    // `strict: false` is for something else. ajv 8's strict mode audits how the
    // *schema* is written, and Vega-Lite's trips it with `missing type "number"
    // for keyword "minimum"` even once the formats are stubbed. That is a
    // property of a schema this app does not control, so strict is not an
    // option here. What it costs is `strictNumbers`: with strict off, a
    // non-finite number validates as a `number`. JSON cannot write `NaN`, but
    // an overflowing literal like `1e999` parses to `Infinity`, so that one
    // shape is accepted where strict would reject it. Every structural rule
    // still runs.
    //
    // `validateSchema: false` skips re-validating a schema Vega-Lite already
    // publishes as correct.
    const ajv = new Ajv({
      strict: false,
      allErrors: true,
      validateSchema: false,
    });
    // Stubbed rather than implemented: a format ajv cannot check is no reason
    // to fail a spec, and an unknown one stops compilation outright.
    for (const format of ['color-hex', 'uri', 'uri-reference']) {
      if (typeof ajv.addFormat === 'function')
        ajv.addFormat(format, () => true);
    }
    return { status: 'ready', validate: ajv.compile(schema) };
  } catch (error) {
    return {
      status: 'failed',
      error: `The installed Vega-Lite schema could not be compiled by AJV: ${error.message ?? String(error)}.`,
    };
  }
}

/** ajv 8 reports the failing location as a JSON pointer in `instancePath`. */
const errorPath = (error) => {
  const base = error.instancePath ?? error.dataPath ?? '';
  const property =
    error.params?.missingProperty ?? error.params?.additionalProperty;
  return property === undefined ? base : `${base}/${property}`;
};

/**
 * The most specific error in an ajv report.
 *
 * A Vega-Lite spec is a deep union, so one bad property produces dozens of
 * errors as every branch of every `anyOf` fails in turn. The deepest path is
 * the one that names the actual property; the shallow ones only say that some
 * branch above it did not match.
 */
function mostSpecificError(errors) {
  let best = null;
  for (const error of errors ?? []) {
    const pathDepth = errorPath(error).length;
    const bestPathDepth = best === null ? -1 : errorPath(best).length;
    const schemaDepth = error.schemaPath?.length ?? 0;
    const bestSchemaDepth = best?.schemaPath?.length ?? -1;
    if (
      best === null ||
      pathDepth > bestPathDepth ||
      (pathDepth === bestPathDepth && schemaDepth > bestSchemaDepth)
    )
      best = error;
  }
  return best;
}

function classifyValidation({
  failureCount,
  schemasChecked,
  uncheckedSpecs,
  coverageUnavailable,
  allowIncomplete,
}) {
  const coverage =
    coverageUnavailable || (failureCount > 0 && schemasChecked === 0)
      ? 'none'
      : uncheckedSpecs === 0
        ? 'complete'
        : schemasChecked === 0
          ? 'none'
          : 'partial';
  const status =
    failureCount > 0
      ? 'failed'
      : uncheckedSpecs > 0
        ? 'incomplete'
        : 'complete';
  const ok = status === 'complete';
  const exitCode =
    status === 'failed' ||
    (status === 'incomplete' && coverage === 'none' && !allowIncomplete)
      ? 1
      : 0;
  return { coverage, status, ok, exitCode };
}

/**
 * Where a spec authors its own rows: `top` when rows the chart draws are
 * hard-coded, `child` when only an annotation layer's are, or null.
 *
 * Only `layer` earns the exception, because layers share one view — a layer with
 * its own rows is a threshold or annotation over the model's data. `concat`,
 * `hconcat`, `vconcat`, `facet` and `repeat` produce separate charts, so a
 * hard-coded panel there is the same fault one nesting down; those recurse and
 * keep whatever the child reports.
 *
 * `datasets` needs care. `{ datasets: { d: [...] }, data: { name: "d" } }` is the
 * named spelling of authored rows, which the schema accepts. It is top-level
 * only, so position follows the `data` that consumes the name rather than where
 * the rows are written — hence the names travelling down the recursion.
 */
function authoredRowsAt(spec, inheritedNames = new Set()) {
  if (spec === null || typeof spec !== 'object') return null;
  const named = new Set(inheritedNames);
  if (
    spec.datasets !== null &&
    typeof spec.datasets === 'object' &&
    !Array.isArray(spec.datasets)
  ) {
    for (const name of Object.keys(spec.datasets)) named.add(name);
  }

  /** Whether this node's own `data` holds or names authored rows. */
  const drawsAuthoredRows = (node) => {
    const data = node?.data;
    if (data === null || typeof data !== 'object') return false;
    if ('values' in data) return true;
    return typeof data.name === 'string' && named.has(data.name);
  };

  if (drawsAuthoredRows(spec)) return 'top';

  // A layer over the same view is an annotation; anything that yields its own
  // chart is judged as one in its own right.
  if (Array.isArray(spec.layer)) {
    for (const child of spec.layer) {
      if (drawsAuthoredRows(child) || authoredRowsAt(child, named) !== null) {
        return 'child';
      }
    }
  }
  const panels = [];
  for (const key of ['concat', 'hconcat', 'vconcat']) {
    if (Array.isArray(spec[key])) panels.push(...spec[key]);
  }
  for (const key of ['spec', 'facet', 'repeat']) {
    if (spec[key] !== null && typeof spec[key] === 'object') {
      panels.push(spec[key]);
    }
  }
  for (const panel of panels) {
    // A panel drawing rows named by the root is hard-coding its own data, and
    // the root is the only place that name could have been declared.
    if (drawsAuthoredRows(panel)) return 'top';
    const nested = authoredRowsAt(panel, named);
    if (nested !== null) return nested;
  }
  // Rows declared and never drawn are dead weight, not a wrong chart.
  return null;
}

/**
 * The TypeScript compiler, or null when no usable compiler API is available.
 *
 * Null does not only mean "not installed". TypeScript 7 is the Go port and drops
 * the legacy JS compiler API, so `createSourceFile` is absent even though the
 * package resolves — which is why this repo pins a 5.x copy under the
 * `typescript-compiler` alias. A generated app on 5.x is fine; the same app after
 * a bump to 7.x lands here with TypeScript very much installed.
 *
 * The caller treats null as a failure either way, since every inline spec goes
 * unread without it. Loaded defensively so the report names the problem rather
 * than crashing with a module-resolution stack trace.
 */
async function loadTypeScript() {
  try {
    const entry = resolveFromApp('typescript');
    if (entry === null) return null;
    const module = await import(pathToFileURL(entry).href);
    // TypeScript is CJS, and the shape of the namespace depends on how it was
    // resolved: sometimes the API is the default export, sometimes it is the
    // namespace itself. Pick whichever one actually carries the API.
    const candidates = [module, module?.default, module?.default?.default];
    return (
      candidates.find(
        (candidate) => typeof candidate?.createSourceFile === 'function'
      ) ?? null
    );
  } catch {
    return null;
  }
}

/**
 * A syntax node as a plain value, or NOT_STATIC when reading it would mean
 * running the program.
 *
 * Correctness matters more than coverage here. A spec this cannot resolve with
 * certainty must be reported as unchecked rather than guessed at, because a
 * wrong reading would fail a chart that renders perfectly. Only literals are
 * accepted: an identifier, a call, a spread, a template string or a computed key
 * all stop the conversion.
 *
 * `resolve` is the one exception. When supplied, a shorthand property looks its
 * binding up in the enclosing scope, so `{ columns, rows }` reads as the object
 * it plainly is. Without it that object is NOT_STATIC, which callers judging
 * authored rows read as "no rows" — the wrong answer for the same value written
 * longhand.
 */
const NOT_STATIC = Symbol('not-static');

function literalValue(ts, node, resolve) {
  if (node === undefined) return NOT_STATIC;
  switch (node.kind) {
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
      return node.text;
    case ts.SyntaxKind.NumericLiteral:
      return Number(node.text);
    case ts.SyntaxKind.TrueKeyword:
      return true;
    case ts.SyntaxKind.FalseKeyword:
      return false;
    case ts.SyntaxKind.NullKeyword:
      return null;
    case ts.SyntaxKind.PrefixUnaryExpression: {
      // Negative numbers arrive as a unary minus over a numeric literal.
      if (node.operator !== ts.SyntaxKind.MinusToken) return NOT_STATIC;
      const operand = literalValue(ts, node.operand, resolve);
      return typeof operand === 'number' ? -operand : NOT_STATIC;
    }
    case ts.SyntaxKind.ParenthesizedExpression:
      return literalValue(ts, node.expression, resolve);
    case ts.SyntaxKind.AsExpression:
    case ts.SyntaxKind.SatisfiesExpression:
      // `{...} as const` / `satisfies TopLevelSpec` - the value is the operand.
      return literalValue(ts, node.expression, resolve);
    case ts.SyntaxKind.ArrayLiteralExpression: {
      const items = [];
      for (const element of node.elements) {
        const value = literalValue(ts, element, resolve);
        if (value === NOT_STATIC) return NOT_STATIC;
        items.push(value);
      }
      return items;
    }
    case ts.SyntaxKind.ObjectLiteralExpression: {
      const object = {};
      for (const property of node.properties) {
        // `{ rows }` - the value is whatever `rows` is bound to. Readable only
        // when the caller supplied a resolver; otherwise the whole object is
        // NOT_STATIC, exactly as it was before.
        if (ts.isShorthandPropertyAssignment(property)) {
          if (resolve === undefined) return NOT_STATIC;
          const bound = resolve(property.name.text, property);
          if (bound === undefined) return NOT_STATIC;
          const value = literalValue(ts, bound, resolve);
          if (value === NOT_STATIC) return NOT_STATIC;
          object[property.name.text] = value;
          continue;
        }
        if (!ts.isPropertyAssignment(property)) return NOT_STATIC;
        const name = property.name;
        let key;
        if (ts.isIdentifier(name)) key = name.text;
        else if (ts.isStringLiteral(name) || ts.isNumericLiteral(name))
          key = name.text;
        else return NOT_STATIC;
        const value = literalValue(ts, property.initializer, resolve);
        if (value === NOT_STATIC) return NOT_STATIC;
        object[key] = value;
      }
      return object;
    }
    default:
      return NOT_STATIC;
  }
}

/**
 * What `name` refers to at `usedAt`: a value with its initializer, something
 * that comes from outside (an import, a parameter, a destructured prop), or
 * nothing at all.
 *
 * Resolved lexically, walking outward from the usage. `let` and `const` stop at
 * the nearest enclosing block; `var` is hoisted to its function, so treating it
 * as block-scoped would miss it and report a working chart as having no spec.
 * This approximates JavaScript scoping rather than implementing it — the exact
 * answer needs a `TypeChecker`, which means building a whole Program.
 *
 * The three-way answer matters: a spec imported from .json or handed down as a
 * prop is real and simply not this file's to read, while a name with no
 * declaration anywhere is a chart with nothing to draw.
 */
function resolveName(ts, sourceFile, name, usedAt) {
  for (let scope = usedAt; scope !== undefined; scope = scope.parent) {
    const hit = declaredDirectlyIn(ts, scope, name, false);
    if (hit !== undefined) return hit;
    if (scope === sourceFile) break;
  }
  // Nothing block-scoped matched. A `var` belongs to its function however deeply
  // it is nested, so look again ignoring block boundaries.
  for (let scope = usedAt; scope !== undefined; scope = scope.parent) {
    const hit = declaredDirectlyIn(ts, scope, name, true);
    if (hit !== undefined) return hit;
    if (scope === sourceFile) break;
  }
  return undefined;
}

function declaredDirectlyIn(ts, scope, name, hoisted) {
  const named = (node) =>
    node.name !== undefined &&
    ts.isIdentifier(node.name) &&
    node.name.text === name;
  const isFunction = (node) =>
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node);
  // A binding inside a nested scope belongs to it, not to the scope being
  // searched, so an unrelated sibling block must not answer for the binding
  // JavaScript would actually resolve. On the hoisted pass only functions stop
  // the walk, because that is the boundary `var` respects.
  const opensScope = (node) =>
    isFunction(node) ||
    (!hoisted &&
      (ts.isBlock(node) ||
        ts.isForStatement(node) ||
        ts.isForInStatement(node) ||
        ts.isForOfStatement(node) ||
        ts.isWhileStatement(node) ||
        ts.isDoStatement(node) ||
        ts.isCaseBlock(node) ||
        ts.isCatchClause(node)));
  let found;
  const visit = (node) => {
    if (found !== undefined) return;
    if (node !== scope && opensScope(node)) return;
    if (ts.isVariableDeclaration(node) && named(node)) {
      const isVar =
        node.parent !== undefined &&
        ts.isVariableDeclarationList(node.parent) &&
        (node.parent.flags & (ts.NodeFlags.Let | ts.NodeFlags.Const)) === 0;
      if (hoisted === isVar) {
        found = { kind: 'value', initializer: node.initializer };
        return;
      }
    }
    if (
      !hoisted &&
      named(node) &&
      (ts.isImportSpecifier(node) ||
        ts.isImportClause(node) ||
        ts.isNamespaceImport(node) ||
        ts.isParameter(node) ||
        ts.isBindingElement(node))
    ) {
      found = { kind: 'external' };
      return;
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(scope, visit);
  return found;
}

/**
 * The local names `VegaVisual` is bound to in this file.
 *
 * `import { VegaVisual as Visual }` renders as `<Visual>`, and a namespace
 * import renders as `<fv.VegaVisual>`. Matching the literal tag name only would
 * let either bypass every check in this script.
 */
function vegaVisualNames(ts, sourceFile) {
  const names = new Set(['VegaVisual']);
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const bindings = statement.importClause?.namedBindings;
    if (bindings === undefined) continue;
    if (ts.isNamespaceImport(bindings)) {
      names.add(`${bindings.name.text}.VegaVisual`);
      continue;
    }
    if (!ts.isNamedImports(bindings)) continue;
    for (const element of bindings.elements) {
      const imported = element.propertyName?.text ?? element.name.text;
      if (imported === 'VegaVisual') names.add(element.name.text);
    }
  }
  // `const Visual = VegaVisual` re-binds a name already known to be the
  // component. Repeated until nothing new appears, so a chain of re-binds
  // resolves too.
  for (let changed = true; changed; ) {
    changed = false;
    const visit = (node) => {
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.initializer !== undefined &&
        (ts.isIdentifier(node.initializer) ||
          ts.isPropertyAccessExpression(node.initializer)) &&
        names.has(node.initializer.getText(sourceFile)) &&
        !names.has(node.name.text)
      ) {
        names.add(node.name.text);
        changed = true;
      }
      ts.forEachChild(node, visit);
    };
    ts.forEachChild(sourceFile, visit);
  }
  return names;
}

function collectVisuals(ts, sourceFile, relative) {
  const names = vegaVisualNames(ts, sourceFile);
  const visuals = [];
  const visit = (node) => {
    const opening = ts.isJsxSelfClosingElement(node)
      ? node
      : ts.isJsxElement(node)
        ? node.openingElement
        : undefined;
    if (opening !== undefined) {
      const tag = opening.tagName.getText(sourceFile);
      // A tag this file cannot tie back to the import is still a visual if it
      // takes a `spec` prop - a component re-exported through a barrel, say.
      // Following that would mean resolving the module graph, so instead of
      // guessing it is counted and reported. Never failed: the prop could
      // belong to some other component entirely, and a wrong failure blocks a
      // working app.
      const known = names.has(tag);
      const hasSpecProp = opening.attributes.properties.some((property) => {
        if (ts.isJsxAttribute(property))
          return property.name.getText(sourceFile) === 'spec';
        // A spec can arrive through a spread too, so the fallback has to look
        // inside static ones rather than only at named attributes.
        if (!ts.isJsxSpreadAttribute(property)) return false;
        const spread = property.expression;
        if (spread === undefined || !ts.isObjectLiteralExpression(spread))
          return false;
        return specFromObjectLiteral(ts, spread).expression !== undefined;
      });
      if (known || hasSpecProp) {
        const line =
          sourceFile.getLineAndCharacterOfPosition(opening.getStart(sourceFile))
            .line + 1;
        const read = known
          ? readSpecProp(ts, sourceFile, opening)
          : { state: 'runtime' };
        visuals.push({
          label: `${relative}:${line} <${tag}>`,
          ...read,
          // Only for a tag tied back to the import. An unrecognised component is
          // never failed - see above - and its `data` prop may not even be a
          // DataTable, so reading rows out of it would block a working app.
          authoredData: known && authoredDataProp(ts, sourceFile, opening),
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sourceFile, visit);
  return visuals;
}

/**
 * Whether a `data` prop is a table of rows written into the source.
 *
 * The prop is the documented way to pass rows, and static rows through it are
 * legitimate in a sample-data app - the caller decides, by only asking when a
 * model is connected. It exists because rows moved out of `data.values` and
 * into this prop are the same invented figures, and were passing the check that
 * catches them in the spec.
 *
 * Deliberately conservative: it reads the last `data` written as a named
 * attribute, and gives up if a spread after that one could still replace it -
 * the same last-wins scan the spec reader does, so a definitive attribute
 * written after a spread is still read. Only a table written out here counts,
 * so `toDataTable(result)` and anything from a hook never reach it. A table
 * arriving through a spread is not read - missed rather than guessed at,
 * because a wrong failure here blocks a working app.
 */
function authoredDataProp(ts, sourceFile, opening) {
  let attribute;
  let unknownAfter = false;
  for (const property of opening.attributes.properties) {
    if (
      ts.isJsxAttribute(property) &&
      property.name !== undefined &&
      property.name.getText(sourceFile) === 'data'
    ) {
      attribute = property;
      unknownAfter = false;
      continue;
    }
    // A spread after the attribute is last-wins. Its contents are not resolved
    // here, so it only matters when nothing definitive follows it.
    if (ts.isJsxSpreadAttribute(property) && attribute !== undefined)
      unknownAfter = true;
  }
  if (attribute === undefined || unknownAfter) return false;
  const initializer = attribute.initializer;
  if (
    initializer === undefined ||
    !ts.isJsxExpression(initializer) ||
    initializer.expression === undefined
  ) {
    return false;
  }
  let expression = initializer.expression;
  if (ts.isIdentifier(expression)) {
    const resolved = resolveName(ts, sourceFile, expression.text, opening);
    if (resolved === undefined || resolved.kind === 'external') return false;
    if (resolved.initializer === undefined) return false;
    expression = resolved.initializer;
  }
  // Shorthand properties are resolved here, so `{ columns, rows }` is read as
  // the authored table it is rather than as an unreadable value, which this
  // function treats as "not authored".
  const value = literalValue(ts, expression, (name, at) => {
    const bound = resolveName(ts, sourceFile, name, at);
    if (bound === undefined || bound.kind === 'external') return undefined;
    return bound.initializer;
  });
  if (value === NOT_STATIC || value === null || typeof value !== 'object')
    return false;
  // Either a single `DataTable` or the `Record<string, DataTable>` the prop also
  // accepts, so a named map of authored rows is read the same way.
  const tables = Array.isArray(value)
    ? value
    : [value, ...Object.values(value)];
  return tables.some(
    (table) =>
      table !== null &&
      typeof table === 'object' &&
      Array.isArray(table.rows) &&
      table.rows.length > 0
  );
}

/**
 * Scans an object literal for the `spec` it contributes, in source order.
 *
 * Returns the expression `spec` ends up bound to, and whether anything after it
 * could still replace it. Recurses through nested spreads because
 * `{ spec: valid, ...props }` is last-wins the same way JSX attributes are.
 */
function specFromObjectLiteral(ts, literal) {
  let expression;
  let unknownAfter = false;
  for (const entry of literal.properties) {
    if (ts.isPropertyAssignment(entry)) {
      if (
        (ts.isIdentifier(entry.name) || ts.isStringLiteral(entry.name)) &&
        entry.name.text === 'spec'
      ) {
        expression = entry.initializer;
        unknownAfter = false;
      }
      continue;
    }
    // `{ spec }` - shorthand, the value is the binding of the same name.
    if (ts.isShorthandPropertyAssignment(entry)) {
      if (entry.name.text === 'spec') {
        expression = entry.name;
        unknownAfter = false;
      }
      continue;
    }
    if (!ts.isSpreadAssignment(entry)) continue;
    if (
      entry.expression !== undefined &&
      ts.isObjectLiteralExpression(entry.expression)
    ) {
      const nested = specFromObjectLiteral(ts, entry.expression);
      if (nested.expression !== undefined) {
        expression = nested.expression;
        unknownAfter = nested.unknownAfter;
      } else if (nested.unknownAfter) unknownAfter = true;
      continue;
    }
    unknownAfter = true;
  }
  return { expression, unknownAfter };
}

function readSpecProp(ts, sourceFile, opening) {
  // Walked in order, because JSX props are last-wins. A spread after `spec=`
  // can replace it and a spread before it can supply one, but only when its
  // contents are unknown: a static object literal states exactly which keys it
  // carries, so `{...{ data: [] }}` provably leaves `spec` alone.
  let attribute;
  let spreadExpression;
  let unknownAfter = false;
  for (const property of opening.attributes.properties) {
    if (ts.isJsxAttribute(property)) {
      if (property.name.getText(sourceFile) === 'spec') {
        attribute = property;
        spreadExpression = undefined;
        unknownAfter = false;
      }
      continue;
    }
    if (!ts.isJsxSpreadAttribute(property)) continue;
    const spread = property.expression;
    if (spread !== undefined && ts.isObjectLiteralExpression(spread)) {
      const carried = specFromObjectLiteral(ts, spread);
      if (carried.expression !== undefined) {
        attribute = undefined;
        spreadExpression = carried.expression;
        unknownAfter = carried.unknownAfter;
      } else if (carried.unknownAfter) unknownAfter = true;
      continue;
    }
    unknownAfter = true;
  }
  if (unknownAfter) return { state: 'runtime' };
  if (attribute === undefined && spreadExpression === undefined)
    return { state: 'missing' };
  let expression = spreadExpression;
  if (expression === undefined) {
    const initializer = attribute.initializer;
    // `<VegaVisual spec />` is `spec={true}`, which draws nothing - and which
    // `npm run typecheck` rejects, so it is marked as type-owned below. A string
    // is different: `spec` accepts one, so typecheck says nothing and this is the
    // only gate that reads it.
    if (initializer === undefined) return { state: 'invalid', value: true };
    if (ts.isStringLiteral(initializer)) {
      const parsed = specFromJsonText(initializer.text);
      if (parsed === undefined)
        return { state: 'invalid', value: initializer.text, fromString: true };
      return Object.keys(parsed).length === 0
        ? { state: 'missing', fromString: true }
        : { state: 'literal', spec: parsed };
    }
    // `spec={}` - an empty expression container, nothing to draw.
    if (
      !ts.isJsxExpression(initializer) ||
      initializer.expression === undefined
    ) {
      return { state: 'missing' };
    }
    expression = initializer.expression;
  }
  if (ts.isIdentifier(expression)) {
    const resolved = resolveName(ts, sourceFile, expression.text, opening);
    // Nothing declares this name, so there is no spec behind it.
    if (resolved === undefined) return { state: 'missing' };
    // An import or a prop: a real spec that this file cannot read. A .json spec
    // is covered by the file checks, and a prop belongs to whoever passes it.
    if (resolved.kind === 'external') return { state: 'runtime' };
    if (resolved.initializer === undefined) return { state: 'runtime' };
    expression = resolved.initializer;
  }
  const unwrap = (node) => {
    while (
      node !== undefined &&
      (ts.isParenthesizedExpression(node) ||
        ts.isAsExpression(node) ||
        (typeof ts.isSatisfiesExpression === 'function' &&
          ts.isSatisfiesExpression(node)))
    ) {
      node = node.expression;
    }
    return node;
  };
  const target = unwrap(expression);
  if (target !== undefined && ts.isObjectLiteralExpression(target)) {
    const value = literalValue(ts, target);
    if (value === NOT_STATIC) return { state: 'computed' };
    // An empty object is a spec prop with nothing in it, which draws nothing.
    if (Object.keys(value).length === 0) return { state: 'missing' };
    return { state: 'literal', spec: value };
  }
  // A static value that is not an object - `spec={null}`, `spec={42}`,
  // `spec={[]}`. Nothing will render it, and `typecheck` rejects every one. A
  // string is the exception: it is a legal `spec`, so only this gate reads it.
  const value = literalValue(ts, target);
  if (typeof value === 'string') {
    const parsed = specFromJsonText(value);
    if (parsed === undefined)
      return { state: 'invalid', value, fromString: true };
    return Object.keys(parsed).length === 0
      ? { state: 'missing', fromString: true }
      : { state: 'literal', spec: parsed };
  }
  if (value !== NOT_STATIC) return { state: 'invalid', value };
  // Assembled at runtime: `spec={chart.vegaLiteSpec}`, `spec={buildSpec(rows)}`.
  // Typically backed by a .json under src/queries/, which the file checks cover.
  return { state: 'runtime' };
}

/**
 * A spec written as a JSON string, or undefined when the text is not one.
 *
 * `VegaVisualProps.spec` is `VisualizationSpec | string`, so a JSON string is a
 * supported spelling rather than a mistake. Parsed and then judged like any
 * other literal spec; text that is not a JSON object is still nothing to draw.
 */
function specFromJsonText(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed !== null &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed)
      ? parsed
      : undefined;
  } catch {
    return undefined;
  }
}

/** A spec renders if it has a mark, or is a composite whose branches do. */
function hasMark(spec) {
  if (spec === null || typeof spec !== 'object') return false;
  if ('mark' in spec) return true;
  for (const key of ['layer', 'concat', 'hconcat', 'vconcat']) {
    const branch = spec[key];
    if (Array.isArray(branch) && branch.some(hasMark)) return true;
  }
  for (const key of ['facet', 'repeat', 'spec']) {
    if (key in spec && hasMark(spec.spec ?? spec[key])) return true;
  }
  return false;
}

/**
 * Every app source file, excluding tests. Comments are stripped so a `<VegaVisual>`
 * or an `EVALUATE` shown in a doc example is not mistaken for the app doing it,
 * and `.spec`/`.test` files are skipped because a fixture query is not the app
 * querying anything.
 *
 * Takes an already-walked file list rather than walking itself, so `src` is
 * traversed once and a directory that cannot be listed is reported once.
 */
async function readAppSources(allFiles) {
  const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
  const files = allFiles.filter((file) => {
    if (!extensions.has(path.extname(file))) return false;
    return !/\.(?:spec|test)\.[jt]sx?$/u.test(file);
  });
  const contents = await Promise.all(
    files.map((file) =>
      readFile(file, 'utf8').catch((error) => {
        // `walk` has established this is a file, so a failure here is a
        // permission, lock or race. Treating it as empty source would hide
        // every chart in it behind a green report.
        failures.push(
          `${path.relative(root, file)} could not be read (${error.code ?? 'unknown error'}), so any` +
            ' visual in it was not checked.'
        );
        return '';
      })
    )
  );
  // Kept per file rather than concatenated: resolving `spec={name}` across a
  // joined string lets one file's declaration answer another file's usage, and
  // `const spec` in every chart component is the normal way to write these.
  return files.map((file, index) => ({
    file,
    source: contents[index]
      .replace(/\/\*[\s\S]*?\*\//gu, '')
      .replace(/^[ \t]*\/\/.*$/gmu, ''),
  }));
}

// Walked once and partitioned, so an unreadable directory is reported once and
// every consumer sees the same file list.
const srcFiles = await walk(sourceRoot);
// `+ path.sep` is a directory boundary; the bare prefix also claims
// `src/queries-old`.
const queryFiles = srcFiles.filter((file) =>
  file.startsWith(queriesDir + path.sep)
);
const appSources = await readAppSources(srcFiles);
const sourceCode = appSources.map((entry) => entry.source).join('\n');
const rendersDataGrid = /<DataGrid\b/u.test(sourceCode);

// Parse each file rather than scanning text, so `<VegaVisual>` is found as an
// element and its spec is resolved as a binding. Each element is tracked on its
// own: a page that renders a good chart beside an empty one must report the
// empty one.
const typescript = await loadTypeScript();
const visuals =
  typescript === null
    ? []
    : appSources.flatMap(({ file, source }) =>
        collectVisuals(
          typescript,
          typescript.createSourceFile(
            file,
            source,
            typescript.ScriptTarget.Latest,
            true,
            typescript.ScriptKind.TSX
          ),
          path.relative(root, file)
        )
      );
const rendersVegaVisual =
  typescript === null ? /<VegaVisual\b/u.test(sourceCode) : visuals.length > 0;
if (typescript === null && appSources.length > 0) {
  // Gated on source existing at all, not on the component name appearing: with
  // no compiler this script cannot resolve `import { VegaVisual as Chart }`, so
  // a name-based test would pass an app whose charts it never read.
  failures.push(
    'No usable TypeScript compiler here, so nothing written in source could be read' +
      ' or schema-checked, and only .json specs under src/queries/ were validated.' +
      ' Run `npm install` to restore dependencies. The installed `typescript` has' +
      ' to expose the JavaScript compiler API (`createSourceFile`); TypeScript 7' +
      ' is the known release that does not.'
  );
}

// Read every JSON under src/queries once, and note which ones a factory imports
// as a spec, so the filter below can tell a chart from an ordinary data file.
const specSources = new Map();
for (const file of queryFiles.filter((candidate) =>
  candidate.endsWith('.json')
)) {
  specSources.set(
    path.resolve(file),
    await readFile(file, 'utf8').catch((error) => {
      // An unreadable .json is dropped from specFiles below, so without this it
      // would leave no trace at all: a spec silently not checked.
      failures.push(
        `${path.relative(root, file)} could not be read (${error.code ?? 'unknown error'}), so it` +
          ' was not checked.'
      );
      return undefined;
    })
  );
}
const importedSpecs = new Set();
// Reuses the sources already read above rather than reading src/queries twice.
// Those have comments stripped, so an import shown in a doc example does not
// count as the app importing a spec.
for (const { file: factory, source } of appSources) {
  if (!factory.startsWith(queriesDir + path.sep)) continue;
  // A relative .json import in a query factory, so the spec file it names can be
  // told apart from an ordinary data file sitting in the same folder.
  // Matches:  import spec from "./revenue.json"
  //           export { default as s } from '../charts/trend.json'
  // Skips:    import pkg from "some-package/data.json"   (not relative)
  for (const match of source.matchAll(/from\s+["'](\.[^"']*\.json)["']/gu)) {
    importedSpecs.add(path.resolve(path.dirname(factory), match[1]));
  }
}

const specFiles = queryFiles.filter((file) => {
  if (!file.endsWith('.json')) return false;
  // Not every JSON under src/queries is a chart. A lookup table, a column map,
  // or a config file would otherwise be reported as a spec that renders no
  // mark. Treat a file as a spec only when it declares a vega-lite $schema or
  // is imported by a query factory as one.
  const contents = specSources.get(path.resolve(file));
  if (contents === undefined) return false;
  // Matches: "$schema": "https://vega.github.io/schema/vega-lite/v6.json"
  // Skips:   "$schema": "https://json-schema.org/draft-07/schema"
  if (/"\$schema"\s*:\s*"[^"]*vega-lite/u.test(contents)) return true;
  return importedSpecs.has(path.resolve(file));
});
// Every spec this run will check, from either source. An inline spec is only
// included when it resolved to a literal; the rest are counted as unchecked and
// reported, so the output never implies coverage it does not have.
const specs = [];
let inlineUnchecked = 0;
let runtimeSpecs = 0;
let typeChecked = 0;
for (const visual of visuals) {
  if (visual.state === 'literal')
    specs.push({ label: visual.label, spec: visual.spec });
  else if (visual.state === 'computed') inlineUnchecked += 1;
  else if (visual.state === 'runtime') runtimeSpecs += 1;
  else if (visual.state === 'invalid') {
    // A spec prop the compiler can judge is left to the compiler: `spec` is
    // required and typed, so a missing, bare or non-string value is a type
    // error, and `typecheck` is a required gate that runs before this one.
    // Repeating it here would report the same mistake twice and let this script
    // drift from the type. A string is the exception - `spec` accepts one, so
    // the compiler is satisfied and only this gate can tell it draws nothing.
    if (visual.fromString) {
      failures.push(
        `${visual.label} is passed ${JSON.stringify(visual.value)} as its spec, which renders` +
          ' nothing. Pass a Vega-Lite spec object, or JSON text that parses to one.'
      );
    } else typeChecked += 1;
  } else if (visual.state === 'missing') {
    if (visual.fromString) {
      failures.push(
        `${visual.label} is passed an empty spec, which renders nothing. Pass a` +
          ' Vega-Lite spec object, or JSON text that parses to one.'
      );
    } else typeChecked += 1;
  } else {
    // No state falls through silently: an unhandled one would leave a visual
    // neither checked nor mentioned, which is the one outcome this script must
    // never produce.
    runtimeSpecs += 1;
  }
}

if (typeChecked > 0) {
  notes.push(
    `${typeChecked} visual(s) have a spec prop the TypeScript compiler rejects, so they are` +
      ' left to `npm run typecheck` rather than reported twice.'
  );
}

if (specFiles.length === 0 && visuals.length === 0) {
  // Without a compiler `visuals` is empty whatever the app contains, so neither
  // of these could be said honestly - "no chart components" would be asserting
  // something this run had no way to determine, and the coverage-integrity
  // failure above already covers that state. With no source at all there is
  // nothing to have missed, so the note is true and still worth emitting: a
  // report with no failures and no notes would say nothing.
  if (typescript !== null || appSources.length === 0) {
    if (rendersDataGrid) {
      notes.push(
        'No Vega-Lite specs — this app presents its data with <DataGrid>.'
      );
    } else {
      notes.push(
        'No Vega-Lite specs and no chart components — nothing to check.'
      );
    }
  }
}
if (inlineUnchecked > 0) {
  // Not a schema failure: the visuals skill documents inline specs, and a
  // literal that builds itself from variables is ordinary code rather than a
  // mistake. Say plainly which ones remain incomplete.
  notes.push(
    `${inlineUnchecked} inline spec(s) build values from code rather than literals, so they were` +
      ' NOT schema-checked — an out-of-range value like opacity: 5, or a spec that resolves to' +
      ' no mark, would not be caught in them. Where the spec is static, keep it literal or move' +
      ' it to .json under src/queries/; where it genuinely varies, record validation of the chart' +
      ' in the browser.'
  );
}

/**
 * The connector-name shape the CLI accepts.
 *
 * Kept identical to the plugin's own rule (`server.ts`, `fabric-config.ts`) so
 * this cannot pass a name the CLI will later reject.
 */
const CONNECTOR_NAME = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/u;

/**
 * `rayfin/rayfin.yml` as a plain object, or null when it cannot be parsed.
 *
 * Parsed with the `yaml` package the pack declares, rather than read by hand.
 * The CLI parses the same file the same way, so a document this accepts is one
 * the CLI accepts too - which a hand-written reader can only approximate.
 *
 * Loaded defensively so a pruned install produces a stated failure rather than a
 * module-resolution stack trace. `undefined` means the parser itself is missing,
 * which the caller treats as a failure: `yaml` is declared by the pack, so its
 * absence is a broken install and inline data cannot be judged without it.
 */
async function parseYaml(text) {
  const entry = resolveFromApp('yaml');
  if (entry === null) return undefined;
  const mod = await import(pathToFileURL(entry).href).catch(() => null);
  const parse = mod?.parse ?? mod?.default?.parse;
  if (typeof parse !== 'function') return undefined;
  try {
    return parse(text);
  } catch {
    return null;
  }
}

/**
 * Whether the app reads a semantic model: `connected`, `disconnected`,
 * `invalid` when the file is present but unusable, or `unreadable` when the
 * parser itself is missing.
 *
 * Read from the `connectors:` list in `rayfin/rayfin.yml`, which is what
 * `rayfin connector add` writes.
 *
 * Only a `fabric-semanticmodel` entry counts. A SQL or Kusto connector is a real
 * source too, but not the one the inline-data rule below is about, and treating
 * it as one would fail a chart for reading data this validator cannot see.
 *
 * All three shapes the CLI normalizer accepts are handled: a list of
 * `{ name, type }`, the same list using the legacy `connector:` key, and the
 * legacy map keyed by connector name.
 */
async function semanticModelState(rayfinYaml) {
  if (rayfinYaml === undefined) return 'disconnected';
  if (String(rayfinYaml).trim() === '') return 'invalid';
  const doc = await parseYaml(String(rayfinYaml));
  if (doc === undefined) return 'unreadable';
  if (doc === null || typeof doc !== 'object') return 'invalid';
  const connectors = doc.connectors;
  // Absent is the ordinary state of an app that never added one.
  if (connectors === undefined || connectors === null) return 'disconnected';

  let entries;
  if (Array.isArray(connectors)) {
    entries = connectors;
  } else if (typeof connectors === 'object') {
    entries = Object.entries(connectors).map(([name, value]) => ({
      name,
      ...(value === null || typeof value !== 'object' ? {} : value),
    }));
  } else {
    return 'invalid';
  }

  return entries.some((entry) => {
    if (entry === null || typeof entry !== 'object') return false;
    const type = entry.type ?? entry.connector;
    return (
      type === 'fabric-semanticmodel' &&
      typeof entry.name === 'string' &&
      CONNECTOR_NAME.test(entry.name)
    );
  })
    ? 'connected'
    : 'disconnected';
}

const modelState = await semanticModelState(
  await readFile(path.join(root, 'rayfin', 'rayfin.yml'), 'utf8').catch(
    () => undefined
  )
);
const readsSemanticModel = modelState === 'connected';
if (modelState === 'unreadable') {
  // A check that could not run must not report a pass. Every app that applies
  // this pack installs `yaml` with it, so this is a broken install, not a
  // configuration.
  failures.push(
    'rayfin/rayfin.yml could not be read: the `yaml` package is not installed here, so' +
      ' inline data was not judged against the model this app reads. Run' +
      ' `npm install` and try again.'
  );
} else if (modelState === 'invalid') {
  notes.push(
    'rayfin/rayfin.yml is present but its connectors block is neither a list nor' +
      ' a map — inline data was not judged, because which model this app reads is' +
      ' unknown. Check the file against `rayfin connector add` output.'
  );
}

const validateSchema =
  specs.length > 0 || specFiles.length > 0
    ? await loadSchemaValidator()
    : { status: 'not-needed' };
if (validateSchema.status === 'failed') {
  failures.push(
    `Vega-Lite schema validation could not start. ${validateSchema.error}`
  );
}

// Rows written into the `data` prop are the same invented figures the spec
// check catches, so a model-backed app fails either spelling. Judged on the
// element rather than beside the spec, because the prop belongs to the element
// whatever spec it happens to carry.
for (const visual of visuals) {
  if (modelState === 'connected' && visual.authoredData) {
    failures.push(
      `${visual.label} is passed rows written into its data prop in an app connected to a` +
        " semantic model, so the chart shows those instead of the model's data. Pass the" +
        ' query result through `toDataTable()` instead.'
    );
  }
}

for (const file of specFiles) {
  const relative = path.relative(root, file);
  // Already read above, and a file that could not be read never became a spec
  // file, so there is no unreadable case left to report here.
  const text = specSources.get(path.resolve(file));
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    failures.push(`${relative} is not valid JSON: ${error.message}`);
    continue;
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    failures.push(`${relative} is not a Vega-Lite spec object.`);
    continue;
  }
  specs.push({ label: relative, spec: parsed, fromFile: true });
}

for (const { label: relative, spec, fromFile } of specs) {
  if (validateSchema.status === 'ready') {
    // A spec that carries its own data is validated exactly as authored, so a
    // malformed `data.values` is caught. Only a spec with no data gets a stand-in
    // injected, because <VegaVisual> supplies that at runtime from its DataTable
    // prop and the schema requires the key - without this every correct
    // model-backed spec in the app would fail.
    const toValidate =
      'data' in spec ? spec : { ...spec, data: { name: 'table' } };
    if (!validateSchema.validate(toValidate)) {
      const error = mostSpecificError(validateSchema.validate.errors);
      const where = errorPath(error) || '(root)';
      failures.push(
        `${relative} does not match the Vega-Lite schema at ${where}: ${error.message}.`
      );
      continue;
    }
  }

  // A selection param declared above a `layer` with more than one entry is
  // compiled into every branch, each registering the same signal name, and Vega
  // fails to parse the result with `Duplicate signal name`. A single entry is
  // fine, and so is the same param above a `concat`, `facet` or `repeat`.
  // `views` scopes a param to named children, so an empty list scopes nothing.
  //
  // Root only. The same crash nested inside a composite is left to the browser
  // pass, which sees every variant of it.
  if (
    Array.isArray(spec.layer) &&
    spec.layer.length > 1 &&
    Array.isArray(spec.params)
  ) {
    const selections = spec.params
      .filter(
        (param) =>
          param !== null && typeof param === 'object' && 'select' in param
      )
      .filter(
        (param) => !(Array.isArray(param.views) && param.views.length > 0)
      )
      .map((param) => param.name ?? '(unnamed)');
    if (selections.length > 0) {
      failures.push(
        `${relative} declares selection param(s) ${selections.join(', ')} at the top level of a` +
          ' layer spec with more than one entry. Vega-Lite compiles them into every branch and' +
          ' the duplicate signal names fail when Vega parses it. Move each one into the layer' +
          ' entry that owns the interaction, or scope it with "views": ["<child name>"].'
      );
    }
  }
  if (!hasMark(spec)) {
    failures.push(`${relative} resolves to no mark, so it renders nothing.`);
  }
  const authored = authoredRowsAt(spec);
  if (authored !== null) {
    // Inline data is the documented way to build a mock-up or a chart over rows
    // the app already holds, and the visuals skill says so.
    //
    // In a model-backed app, position decides. Rows at the top level are the
    // ones the chart draws, so the chart is showing something other than the
    // model it connects to - it builds, deploys and looks right, which is why
    // it is a failure rather than a note. Rows on a child layer are a threshold
    // or an annotation beside the model's data, and nothing here can tell those
    // from invented figures, so those are reported for a person to judge. Rows
    // massaged in code do not reach this branch at all - that spec is not a
    // literal, so it is already counted as built at runtime.
    if (modelState === 'connected' && authored === 'top') {
      failures.push(
        `${relative} hard-codes the rows it draws (data.values or datasets) in an app` +
          ' connected to a semantic model, so the chart shows those instead of the' +
          " model's data. Pass the query result through the DataTable prop, or move the" +
          ' static rows onto the layer that needs them.'
      );
    } else {
      notes.push(
        modelState === 'connected'
          ? `${relative} authors its own rows on a child layer of a spec connected to a` +
              " semantic model. That is right for a threshold or annotation beside the model's" +
              ' data — check this chart shows what it claims to.'
          : modelState === 'invalid' || modelState === 'unreadable'
            ? `${relative} authors its own rows (data.values or datasets). Whether that is right` +
              ' depends on the model this app reads, which could not be read from rayfin/rayfin.yml — see' +
              ' the note above.'
            : `${relative} carries inline data.values. Fine for sample or static data — label it as` +
              ' sample data in the UI so nobody mistakes it for real numbers.'
      );
    }
  }
  if (
    fromFile &&
    (typeof spec.$schema !== 'string' || !spec.$schema.includes('vega-lite'))
  ) {
    notes.push(
      `${relative} declares no vega-lite $schema — editors lose validation and completion.`
    );
  }
}

const schemasChecked = validateSchema.status === 'ready' ? specs.length : 0;
const uncheckedSpecs = runtimeSpecs + inlineUnchecked;
if (uncheckedSpecs > 0) {
  notes.push(
    schemasChecked === 0
      ? `Schema coverage is zero: 0 schemas checked; ${uncheckedSpecs} runtime/computed spec(s)` +
          ' remain unchecked. Move a static spec to .json or use the explicit preview route only' +
          ' to reach browser validation.'
      : `Schema coverage is partial: ${schemasChecked} schema(s) checked; ${uncheckedSpecs}` +
          ' runtime/computed spec(s) remain unchecked. Browser validation is still required for' +
          ' those rendered visuals.'
  );
}

const classification = classifyValidation({
  failureCount: failures.length,
  schemasChecked,
  uncheckedSpecs,
  coverageUnavailable: validateSchema.status === 'failed',
  allowIncomplete,
});
console.log(
  JSON.stringify(
    {
      status: classification.status,
      coverage: classification.coverage,
      ok: classification.ok,
      checked: {
        specs: specs.length,
        specFiles: specFiles.length,
        inlineSpecs: specs.length - specFiles.length,
        inlineSpecsUnchecked: inlineUnchecked,
        runtimeSpecs,
        schemasChecked,
        uncheckedSpecs,
        rendersVegaVisual,
        rendersDataGrid,
      },
      failures,
      notes,
    },
    null,
    2
  )
);
if (classification.exitCode !== 0) process.exitCode = classification.exitCode;
