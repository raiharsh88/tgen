"use strict";var t={meta:{type:"error",docs:{description:"Detects unused class members",category:"Best Practices",recommended:!0},fixable:null,schema:[]},create(o){let a=new Set;function n(e){a.add(e.key.name)}function c(e){let s=e.body.body;for(let r of s)a.has(r.key.name)||o.report({node:r,message:`Class member is declared but never used: ${r.key.name}`})}return{ClassDeclaration(e){if(e.parent.type==="ExportNamedDeclaration")return;let s=e.body.body;for(let r of s)(r.type==="MethodDefinition"||r.type==="ClassProperty")&&n(r)},MemberExpression(e){e.object.type==="ThisExpression"&&e.property.type==="Identifier"&&n(e.property)},"Program:exit"(){let e=o.getScope();e.upper||c(e.block)}}}};module.exports={rules:{"no-unused-class-member":{meta:t.meta,create:t.create}}};