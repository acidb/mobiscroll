/**
 * Moved here the code from the scss-bundle package, because it's no longer maintained,
 * and brings in outdated dependencies otherwise.
 */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable capitalized-comments */
/* eslint-disable curly */
/* eslint-disable eqeqeq */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-fallthrough */
/* eslint-disable no-sparse-arrays */
/* eslint-disable no-var */
/* eslint-disable one-var */
/* eslint-disable prefer-arrow-callback */
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var fs_extra_1 = tslib_1.__importDefault(require('fs-extra'));
var os_1 = tslib_1.__importDefault(require('os'));
var path_1 = tslib_1.__importDefault(require('path'));
var globs_1 = tslib_1.__importDefault(require('globs'));
var IMPORT_PATTERN = /@import\s+['"](.+)['"];/g;
var COMMENT_PATTERN = /\/\/.*$/gm;
var MULTILINE_COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;
var DEFAULT_FILE_EXTENSION = '.scss';
var ALLOWED_FILE_EXTENSIONS = ['.scss', '.css'];
var NODE_MODULES = 'node_modules';
var TILDE = '~';

function matchAll(text, regex) {
  var matches = [];
  var match;
  while ((match = regex.exec(text))) {
    matches.push(match);
  }
  return matches;
}

var Bundler = /** @class */ (function () {
  function Bundler(fileRegistry, projectDirectory) {
    if (fileRegistry === void 0) {
      fileRegistry = {};
    }
    this.fileRegistry = fileRegistry;
    this.projectDirectory = projectDirectory;
    // Full paths of used imports and their count
    this.usedImports = {};
    // Imports dictionary by file
    this.importsByFile = {};
  }
  Bundler.prototype.bundle = function (file, dedupeGlobs, includePaths, ignoredImports) {
    if (dedupeGlobs === void 0) {
      dedupeGlobs = [];
    }
    if (includePaths === void 0) {
      includePaths = [];
    }
    if (ignoredImports === void 0) {
      ignoredImports = [];
    }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var contentPromise, dedupeFilesPromise, _a, content, dedupeFiles, ignoredImportsRegEx, _b;
      return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _c.trys.push([0, 3, , 4]);
            if (this.projectDirectory != null) {
              file = path_1.default.resolve(this.projectDirectory, file);
            }
            return [4 /*yield*/, fs_extra_1.default.access(file)];
          case 1:
            _c.sent();
            contentPromise = fs_extra_1.default.readFile(file, 'utf-8');
            dedupeFilesPromise = this.globFilesOrEmpty(dedupeGlobs);
            return [4 /*yield*/, Promise.all([contentPromise, dedupeFilesPromise])];
          case 2:
            (_a = _c.sent()), (content = _a[0]), (dedupeFiles = _a[1]);
            ignoredImportsRegEx = ignoredImports.map(function (ignoredImport) {
              return new RegExp(ignoredImport);
            });
            return [2 /*return*/, this._bundle(file, content, dedupeFiles, includePaths, ignoredImportsRegEx)];
          case 3:
            _b = _c.sent();
            return [
              2 /*return*/,
              {
                filePath: file,
                found: false,
              },
            ];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  Bundler.prototype.isExtensionExists = function (importName) {
    return ALLOWED_FILE_EXTENSIONS.some(function (extension) {
      return importName.indexOf(extension) !== -1;
    });
  };
  Bundler.prototype._bundle = function (filePath, content, dedupeFiles, includePaths, ignoredImports) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var dirname,
        importsPromises,
        imports,
        bundleResult,
        shouldCheckForDedupes,
        currentImports,
        _i,
        imports_1,
        imp,
        contentToReplace,
        currentImport,
        impContent,
        _a,
        bundledImport,
        childImports,
        timesUsed;
      var _this = this;
      return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            // Remove commented imports
            content = this.removeImportsFromComments(content);
            // Resolve path to work only with full paths
            filePath = path_1.default.resolve(filePath);
            dirname = path_1.default.dirname(filePath);
            if (this.fileRegistry[filePath] == null) {
              this.fileRegistry[filePath] = content;
            }
            importsPromises = matchAll(content, IMPORT_PATTERN).map(function (match) {
              return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var importName, ignored, fullPath, tilde, importData;
                return tslib_1.__generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      importName = match[1];
                      // Append extension if it's absent
                      if (!this.isExtensionExists(importName)) {
                        importName += DEFAULT_FILE_EXTENSION;
                      }
                      ignored =
                        ignoredImports.findIndex(function (ignoredImportRegex) {
                          return ignoredImportRegex.test(importName);
                        }) !== -1;
                      tilde = importName.startsWith(TILDE);
                      if (tilde && this.projectDirectory != null) {
                        importName = './' + NODE_MODULES + '/' + importName.substr(TILDE.length, importName.length);
                        fullPath = path_1.default.resolve(this.projectDirectory, importName);
                      } else {
                        fullPath = path_1.default.resolve(dirname, importName);
                      }
                      importData = {
                        importString: match[0],
                        tilde: tilde,
                        path: importName,
                        fullPath: fullPath,
                        found: false,
                        ignored: ignored,
                      };
                      return [4 /*yield*/, this.resolveImport(importData, includePaths)];
                    case 1:
                      _a.sent();
                      return [2 /*return*/, importData];
                  }
                });
              });
            });
            return [4 /*yield*/, Promise.all(importsPromises)];
          case 1:
            imports = _b.sent();
            bundleResult = {
              filePath: filePath,
              found: true,
            };
            shouldCheckForDedupes = dedupeFiles != null && dedupeFiles.length > 0;
            currentImports = [];
            (_i = 0), (imports_1 = imports);
            _b.label = 2;
          case 2:
            if (!(_i < imports_1.length)) return [3 /*break*/, 11];
            imp = imports_1[_i];
            contentToReplace = void 0;
            currentImport = void 0;
            if (!!imp.found) return [3 /*break*/, 3];
            // Add empty bundle result with found: false
            currentImport = {
              filePath: imp.fullPath,
              tilde: imp.tilde,
              found: false,
              ignored: imp.ignored,
            };
            return [3 /*break*/, 9];
          case 3:
            if (!(this.usedImports[imp.fullPath] == null)) return [3 /*break*/, 8];
            // Add it to used imports
            this.usedImports[imp.fullPath] = 1;
            if (!(this.fileRegistry[imp.fullPath] == null)) return [3 /*break*/, 5];
            return [4 /*yield*/, fs_extra_1.default.readFile(imp.fullPath, 'utf-8')];
          case 4:
            _a = _b.sent();
            return [3 /*break*/, 6];
          case 5:
            _a = this.fileRegistry[imp.fullPath];
            _b.label = 6;
          case 6:
            impContent = _a;
            return [4 /*yield*/, this._bundle(imp.fullPath, impContent, dedupeFiles, includePaths, ignoredImports)];
          case 7:
            bundledImport = _b.sent();
            // Then add its bundled content to the registry
            this.fileRegistry[imp.fullPath] = bundledImport.bundledContent;
            // And whole BundleResult to current imports
            currentImport = bundledImport;
            return [3 /*break*/, 9];
          case 8:
            // File is in the registry
            // Increment it's usage count
            if (this.usedImports != null) {
              this.usedImports[imp.fullPath]++;
            }
            childImports = [];
            if (this.importsByFile != null) {
              childImports = this.importsByFile[imp.fullPath];
            }
            // Construct and add result to current imports
            currentImport = {
              filePath: imp.fullPath,
              tilde: imp.tilde,
              found: true,
              imports: childImports,
            };
            _b.label = 9;
          case 9:
            if (imp.ignored) {
              if (this.usedImports[imp.fullPath] > 1) {
                contentToReplace = '';
              } else {
                contentToReplace = imp.importString;
              }
            } else {
              // Take contentToReplace from the fileRegistry
              contentToReplace = this.fileRegistry[imp.fullPath];
              // If the content is not found
              if (contentToReplace == null) {
                // Indicate this with a comment for easier debugging
                contentToReplace = '/*** IMPORTED FILE NOT FOUND ***/' + os_1.default.EOL + imp.importString + '/*** --- ***/';
              }
              // If usedImports dictionary is defined
              if (shouldCheckForDedupes && this.usedImports != null) {
                timesUsed = this.usedImports[imp.fullPath];
                if (dedupeFiles.indexOf(imp.fullPath) !== -1 && timesUsed != null && timesUsed > 1) {
                  // Reset content to replace to an empty string to skip it
                  contentToReplace = '';
                  // And indicate that import was deduped
                  currentImport.deduped = true;
                }
              }
            }
            // Finally, replace import string with bundled content or a debug message
            content = this.replaceLastOccurance(content, imp.importString, contentToReplace);
            // And push current import into the list
            currentImports.push(currentImport);
            _b.label = 10;
          case 10:
            _i++;
            return [3 /*break*/, 2];
          case 11:
            // Set result properties
            bundleResult.bundledContent = content;
            bundleResult.imports = currentImports;
            if (this.importsByFile != null) {
              this.importsByFile[filePath] = currentImports;
            }
            return [2 /*return*/, bundleResult];
        }
      });
    });
  };
  Bundler.prototype.replaceLastOccurance = function (content, importString, contentToReplace) {
    var index = content.lastIndexOf(importString);
    return content.slice(0, index) + content.slice(index).replace(importString, contentToReplace);
  };
  Bundler.prototype.removeImportsFromComments = function (text) {
    var patterns = [COMMENT_PATTERN, MULTILINE_COMMENT_PATTERN];
    for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
      var pattern = patterns_1[_i];
      text = text.replace(pattern, function (x) {
        return x.replace(IMPORT_PATTERN, '');
      });
    }
    return text;
  };
  Bundler.prototype.resolveImport = function (importData, includePaths) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var error_1, underscoredDirname, underscoredBasename, underscoredFilePath, underscoreErr_1, remainingIncludePaths;
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.fileRegistry[importData.fullPath]) {
              importData.found = true;
              return [2 /*return*/, importData];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 8]);
            return [4 /*yield*/, fs_extra_1.default.access(importData.fullPath)];
          case 2:
            _a.sent();
            importData.found = true;
            return [3 /*break*/, 8];
          case 3:
            error_1 = _a.sent();
            underscoredDirname = path_1.default.dirname(importData.fullPath);
            underscoredBasename = path_1.default.basename(importData.fullPath);
            underscoredFilePath = path_1.default.join(underscoredDirname, '_' + underscoredBasename);
            _a.label = 4;
          case 4:
            _a.trys.push([4, 6, , 7]);
            return [4 /*yield*/, fs_extra_1.default.access(underscoredFilePath)];
          case 5:
            _a.sent();
            importData.fullPath = underscoredFilePath;
            importData.found = true;
            return [3 /*break*/, 7];
          case 6:
            underscoreErr_1 = _a.sent();
            // If there are any includePaths
            if (includePaths.length) {
              // Resolve fullPath using its first entry
              importData.fullPath = path_1.default.resolve(includePaths[0], importData.path);
              remainingIncludePaths = includePaths.slice(1);
              return [2 /*return*/, this.resolveImport(importData, remainingIncludePaths)];
            }
            return [3 /*break*/, 7];
          case 7:
            return [3 /*break*/, 8];
          case 8:
            return [2 /*return*/, importData];
        }
      });
    });
  };
  Bundler.prototype.globFilesOrEmpty = function (globsList) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      return tslib_1.__generator(this, function (_a) {
        return [
          2 /*return*/,
          new Promise(function (resolve, reject) {
            if (globsList == null || globsList.length === 0) {
              resolve([]);
              return;
            }
            globs_1.default(globsList, function (error, files) {
              if (error != null) {
                reject(error);
              }
              var fullPaths = files.map(function (file) {
                return path_1.default.resolve(file);
              });
              resolve(fullPaths);
            });
          }),
        ];
      });
    });
  };
  return Bundler;
})();
exports.Bundler = Bundler;
