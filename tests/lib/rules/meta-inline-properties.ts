/**
 * @fileoverview Meta should have inline properties
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/types'
import rule from '../../../lib/rules/meta-inline-properties'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('meta-inline-properties', rule, {
  valid: ["export default { title: 'Button', args: { primary: true } }"],

  invalid: [
    {
      code: `
      const title = 'foo';
      const args = { a: 1 };
      export default { title, args };
    `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            property: 'title',
          },
          type: AST_NODE_TYPES.Property,
        },
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            property: 'args',
          },
          type: AST_NODE_TYPES.Property,
        },
      ],
    },
    {
      code: `
        export default { title: 'a' + 123 };
      `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            property: 'title',
          },
          type: AST_NODE_TYPES.Property,
        },
      ],
    },
    {
      code: `
        export default { title: \`a \${123}\` };
      `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            property: 'title',
          },
          type: AST_NODE_TYPES.Property,
        },
      ],
    },
    {
      code: `
        const title = 'a'

        export default {
          title,
          component: Badge,
        } as ComponentMeta<typeof Badge>
      `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            property: 'title',
          },
          type: AST_NODE_TYPES.Property,
        },
      ],
    },
    {
      code: `
        export default {
          title: someFunction(),
        }
      `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            property: 'title',
          },
          type: AST_NODE_TYPES.Property,
        },
      ],
    },
  ],
})
