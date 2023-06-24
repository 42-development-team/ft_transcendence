"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelClassVisitor = void 0;
const lodash_1 = require("lodash");
const path_1 = require("path");
const ts = require("typescript");
const typescript_1 = require("typescript");
const decorators_1 = require("../../decorators");
const plugin_constants_1 = require("../plugin-constants");
const ast_utils_1 = require("../utils/ast-utils");
const plugin_utils_1 = require("../utils/plugin-utils");
const abstract_visitor_1 = require("./abstract.visitor");
class ModelClassVisitor extends abstract_visitor_1.AbstractFileVisitor {
    constructor() {
        super(...arguments);
        this._typeImports = {};
        this._collectedMetadata = {};
    }
    get typeImports() {
        return this._typeImports;
    }
    get collectedMetadata() {
        const metadataWithImports = [];
        Object.keys(this._collectedMetadata).forEach((filePath) => {
            const metadata = this._collectedMetadata[filePath];
            const path = filePath.replace(/\.[jt]s$/, '');
            const importExpr = ts.factory.createCallExpression(ts.factory.createToken(ts.SyntaxKind.ImportKeyword), undefined, [ts.factory.createStringLiteral(path)]);
            metadataWithImports.push([importExpr, metadata]);
        });
        return metadataWithImports;
    }
    visit(sourceFile, ctx, program, options) {
        const typeChecker = program.getTypeChecker();
        sourceFile = this.updateImports(sourceFile, ctx.factory, program);
        const propertyNodeVisitorFactory = (metadata) => (node) => {
            const visit = () => {
                if (ts.isPropertyDeclaration(node)) {
                    this.visitPropertyNodeDeclaration(node, ctx, typeChecker, options, sourceFile, metadata);
                }
                return node;
            };
            const visitedNode = visit();
            if (!options.readonly) {
                return visitedNode;
            }
        };
        const visitClassNode = (node) => {
            if (ts.isClassDeclaration(node)) {
                const metadata = {};
                if (options.readonly) {
                    ts.forEachChild(node, propertyNodeVisitorFactory(metadata));
                }
                else {
                    node = ts.visitEachChild(node, propertyNodeVisitorFactory(metadata), ctx);
                }
                const declaration = this.addMetadataFactory(ctx.factory, node, metadata, sourceFile, options);
                if (!options.readonly) {
                    return declaration;
                }
            }
            if (options.readonly) {
                ts.forEachChild(node, visitClassNode);
            }
            else {
                return ts.visitEachChild(node, visitClassNode, ctx);
            }
        };
        return ts.visitNode(sourceFile, visitClassNode);
    }
    visitPropertyNodeDeclaration(node, ctx, typeChecker, options, sourceFile, metadata) {
        const decorators = ts.canHaveDecorators(node) && ts.getDecorators(node);
        const hidePropertyDecorator = (0, plugin_utils_1.getDecoratorOrUndefinedByNames)([decorators_1.ApiHideProperty.name], decorators, typescript_1.factory);
        if (hidePropertyDecorator) {
            return node;
        }
        const isPropertyStatic = (node.modifiers || []).some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword);
        if (isPropertyStatic) {
            return node;
        }
        try {
            this.inspectPropertyDeclaration(ctx.factory, node, typeChecker, options, sourceFile.fileName, sourceFile, metadata);
        }
        catch (err) {
            return node;
        }
    }
    addMetadataFactory(factory, node, classMetadata, sourceFile, options) {
        const returnValue = factory.createObjectLiteralExpression(Object.keys(classMetadata).map((key) => factory.createPropertyAssignment(factory.createIdentifier(key), classMetadata[key])));
        if (options.readonly) {
            const filePath = this.normalizeImportPath(options.pathToSource, sourceFile.fileName);
            if (!this._collectedMetadata[filePath]) {
                this._collectedMetadata[filePath] = {};
            }
            const attributeKey = node.name.getText();
            this._collectedMetadata[filePath][attributeKey] = returnValue;
            return;
        }
        const method = factory.createMethodDeclaration([factory.createModifier(ts.SyntaxKind.StaticKeyword)], undefined, factory.createIdentifier(plugin_constants_1.METADATA_FACTORY_NAME), undefined, undefined, [], undefined, factory.createBlock([factory.createReturnStatement(returnValue)], true));
        return factory.updateClassDeclaration(node, node.modifiers, node.name, node.typeParameters, node.heritageClauses, [...node.members, method]);
    }
    inspectPropertyDeclaration(factory, compilerNode, typeChecker, options, hostFilename, sourceFile, metadata) {
        const objectLiteralExpr = this.createDecoratorObjectLiteralExpr(factory, compilerNode, typeChecker, factory.createNodeArray(), options, hostFilename, sourceFile);
        this.addClassMetadata(compilerNode, objectLiteralExpr, sourceFile, metadata);
    }
    createDecoratorObjectLiteralExpr(factory, node, typeChecker, existingProperties = factory.createNodeArray(), options = {}, hostFilename = '', sourceFile) {
        const isRequired = !node.questionToken;
        let properties = [
            ...existingProperties,
            !(0, plugin_utils_1.hasPropertyKey)('required', existingProperties) &&
                factory.createPropertyAssignment('required', (0, ast_utils_1.createBooleanLiteral)(factory, isRequired)),
            ...this.createTypePropertyAssignments(factory, node.type, typeChecker, existingProperties, hostFilename, options),
            ...this.createDescriptionAndTsDocTagPropertyAssigments(factory, node, typeChecker, existingProperties, options, sourceFile),
            this.createDefaultPropertyAssignment(factory, node, existingProperties),
            this.createEnumPropertyAssignment(factory, node, typeChecker, existingProperties, hostFilename, options)
        ];
        if (options.classValidatorShim) {
            properties = properties.concat(this.createValidationPropertyAssignments(factory, node));
        }
        return factory.createObjectLiteralExpression((0, lodash_1.compact)((0, lodash_1.flatten)(properties)));
    }
    createTypePropertyAssignments(factory, node, typeChecker, existingProperties, hostFilename, options) {
        const key = 'type';
        if ((0, plugin_utils_1.hasPropertyKey)(key, existingProperties)) {
            return [];
        }
        if (node) {
            if (ts.isTypeLiteralNode(node)) {
                const propertyAssignments = Array.from(node.members || []).map((member) => {
                    const literalExpr = this.createDecoratorObjectLiteralExpr(factory, member, typeChecker, existingProperties, {}, hostFilename);
                    return factory.createPropertyAssignment(factory.createIdentifier(member.name.getText()), literalExpr);
                });
                return [
                    factory.createPropertyAssignment(key, factory.createArrowFunction(undefined, undefined, [], undefined, undefined, factory.createParenthesizedExpression(factory.createObjectLiteralExpression(propertyAssignments))))
                ];
            }
            else if (ts.isUnionTypeNode(node)) {
                const nullableType = node.types.find((type) => type.kind === ts.SyntaxKind.NullKeyword ||
                    (ts.SyntaxKind.LiteralType && type.getText() === 'null'));
                const isNullable = !!nullableType;
                const remainingTypes = node.types.filter((item) => item !== nullableType);
                if (remainingTypes.length === 1) {
                    const remainingTypesProperties = this.createTypePropertyAssignments(factory, remainingTypes[0], typeChecker, existingProperties, hostFilename, options);
                    const resultArray = new Array(...remainingTypesProperties);
                    if (isNullable) {
                        const nullablePropertyAssignment = factory.createPropertyAssignment('nullable', (0, ast_utils_1.createBooleanLiteral)(factory, true));
                        resultArray.push(nullablePropertyAssignment);
                    }
                    return resultArray;
                }
            }
        }
        const type = typeChecker.getTypeAtLocation(node);
        if (!type) {
            return [];
        }
        const typeReferenceDescriptor = (0, plugin_utils_1.getTypeReferenceAsString)(type, typeChecker);
        if (!typeReferenceDescriptor.typeName) {
            return [];
        }
        const identifier = this.typeReferenceToIdentifier(typeReferenceDescriptor, hostFilename, options, factory);
        const initializer = factory.createArrowFunction(undefined, undefined, [], undefined, undefined, identifier);
        return [factory.createPropertyAssignment(key, initializer)];
    }
    createEnumPropertyAssignment(factory, node, typeChecker, existingProperties, hostFilename, options) {
        const key = 'enum';
        if ((0, plugin_utils_1.hasPropertyKey)(key, existingProperties)) {
            return undefined;
        }
        let type = typeChecker.getTypeAtLocation(node);
        if (!type) {
            return undefined;
        }
        if ((0, plugin_utils_1.isAutoGeneratedTypeUnion)(type)) {
            const types = type.types;
            type = types[types.length - 1];
        }
        const typeIsArrayTuple = (0, plugin_utils_1.extractTypeArgumentIfArray)(type);
        if (!typeIsArrayTuple) {
            return undefined;
        }
        let isArrayType = typeIsArrayTuple.isArray;
        type = typeIsArrayTuple.type;
        const isEnumMember = type.symbol && type.symbol.flags === ts.SymbolFlags.EnumMember;
        if (!(0, ast_utils_1.isEnum)(type) || isEnumMember) {
            if (!isEnumMember) {
                type = (0, plugin_utils_1.isAutoGeneratedEnumUnion)(type, typeChecker);
            }
            if (!type) {
                return undefined;
            }
            const typeIsArrayTuple = (0, plugin_utils_1.extractTypeArgumentIfArray)(type);
            if (!typeIsArrayTuple) {
                return undefined;
            }
            isArrayType = typeIsArrayTuple.isArray;
            type = typeIsArrayTuple.type;
        }
        const typeReferenceDescriptor = { typeName: (0, ast_utils_1.getText)(type, typeChecker) };
        const enumIdentifier = this.typeReferenceToIdentifier(typeReferenceDescriptor, hostFilename, options, factory);
        const enumProperty = factory.createPropertyAssignment(key, enumIdentifier);
        if (isArrayType) {
            const isArrayKey = 'isArray';
            const isArrayProperty = factory.createPropertyAssignment(isArrayKey, factory.createIdentifier('true'));
            return [enumProperty, isArrayProperty];
        }
        return enumProperty;
    }
    createDefaultPropertyAssignment(factory, node, existingProperties) {
        const key = 'default';
        if ((0, plugin_utils_1.hasPropertyKey)(key, existingProperties)) {
            return undefined;
        }
        let initializer = node.initializer;
        if (!initializer) {
            return undefined;
        }
        if (ts.isAsExpression(initializer)) {
            initializer = initializer.expression;
        }
        return factory.createPropertyAssignment(key, initializer);
    }
    createValidationPropertyAssignments(factory, node) {
        const assignments = [];
        const decorators = ts.canHaveDecorators(node) && ts.getDecorators(node);
        this.addPropertyByValidationDecorator(factory, 'IsIn', 'enum', decorators, assignments);
        this.addPropertyByValidationDecorator(factory, 'Min', 'minimum', decorators, assignments);
        this.addPropertyByValidationDecorator(factory, 'Max', 'maximum', decorators, assignments);
        this.addPropertyByValidationDecorator(factory, 'MinLength', 'minLength', decorators, assignments);
        this.addPropertyByValidationDecorator(factory, 'MaxLength', 'maxLength', decorators, assignments);
        this.addPropertiesByValidationDecorator(factory, 'IsPositive', decorators, assignments, () => {
            return [
                factory.createPropertyAssignment('minimum', (0, ast_utils_1.createPrimitiveLiteral)(factory, 1))
            ];
        });
        this.addPropertiesByValidationDecorator(factory, 'IsNegative', decorators, assignments, () => {
            return [
                factory.createPropertyAssignment('maximum', (0, ast_utils_1.createPrimitiveLiteral)(factory, -1))
            ];
        });
        this.addPropertiesByValidationDecorator(factory, 'Length', decorators, assignments, (decoratorRef) => {
            const decoratorArguments = (0, ast_utils_1.getDecoratorArguments)(decoratorRef);
            const result = [];
            result.push(factory.createPropertyAssignment('minLength', (0, lodash_1.head)(decoratorArguments)));
            if (decoratorArguments.length > 1) {
                result.push(factory.createPropertyAssignment('maxLength', decoratorArguments[1]));
            }
            return result;
        });
        this.addPropertiesByValidationDecorator(factory, 'Matches', decorators, assignments, (decoratorRef) => {
            const decoratorArguments = (0, ast_utils_1.getDecoratorArguments)(decoratorRef);
            return [
                factory.createPropertyAssignment('pattern', (0, ast_utils_1.createPrimitiveLiteral)(factory, (0, lodash_1.head)(decoratorArguments).text))
            ];
        });
        return assignments;
    }
    addPropertyByValidationDecorator(factory, decoratorName, propertyKey, decorators, assignments) {
        this.addPropertiesByValidationDecorator(factory, decoratorName, decorators, assignments, (decoratorRef) => {
            const argument = (0, lodash_1.head)((0, ast_utils_1.getDecoratorArguments)(decoratorRef));
            const assignment = ts.isNumericLiteral(argument)
                ? ts.factory.createNumericLiteral(argument.text)
                : ts.isStringLiteral(argument)
                    ? ts.factory.createStringLiteral(argument.text)
                    : argument;
            if (assignment) {
                return [factory.createPropertyAssignment(propertyKey, assignment)];
            }
            return [];
        });
    }
    addPropertiesByValidationDecorator(factory, decoratorName, decorators, assignments, addPropertyAssignments) {
        const decoratorRef = (0, plugin_utils_1.getDecoratorOrUndefinedByNames)([decoratorName], decorators, factory);
        if (!decoratorRef) {
            return;
        }
        assignments.push(...addPropertyAssignments(decoratorRef));
    }
    addClassMetadata(node, objectLiteral, sourceFile, metadata) {
        const hostClass = node.parent;
        const className = hostClass.name && hostClass.name.getText();
        if (!className) {
            return;
        }
        const propertyName = node.name && node.name.getText(sourceFile);
        if (!propertyName ||
            (node.name && node.name.kind === ts.SyntaxKind.ComputedPropertyName)) {
            return;
        }
        metadata[propertyName] = objectLiteral;
    }
    createDescriptionAndTsDocTagPropertyAssigments(factory, node, typeChecker, existingProperties = factory.createNodeArray(), options = {}, sourceFile) {
        if (!options.introspectComments || !sourceFile) {
            return [];
        }
        const propertyAssignments = [];
        const comments = (0, ast_utils_1.getMainCommentOfNode)(node, sourceFile);
        const tags = (0, ast_utils_1.getTsDocTagsOfNode)(node, sourceFile, typeChecker);
        const keyOfComment = options.dtoKeyOfComment;
        if (!(0, plugin_utils_1.hasPropertyKey)(keyOfComment, existingProperties) && comments) {
            const descriptionPropertyAssignment = factory.createPropertyAssignment(keyOfComment, factory.createStringLiteral(comments));
            propertyAssignments.push(descriptionPropertyAssignment);
        }
        const hasExampleOrExamplesKey = (0, plugin_utils_1.hasPropertyKey)('example', existingProperties) ||
            (0, plugin_utils_1.hasPropertyKey)('examples', existingProperties);
        if (!hasExampleOrExamplesKey && tags.example?.length) {
            if (tags.example.length === 1) {
                const examplePropertyAssignment = factory.createPropertyAssignment('example', (0, ast_utils_1.createLiteralFromAnyValue)(factory, tags.example[0]));
                propertyAssignments.push(examplePropertyAssignment);
            }
            else {
                const examplesPropertyAssignment = factory.createPropertyAssignment('examples', (0, ast_utils_1.createLiteralFromAnyValue)(factory, tags.example));
                propertyAssignments.push(examplesPropertyAssignment);
            }
        }
        const hasDeprecatedKey = (0, plugin_utils_1.hasPropertyKey)('deprecated', existingProperties);
        if (!hasDeprecatedKey && tags.deprecated) {
            const deprecatedPropertyAssignment = factory.createPropertyAssignment('deprecated', (0, ast_utils_1.createLiteralFromAnyValue)(factory, tags.deprecated));
            propertyAssignments.push(deprecatedPropertyAssignment);
        }
        return propertyAssignments;
    }
    normalizeImportPath(pathToSource, path) {
        let relativePath = path_1.posix.relative(pathToSource, path);
        relativePath = relativePath[0] !== '.' ? './' + relativePath : relativePath;
        return relativePath;
    }
    typeReferenceToIdentifier(typeReferenceDescriptor, hostFilename, options, factory) {
        const { typeReference, importPath } = (0, plugin_utils_1.replaceImportPath)(typeReferenceDescriptor.typeName, hostFilename, options);
        let identifier;
        if (options.readonly && typeReference?.includes('import')) {
            if (!this._typeImports[importPath]) {
                this._typeImports[importPath] = typeReference;
            }
            let ref = `t["${importPath}"]`;
            if (typeReferenceDescriptor.isArray) {
                ref = this.wrapTypeInArray(ref, typeReferenceDescriptor.arrayDepth);
            }
            identifier = factory.createIdentifier(ref);
        }
        else {
            let ref = typeReference;
            if (typeReferenceDescriptor.isArray) {
                ref = this.wrapTypeInArray(ref, typeReferenceDescriptor.arrayDepth);
            }
            identifier = factory.createIdentifier(ref);
        }
        return identifier;
    }
    wrapTypeInArray(typeRef, arrayDepth) {
        for (let i = 0; i < arrayDepth; i++) {
            typeRef = `[${typeRef}]`;
        }
        return typeRef;
    }
}
exports.ModelClassVisitor = ModelClassVisitor;
