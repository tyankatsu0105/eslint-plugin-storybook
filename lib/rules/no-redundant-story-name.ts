/**
 * @fileoverview Named exports should not use the name annotation if it is redundant to the name that would be generated by the export name
 * @author Yann Braga
 */

import { isProperty } from '../utils/ast'
import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default createStorybookRule({
  name: '',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    fixable: 'code', // Or `code` or `whitespace`
    docs: {
      description: 'A story should not have a redundant name property',
      categories: [CategoryId.CSF, CategoryId.RECOMMENDED],
      recommended: 'warn',
    },
    messages: {
      removeRedundantName: 'Remove redundant name',
      storyNameIsRedundant:
        'Named exports should not use the name annotation if it is redundant to the name that would be generated by the export name',
    },
    schema: [],
  },

  create(context: any) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //@TODO use the correct name resolver (equivalent to lodash.startcase used in @storybook/csf)
    const resolveStoryName = (str: any) =>
      str
        .replace(/([A-Z]{1,})/g, ' $1')
        .replace(/(^\w|\s\w)/g, (m: any) => m.toUpperCase())
        .split(' ')
        .filter(Boolean)
        .join(' ')
    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ExportNamedDeclaration: function (node: any) {
        // if there are specifiers, node.declaration should be null
        if (!node.declaration) return

        const { type } = node.declaration

        if (
          type === 'TSTypeAliasDeclaration' ||
          type === 'TypeAlias' ||
          type === 'TSInterfaceDeclaration' ||
          type === 'InterfaceDeclaration'
        ) {
          return
        }
        const {
          id: identifier,
          init: { properties },
        } = node.declaration.declarations[0]

        if (!properties) {
          return
        }

        const storyNameNode = properties.find(
          //@ts-ignore
          (prop) => isProperty(prop) && prop.key.name === 'name'
        )

        if (storyNameNode) {
          const { name } = identifier
          const resolvedStoryName = resolveStoryName(name)

          if (storyNameNode.value.value === resolvedStoryName) {
            context.report({
              node: storyNameNode,
              messageId: 'storyNameIsRedundant',
              suggest: [
                {
                  messageId: 'removeRedundantName',
                  fix: function (fixer: any) {
                    return fixer.remove(storyNameNode)
                  },
                },
              ],
            })
          }
        }
      },
    }
  },
})
