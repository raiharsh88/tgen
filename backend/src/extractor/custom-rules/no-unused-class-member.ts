export default {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Detects unused class members',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null,
        schema: [], // No options
      },

      create(context) {
        const usedMembers = new Set();

        function markMemberAsUsed(member) {
          usedMembers.add(member.key.name);
        }

        function checkUnusedMembers(node) {
          const declaredMembers = node.body.body;

          for (const member of declaredMembers) {
            if (!usedMembers.has(member.key.name)) {
              context.report({
                node: member,
                message: `Class member is declared but never used: ${member.key.name}`,
              });
            }
          }
        }

        return {
          ClassDeclaration(node) {
            if (node.parent.type === 'ExportNamedDeclaration') {
              return; // Skip exported classes
            }

            const declaredMembers = node.body.body;

            for (const member of declaredMembers) {
              if (member.type === 'MethodDefinition' || member.type === 'ClassProperty') {
                markMemberAsUsed(member);
              }
            }
          },
          MemberExpression(node) {
            if (node.object.type === 'ThisExpression' && node.property.type === 'Identifier') {
              markMemberAsUsed(node.property);
            }
          },
          'Program:exit'() {
            const currentScope = context.getScope();
            if (currentScope.upper) {
              return; // Skip nested scopes
            }
            checkUnusedMembers(currentScope.block);
          },
        };
      },
    }
